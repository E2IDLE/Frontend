import { useState } from "react";
import Logo from "./Logo";
import { toast } from "../utils/toast";
import { useLang, NAV_TABS } from "../i18n";

export default function AppNav({ tab, setTab, setPage, avatar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, t } = useLang();

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
        <div style={{ position:"relative" }}>
          <button className="avatar-btn" onClick={() => setMenuOpen(p => !p)}>{(avatar || "ML").slice(0,2).toUpperCase()}</button>
          {menuOpen && (
            <div className="avatar-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button className="avatar-menu-item" onClick={() => { setTab("profile"); setMenuOpen(false); }}>{t.menuProfile}</button>
              <button className="avatar-menu-item" onClick={() => { setTab("system"); setMenuOpen(false); }}>{t.menuSettings}</button>
              <button className="avatar-menu-item" onClick={() => { setTab("payment"); setMenuOpen(false); }}>{t.menuSubscription}</button>
              <div style={{ height:1,background:"var(--border)",margin:"4px 0" }} />
              <button className="avatar-menu-item danger" onClick={() => { toast(t.toastLogout, "warn"); setTimeout(() => setPage("landing"), 700); setMenuOpen(false); }}>{t.menuLogout}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
