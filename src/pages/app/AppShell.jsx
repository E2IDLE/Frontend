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
  // const prevAddrRef = useRef("");

  useEffect(() => {
    const pollAgentAndRegister = async () => {
      try {
        const res = await agentCall("GET", "/status");
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
              console.log("✅ 서버에 에이전트 등록 성공:", data.multiAddress);
              prevAddrRef.current = data.multiAddress;
            } catch (err) {
              console.error("❌ 서버 등록 실패:", err);
            }
          }
        }
      } catch (err) {
        console.error("Agent Polling Error:", err);
        setAgentInfo(null);
      }
    };
    pollAgentAndRegister();
    const interval = setInterval(pollAgentAndRegister, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePeerJoined = useCallback((data) => {
    const name = data?.peerNickname ?? data?.peerName ?? data?.nickname ?? data?.peer_name ?? "알 수 없음";
    const sessionId = data?.sessionId ?? data?.session_id;
    const peerId = data?.peerId ?? data?.peer_id;
    const multiAddress = data?.multiAddress ?? data?.multi_address;
    const inviteCode = data?.inviteCode ?? data?.invite_code;
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { id, name, sessionId, peerId, multiAddress, inviteCode }]);
  }, []);

  const handleStatusChanged = useCallback((data) => {
    const status = data?.status;
    if (status === "connected") toast("P2P 연결 완료!", "ok");
    else if (status === "completed") toast("전송이 완료되었습니다.", "ok");
    else if (status === "error") toast("연결 중 오류가 발생했습니다.", "err");
  }, []);

  const handlePeerDisconnected = useCallback(() => {
    toast("상대방 연결이 끊어졌습니다.", "warn");
  }, []);

  const handleConnectionRequest = useCallback((data) => {
    const name = data?.senderNickname ?? "알 수 없음";
    const sessionId = data?.sessionId;
    const inviteCode = data?.inviteCode;
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { id, name, sessionId, inviteCode }]);
    toast(`${name}님이 연결을 신청했습니다.`, "ok");
  }, []);

  const handleNotification = useCallback((data) => {
    const title = data?.title || "알림";
    const message = data?.message || "새로운 메시지가 도착했습니다.";
    toast(`${title}: ${message}`, "ok");
  }, []);

  const { connect, disconnect } = useWebSocket({
    onPeerJoined: handlePeerJoined,
    onStatusChanged: handleStatusChanged,
    onPeerDisconnected: handlePeerDisconnected,
    onConnectionRequest: handleConnectionRequest,
    onNotification: handleNotification,
  });

  useEffect(() => {
    setUnauthHandler(() => {
      toast("세션이 만료되었습니다. 다시 로그인해주세요.", "warn");
      setPage("login");
    });
    const token = getToken();
    if (token) connect(token);
    return () => disconnect();
  }, []);

  const acceptNotification = async (id, name, sessionId, peerId, multiAddress, t, inviteCode) => {
    let targetPeerId = peerId;
    let targetMultiAddress = multiAddress;
    if (sessionId) {
      try {
        const res = await apiFetch(`/sessions/${sessionId}/join`, {
          method: "POST",
          body: JSON.stringify({ inviteCode }),
        });
        if (!res.ok) {
          if (res.status === 404) toast("세션이 만료되었습니다.", "warn");
          else toast("연결 수락에 실패했습니다.", "err");
          setNotifications(prev => prev.filter(n => n.id !== id));
          return;
        }
        const joinData = await res.json().catch(() => ({}));
        console.log("서버에서 받은 조인 데이터:", joinData);
        if (joinData.peerId) targetPeerId = joinData.peerId;
        if (joinData.multiAddress) targetMultiAddress = joinData.multiAddress;
      } catch (err) {
        console.error("Join Error:", err);
        toast("서버에 연결할 수 없습니다.", "err");
        return;
      }
    }
    if (targetPeerId && targetMultiAddress) {
      try {
        toast("에이전트와 피어 연결을 시도합니다...", "ok");
        const res = await agentCall("POST", "/peers", {
          peerId: targetPeerId,
          peerMultiAddress: targetMultiAddress
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          const code = json?.errorCode;
          if (code === "E3002") toast("피어 연결에 실패했습니다.", "err");
          else if (code === "E5002") toast("홀펀칭 실패. 릴레이(TURN)로 전환합니다.", "warn");
          else toast("피어 연결 실패 (에이전트 에러)", "err");
          return;
        }
        setConnectedPeers(prev => [...prev, { peerId: targetPeerId, nickname: name }]);
        toast(`${name}님과 P2P 연결이 완료되었습니다!`, "ok");
      } catch (err) {
        console.error("Agent Call Error:", err);
        toast("에이전트가 실행 중인지 확인해주세요.", "err");
        return;
      }
    } else {
      console.warn("홀펀칭 실패: peerId 또는 multiAddress가 없습니다.");
      toast("연결 정보가 부족하여 P2P 터널을 생성할 수 없습니다.", "err");
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const rejectNotification = async (id, sessionId) => {
    if (sessionId) {
      try {
        await apiFetch(`/sessions/${sessionId}`, { method: "DELETE" });
      } catch { }
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast("연결 신청을 거절했습니다.", "warn");
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    clearToken();
    disconnect();
    toast("로그아웃되었습니다.", "warn");
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
          {tab === "editor" && <Editor agentInfo={agentInfo} connectedPeers={connectedPeers} />}
          {tab === "friends" && <TeamSettings />}
          {tab === "system" && <SystemSettings />}
          {tab === "payment" && <Payment />}
          {tab === "profile" && <ProfileEdit onAvatarChange={setAvatar} onLangChange={setLang} />}
        </div>
      </div>
    </LangProvider>
  );
}