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
import { apiFetch, clearToken, getToken, setUnauthHandler } from "../../utils/api";
import { useWebSocket } from "../../hooks/useWebSocket";

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

  // WebSocket event handlers (stable references via useCallback)
  const handlePeerJoined = useCallback((data) => {
    const name = data?.peerName ?? data?.nickname ?? data?.peer_name ?? "알 수 없음";
    const sessionId = data?.sessionId ?? data?.session_id;
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { id, name, sessionId }]);
  }, []);

  const handleStatusChanged = useCallback((data) => {
    const status = data?.status;
    if (status === "connected") toast("P2P 연결 완료!", "ok");
    else if (status === "completed") toast("전송이 완료되었습니다.", "ok");
    else if (status === "error") toast("연결 중 오류가 발생했습니다.", "err");
  }, []);

  const { connect, disconnect } = useWebSocket({
    onPeerJoined: handlePeerJoined,
    onStatusChanged: handleStatusChanged,
  });

  // Connect WebSocket on mount (token already in localStorage after login)
  useEffect(() => {
    // TODO: 서버 준비 후 주석 해제
    // setUnauthHandler(() => {
    //   toast("세션이 만료되었습니다. 다시 로그인해주세요.", "warn");
    //   setPage("login");
    // });
    // const token = getToken();
    // if (token) connect(token);
    // return () => disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Test notification (used by Editor test button — no sessionId)
  const addNotification = (name) => {
    const id = notifIdRef.current++;
    setNotifications(prev => [...prev, { id, name, sessionId: null }]);
  };

  const acceptNotification = async (id, name, sessionId, t) => {
    // TODO: 서버 준비 후 주석 해제
    // if (sessionId) {
    //   try {
    //     await apiFetch(`/sessions/${sessionId}/join`, { method: "POST" });
    //   } catch {
    //     toast("서버에 연결할 수 없습니다.", "err");
    //     return;
    //   }
    // }

    // 더미: 즉시 수락 처리
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast(t.toastSessionJoined, "ok");
  };

  const rejectNotification = async (id, sessionId, t) => {
    // TODO: 서버 준비 후 주석 해제
    // if (sessionId) {
    //   try {
    //     await apiFetch(`/sessions/${sessionId}`, { method: "DELETE" });
    //   } catch {
    //     toast("서버에 연결할 수 없습니다.", "err");
    //     return;
    //   }
    // }

    // 더미: 즉시 거절 처리
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast(t.toastRejected, "info");
  };

  const markAllRead = () => setNotifications([]);

  const handleLogout = async () => {
    // TODO: 서버 준비 후 주석 해제
    // try {
    //   await apiFetch("/auth/logout", { method: "POST" });
    // } catch {}
    // clearToken();
    // disconnect();

    // 더미: 즉시 로그아웃 처리
    setTimeout(() => setPage("landing"), 700);
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
          onMarkAllRead={markAllRead}
        />
        <Sidebar tab={tab} setTab={setTab} />
        <div className="app-main">
          {tab === "editor"  && <Editor onAddNotification={addNotification} />}
          {tab === "friends" && <TeamSettings />}
          {tab === "system"  && <SystemSettings />}
          {tab === "payment" && <Payment />}
          {tab === "profile" && <ProfileEdit onAvatarChange={setAvatar} onLangChange={setLang} />}
        </div>
      </div>
    </LangProvider>
  );
}
