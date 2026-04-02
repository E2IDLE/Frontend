import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { toast } from "../utils/toast";
import { useLang, NAV_TABS } from "../i18n";

export default function AppNav({ tab, setTab, setPage, avatar, notifications = [], onAccept, onReject, onLogout, onMarkAllRead }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const { lang, t } = useLang();
  const bellRef = useRef(null);

  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  const unread = notifications.length;

  return (
    <nav className="app-nav">
      <div style={{ display:"flex",alignItems:"center",gap:20 }}>
        <Logo onClick={() => setPage("landing")} />
        <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text2)",letterSpacing:"0.06em" }}>{t.navSubtitle}</span>
      </div>
      <div style={{ display:"flex",alignItems:"center" }}>
        {NAV_TABS.map(({ key, ko, en }) => (
          <button key={key} className={`app-tab${tab===key?" active":""}`} onClick={() => setTab(key)}>
            {lang === "en" ? en : ko}
          </button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <div className="transfer-pill"><span className="transfer-dot" />{t.transferring}</div>

        {/* Bell icon */}
        <div style={{ position:"relative" }} ref={bellRef}>
          <button className="bell-btn" onClick={() => setBellOpen(p => !p)}>
            🔔
            {unread > 0 && <span className="bell-badge">{unread > 9 ? "9+" : unread}</span>}
          </button>
          {bellOpen && (
            <div className="bell-dropdown">
              <div style={{ padding:"8px 12px", borderBottom:"1px solid var(--border)", fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:".08em", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span>{t.bellTitle}</span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => { onMarkAllRead?.(); }}
                    style={{ background:"none", border:"none", color:"var(--accent2)", fontFamily:"var(--mono)", fontSize:9, cursor:"pointer", padding:0, letterSpacing:".04em" }}
                  >
                    {t.bellMarkAllRead}
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding:"20px 12px", fontFamily:"var(--mono)", fontSize:11, color:"var(--text3)", textAlign:"center" }}>
                  {t.bellEmpty}
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ padding:"10px 12px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
                    <div className="notif-avatar">{n.name.slice(0,2).toUpperCase()}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, color:"var(--text)", marginBottom:2, fontWeight:600 }}>{n.name}</div>
                      <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>{t.bellRequestMsg}</div>
                    </div>
                    <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                      <button className="btn-sm-blue" style={{ padding:"3px 8px" }}
                              onClick={() => onAccept(n.id, n.name, n.sessionId, n.peerId, n.multiAddress, t, n.inviteCode)}>
                        {t.bellAccept}
                      </button>
                      <button className="btn-sm-red" style={{ padding:"3px 8px" }}
                              onClick={() => onReject(n.id, n.sessionId)}>
                        {t.bellReject}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ position:"relative" }}>
          <button className="avatar-btn" onClick={() => setMenuOpen(p => !p)}>{(avatar || "ML").slice(0,2).toUpperCase()}</button>
          {menuOpen && (
            <div className="avatar-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button className="avatar-menu-item" onClick={() => { setTab("profile"); setMenuOpen(false); }}>{t.menuProfile}</button>
              <button className="avatar-menu-item" onClick={() => { setTab("system"); setMenuOpen(false); }}>{t.menuSettings}</button>
              <button className="avatar-menu-item" onClick={() => { setTab("payment"); setMenuOpen(false); }}>{t.menuSubscription}</button>
              <div style={{ height:1,background:"var(--border)",margin:"4px 0" }} />
              <button className="avatar-menu-item danger" onClick={() => { toast(t.toastLogout, "warn"); setMenuOpen(false); onLogout?.(); }}>{t.menuLogout}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
