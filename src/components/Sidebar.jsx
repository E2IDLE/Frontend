import { toast } from "../utils/toast";

export default function Sidebar({ tab, setTab }) {
  return (
    <div className="sidebar">
      <div style={{ padding:"14px 10px 6px" }}>
        <div className="sidebar-label">WORKSPACE</div>
        {[{ icon:"◈", label:"/p / v1", active:true }, { icon:"◫", label:"미디어 가져오기" }].map(i => (
          <div key={i.label} className={`sidebar-item${i.active?" active":""}`}
            onClick={() => !i.active && toast("미디어 파일을 선택해주세요.", "info")}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}><span>{i.icon}</span>{i.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height:1,background:"var(--border)",margin:"6px 10px" }} />
      <div style={{ padding:"8px 10px" }}>
        <div className="sidebar-label">현재 활동 상태</div>
        <div className="sidebar-item" onClick={() => toast("편집 중인 멤버 목록을 확인합니다.", "info")}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ color:"var(--green)" }}>●</span>편집 중</div>
          <span className="sidebar-badge">04</span>
        </div>
        <div className="sidebar-item" onClick={() => toast("대기 중인 멤버를 확인합니다.", "info")}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ color:"var(--yellow)" }}>●</span>대기 중</div>
          <span className="sidebar-badge">08</span>
        </div>
      </div>
      <div style={{ height:1,background:"var(--border)",margin:"6px 10px" }} />
      <div style={{ padding:"8px 10px" }}>
        <div className="sidebar-label">NAVIGATE</div>
        {["팀 설정","시스템 설정","구독 플랜"].map(t => (
          <div key={t} className={`sidebar-item${tab===t?" active":""}`} onClick={() => setTab(t)}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span>{t==="팀 설정"?"👥":t==="시스템 설정"?"⚙":"💳"}</span>{t}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:"auto",padding:12,borderTop:"1px solid var(--border)" }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginBottom:4 }}>WORKSPACE USAGE — 62%</div>
        <div style={{ height:3,background:"var(--border)",borderRadius:2,margin:"6px 0 8px" }}>
          <div style={{ height:"100%",width:"62%",background:"var(--accent)",borderRadius:2 }} />
        </div>
        <button className="btn-sm-blue" style={{ width:"100%",marginBottom:6 }} onClick={() => setTab("구독 플랜")}>Upgrade Plan</button>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",textAlign:"center" }}>Media Lead · Admin</div>
      </div>
    </div>
  );
}
