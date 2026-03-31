import { toast } from "../utils/toast";
import { useLang, NAV_TABS } from "../i18n";

export default function Sidebar({ tab, setTab }) {
  const { lang, t } = useLang();

  const sideNavTabs = NAV_TABS.filter(({ key }) => key !== "editor");
  const icons = { friends: "👥", system: "⚙", payment: "💳" };

  return (
    <div className="sidebar">
      <div style={{ padding:"14px 10px 6px" }}>
        <div className="sidebar-label">WORKSPACE</div>
        <div className="sidebar-item active">
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><span>◈</span>/p / v1</div>
        </div>
      </div>
      <div style={{ height:1,background:"var(--border)",margin:"6px 10px" }} />
      <div style={{ padding:"8px 10px" }}>
        <div className="sidebar-label">{t.currentActivity}</div>
        <div className="sidebar-item" onClick={() => toast(t.toastTransferring, "info")}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ color:"var(--green)" }}>●</span>{t.statusActive}</div>
          <span className="sidebar-badge">04</span>
        </div>
        <div className="sidebar-item" onClick={() => toast(t.toastIdle, "info")}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ color:"var(--yellow)" }}>●</span>{t.statusIdle}</div>
          <span className="sidebar-badge">08</span>
        </div>
      </div>
      <div style={{ height:1,background:"var(--border)",margin:"6px 10px" }} />
      <div style={{ padding:"8px 10px" }}>
        <div className="sidebar-label">NAVIGATE</div>
        {sideNavTabs.map(({ key, ko, en }) => (
          <div key={key} className={`sidebar-item${tab===key?" active":""}`} onClick={() => setTab(key)}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span>{icons[key]}</span>{lang === "en" ? en : ko}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:"auto",padding:12,borderTop:"1px solid var(--border)" }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginBottom:4 }}>WORKSPACE USAGE — 62%</div>
        <div style={{ height:3,background:"var(--border)",borderRadius:2,margin:"6px 0 8px" }}>
          <div style={{ height:"100%",width:"62%",background:"var(--accent)",borderRadius:2 }} />
        </div>
        <button className="btn-sm-blue" style={{ width:"100%",marginBottom:6 }} onClick={() => setTab("payment")}>{t.upgradePlan}</button>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",textAlign:"center" }}>Media Lead · Admin</div>
      </div>
    </div>
  );
}
