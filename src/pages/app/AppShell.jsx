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

  // 1. 에이전트 등록 함수 분리
  const registerAgent = useCallback(async (agentData) => {
    try {
      await apiFetch("/users/me/agents", {
        method: "POST",
        body: JSON.stringify({
          deviceName: agentData.agentName || `Device-${agentData.peerId?.substring(0, 5) || "MyDevice"}`,
          platform: "windows",
          agentVersion: agentData.agentVersion || "1.0.0",
          multiaddress: agentData.multiAddress 
        }),
      });
      console.log("✅ 서버에 에이전트 등록 성공:", agentData.multiAddress);
      prevAddrRef.current = agentData.multiAddress;
    } catch (err) {
      console.error("❌ 서버 등록 실패:", err);
    }
  }, []);

  // 에이전트 상태 폴링 및 변경 시 자동 등록
  useEffect(() => {
    const pollAgentAndRegister = async () => {
      try {
        const res = await agentCall("GET", "/status");
        if (!res.ok) return; // 에이전트가 꺼져있으면 무시
        const data = await res.json();

        if (data && data.multiAddress) {
          setAgentInfo(data);
          
          // multiAddress가 존재하고, 이전 주소와 다르면 재등록
          if (data.multiAddress !== prevAddrRef.current) {
            await registerAgent(data);
          }
        }
      } catch (err) {
        // 에이전트 연결 오류는 무시하되 상태 초기화 (토스트는 띄우지 않음 - 너무 자주 뜰 수 있음)
        setAgentInfo(null);
      }
    };

    pollAgentAndRegister(); // 마운트 시 즉시 실행
    const interval = setInterval(pollAgentAndRegister, 10000); // 10초마다 체크
    return () => clearInterval(interval);
  }, [registerAgent]);


  // 3. WebSocket 이벤트 핸들러 처리
  const handlePeerJoined = useCallback((data) => {
    const name = data?.peerNickname ?? data?.peerName ?? data?.nickname ?? data?.peer_name ?? "알 수 없음";
    const sessionId = data?.sessionId ?? data?.session_id;
    const peerId = data?.peerId ?? data?.peer_id; // 🔥 B의 userId
    const inviteCode = data?.inviteCode ?? data?.invite_code;
    const id = notifIdRef.current++;
    
    // 벨 알림 추가
    setNotifications(prev => [...prev, { 
      id, name, sessionId, peerId, inviteCode, 
      msg: `${name}님이 연결을 요청했습니다.` // 요구사항에 맞춤
    }]);
  }, []);

  const handleStatusChanged = useCallback(async (data) => {
    const status = data?.status;
    
    if (status === "connected") {
      // A 입장에서 B가 수락했을 때 -> 상대방 multiAddress 조회 후 에이전트 전달
      try {
        // 이벤트 데이터에 따라 상대방 ID를 가져옴 (receiverId 또는 peerId)
        const targetId = data?.receiverId || data?.peerId; 
        
        if (targetId) {
          const agentsRes = await apiFetch(`/users/me/agents?userID=${targetId}`);
          if (agentsRes.ok) {
            const agents = await agentsRes.json();
            const onlineAgent = agents.find(a => a.status === "online");
            
            if (onlineAgent && onlineAgent.multiaddress) {
              await agentCall("POST", "/peers", {
                peerId: targetId,
                peerMultiAddress: onlineAgent.multiaddress
              });
            }
          }
        }
      } catch (err) { 
        console.error("Status Changed Peer Connection Error:", err); 
      }
      toast("P2P 연결 완료!", "ok");
    } 
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
    const peerId = data?.senderId ?? data?.peerId; // 🔥 notif에 peerId 저장 추가!
    const id = notifIdRef.current++;
    
    setNotifications(prev => [...prev, { id, name, sessionId, inviteCode, peerId }]);
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
  }, [connect, disconnect, setPage]);

  // 2. 알림 수락 버튼 핸들러
  const acceptNotification = async (id, name, sessionId, peerId, multiAddress, t, inviteCode) => {
    try {
      // 1. 세션 참가
      if (sessionId) {
        const joinRes = await apiFetch(`/sessions/${sessionId}/join`, {
          method: "POST",
          body: JSON.stringify({ inviteCode }),
        });

        if (!joinRes.ok) {
          if (joinRes.status === 404) toast("세션이 만료되었습니다.", "warn");
          else toast("연결 수락에 실패했습니다.", "err");
          setNotifications(prev => prev.filter(n => n.id !== id));
          return;
        }
      }

      // 2. 상대방(A) multiAddress 조회
      if (!peerId) {
        toast("상대방 정보(ID)가 누락되어 연결할 수 없습니다.", "err");
        setNotifications(prev => prev.filter(n => n.id !== id));
        return;
      }

      const agentsRes = await apiFetch(`/users/me/agents?userID=${peerId}`);
      if (!agentsRes.ok) {
        toast("상대방 에이전트 정보를 가져오지 못했습니다.", "err");
        setNotifications(prev => prev.filter(n => n.id !== id));
        return;
      }

      const agents = await agentsRes.json();
      const onlineAgent = agents.find(a => a.status === "online");

      if (!onlineAgent || !onlineAgent.multiaddress) {
        toast("상대방 에이전트가 오프라인이거나 주소가 없습니다.", "warn");
        setNotifications(prev => prev.filter(n => n.id !== id));
        return;
      }

      // 3. 내 에이전트에 상대방 정보 전달 -> 홀펀칭 시작
      const peerRes = await agentCall("POST", "/peers", {
        peerId: peerId,
        peerMultiAddress: onlineAgent.multiaddress
      });

      if (peerRes.ok) {
        toast("연결을 시작합니다!", "ok");
        setConnectedPeers(prev => [...prev, { peerId: peerId, nickname: name }]);
      } else {
        toast("에이전트 연결에 실패했습니다.", "err");
      }
    } catch (err) {
      toast("서버에 연결할 수 없습니다.", "err");
    }

    // 작업 후 알림 삭제
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const rejectNotification = async (id, sessionId) => {
    if (sessionId) {
      try {
        await apiFetch(`/sessions/${sessionId}`, { method: "DELETE" });
      } catch { /* 에러 무시 */ }
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