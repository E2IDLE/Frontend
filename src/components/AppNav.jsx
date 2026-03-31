import { useState } from "react";
import Logo from "./Logo";
import { toast } from "../utils/toast";

export default function AppNav({ tab, setTab, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="app-nav">
      <div style={{ display:"flex",alignItems:"center",gap:20 }}>
        <Logo onClick={() => setPage("landing")} />
        <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text2)",letterSpacing:"0.06em" }}>다이렉트 P2P 프로젝트 편집</span>
      </div>
      <div style={{ display:"flex",alignItems:"center" }}>
        {["편집 툴","팀 설정","시스템 설정","구독 플랜"].map(t => (
          <button key={t} className={`app-tab${tab===t?" active":""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <div className="transfer-pill"><span className="transfer-dot" />영상 전송 중</div>
        <div style={{ position:"relative" }}>
          <button className="avatar-btn" onClick={() => setMenuOpen(p => !p)}>ML</button>
          {menuOpen && (
            <div className="avatar-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button className="avatar-menu-item" onClick={() => { toast("프로필 편집 페이지로 이동합니다.", "info"); setMenuOpen(false); }}>👤 프로필 편집</button>
              <button className="avatar-menu-item" onClick={() => { setTab("시스템 설정"); setMenuOpen(false); }}>⚙ 설정</button>
              <button className="avatar-menu-item" onClick={() => { setTab("구독 플랜"); setMenuOpen(false); }}>💳 구독 관리</button>
              <div style={{ height:1,background:"var(--border)",margin:"4px 0" }} />
              <button className="avatar-menu-item danger" onClick={() => { toast("로그아웃되었습니다.", "warn"); setTimeout(() => setPage("landing"), 700); setMenuOpen(false); }}>↩ 로그아웃</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
