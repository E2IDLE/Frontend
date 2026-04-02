import { useState, useRef, useEffect, useCallback } from "react";
import AppNav from "../../components/AppNav";
import Sidebar from "../../components/Sidebar";
import Editor from "./Editor";
import TeamSettings from "./TeamSettings";
import SystemSettings from "./SystemSettings";
import Payment from "./Payment";
import ProfileEdit from "./ProfileEdit";
import { LangProvider } from "../../i18n";
import { toast } from "../../utils/toast";
import { apiFetch, agentCall, clearToken, getToken, setUnauthHandler } from "../../utils/api";
import { useWebSocket } from "../../hooks/useWebSocket";

const AGENT_VALID_STATUSES = ["idle", "connected", "transferring"];

function loadAvatar() {
  try {
    const raw = localStorage.getItem("profile_form");
    if (!raw) return "ML";
    const { data } = JSON.parse(raw);
    return data?.avatar || "ML";
  } catch { return "ML"; }
}

function loadLang() {
  try {
    const raw = localStorage.getItem("profile_form");
    if (!raw) return "ko";
    const { data } = JSON.parse(raw);
    return data?.language || "ko";
  } catch { return "ko"; }
}

export default function AppShell({ setPage }) {
  const [tab, setTab] = useState("editor");
  const [avatar, setAvatar] = useState(loadAvatar);
  const [lang, setLang] = useState(loadLang);
  const [notifications, setNotifications] = useState([]);
  const notifIdRef = useRef(1);
  const [agentInfo, setAgentInfo] = useState(null);
  const [connectedPeers, setConnectedPeers] = useState([]);
  const prevAddrRef = useRef("");

  // 1. 에이전트 상태 확인 및 서버 등록 로직
  useEffect(() => {
    const pollAgentAndRegister = async () => {
      try {
        const res = await agentCall("GET", "/status");
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (data && data.multiAddress) {
          setAgentInfo(data);
          if (data.multiAddress !== prevAddrRef.current) {
            try {
              await apiFetch("/users/me/agents", {
                method: "POST",
                body: JSON.stringify({
                  deviceName: data.agentName || `Device-${data.peerId?.substring(0, 5)}`,
                  platform: "windows", 
                  agentVersion: data.agentVersion || "1.0.0",
                  multiaddress: data.multiAddress 
                }),
              });
              console.log("✅ 서버 등록 성공:", data.multiAddress);
              prevAddrRef.current = data.multiAddress;
            } catch (err) {
              console.error("❌ 서버 등록 실패:", err);
            }
          }
        }
      } catch (err) {
        setAgentInfo(null);
      }
    };

    pollAgentAndRegister();
    const interval = setInterval(pollAgentAndRegister, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. WebSocket 이벤트 핸들러들
  const handlePeerJoined = useCallback((data) => {
    const name = data?.peerNickname ?? data?.peerName ?? data?.nickname ?? "알 수 없음";
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { 
      id, name, 
      sessionId: data?.sessionId ?? data?.session_id, 
      peerId: data?.peerId ?? data?.peer_id, 
      multiAddress: data?.multiAddress ?? data?.multi_address, 
      inviteCode: data?.inviteCode ?? data?.invite_code 
    }]);
  }, []);

  const handleStatusChanged = useCallback((data) => {
    const status = data?.status;
    if (status === "connected") toast("P2P 연결 완료!", "ok");
    else if (status === "error") toast("연결 중 오류 발생", "err");
  }, []);

  const handlePeerDisconnected = useCallback(() => {
    toast("상대방 연결이 끊어졌습니다.", "warn");
  }, []);

  const handleConnectionRequest = useCallback((data) => {
    const name = data?.senderNickname ?? "알 수 없음";
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { id, name, sessionId: data?.sessionId, inviteCode: data?.inviteCode }]);
    toast(`${name}님이 연결을 신청했습니다.`, "ok");
  }, []);

  const handleNotification = useCallback((data) => {
    toast(`${data?.title || "알림"}: ${data?.message || "메시지 도착"}`, "ok");
  }, []);

  const { connect, disconnect } = useWebSocket({
    onPeerJoined: handlePeerJoined,
    onStatusChanged: handleStatusChanged,
    onPeerDisconnected: handlePeerDisconnected,
    onConnectionRequest: handleConnectionRequest,
    onNotification: handleNotification,
  });

  // 3. 🔥 [수정됨] WebSocket 연결 로직 (의존성 비움)
  useEffect(() => {
    setUnauthHandler(() => {
      setPage("login");
    });
    const token = getToken();
    if (token) connect(token);

    return () => {
      if (disconnect) disconnect();
    };
  }, []); // 👈 의존성 배열을 비워야 무한 루프가 안 생깁니다!

  // 4. 연결 수락 로직
  const acceptNotification = async (id, name, sessionId, peerId, multiAddress, t, inviteCode) => {
    let targetPeerId = peerId;
    let targetMultiAddress = multiAddress;

    if (sessionId) {
      try {
        const res = await apiFetch(`/sessions/${sessionId}/join`, {
          method: "POST",
          body: JSON.stringify({ inviteCode }),
        });
        if (res.ok) {
          const joinData = await res.json();
          if (joinData.peerId) targetPeerId = joinData.peerId;
          if (joinData.multiAddress) targetMultiAddress = joinData.multiAddress;
        }
      } catch (err) {
        toast("서버 연결 실패", "err");
        return;
      }
    }

    if (targetPeerId && targetMultiAddress) {
      try {
        const res = await agentCall("POST", "/peers", { peerId: targetPeerId, peerMultiAddress: targetMultiAddress });
        if (res.ok) {
          setConnectedPeers(prev => [...prev, { peerId: targetPeerId, nickname: name }]);
          toast("연결 성공!", "ok");
        }
      } catch (err) {
        toast("에이전트 연결 실패", "err");
      }
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const rejectNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = async () => {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch {}
    clearToken();
    disconnect();
    setPage("landing");
  };

  return (
    <LangProvider lang={lang}>
      <div className="app-shell">
        <AppNav
          tab={tab} setTab={setTab} setPage={setPage} avatar={avatar}
          notifications={notifications}
          onAccept={acceptNotification}
          onReject={rejectNotification}
          onLogout={handleLogout}
          onMarkAllRead={() => setNotifications([])}
        />
        <Sidebar tab={tab} setTab={setTab} agentInfo={agentInfo} />
        <div className="app-main">
          {tab === "editor"  && <Editor agentInfo={agentInfo} connectedPeers={connectedPeers} />}
          {tab === "friends" && <TeamSettings />}
          {tab === "system"  && <SystemSettings />}
          {tab === "payment" && <Payment />}
          {tab === "profile" && <ProfileEdit onAvatarChange={setAvatar} onLangChange={setLang} />}
        </div>
      </div>
    </LangProvider>
  );
}