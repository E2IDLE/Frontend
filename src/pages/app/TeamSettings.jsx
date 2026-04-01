import { useState } from "react";
import Modal from "../../components/Modal";
import { toast } from "../../utils/toast";
import { useLang } from "../../i18n";
// import { apiFetch } from "../../utils/api"; // TODO: 서버 준비 후 주석 해제

const ITEMS_PER_PAGE = 4;

const BASE_MEMBERS = [
  { name:"김철수",  email:"chulsoo.k@mediagrid.p2p",  role:"촬영 감독",    location:"현장 A (서울)",   badge:"admin",  status:"active",  label:"active",  init:"ST" },
  { name:"이영희",  email:"yh.lee@mediagrid.p2p",     role:"메인 에디터",   location:"편집실 B (부산)", badge:"editor", status:"idle",    label:"idle",    init:"JA" },
  { name:"김가연",  email:"jimin.p@mediagrid.p2p",    role:"색보정 전문가", location:"본사 (인천)",    badge:"editor", status:"active",  label:"active",  init:"LA" },
  { name:"김나연",  email:"assist.a@mediagrid.p2p",   role:"어시스턴트",   location:"오프라인",       badge:"viewer", status:"offline", label:"offline", init:"AS" },
  { name:"김다연",  email:"dk.kim@mediagrid.p2p",     role:"사운드 디자인", location:"원격 (대구)",    badge:"editor", status:"idle",    label:"idle",    init:"KD" },
];

const MEMBERS_VERSION = 2;

function loadMembers() {
  try {
    const raw = localStorage.getItem("team_members");
    if (!raw) return BASE_MEMBERS;
    const { version, data } = JSON.parse(raw);
    if (version !== MEMBERS_VERSION) return BASE_MEMBERS;
    return data;
  } catch { return BASE_MEMBERS; }
}

function saveMembers(members) {
  localStorage.setItem("team_members", JSON.stringify({ version: MEMBERS_VERSION, data: members }));
}

async function sendConnectionRequest(targetEmail, name, t) {
  // TODO: 서버 준비 후 아래 더미 제거 및 실제 API 블록 주석 해제
  toast(t.toastSessionCreated, "ok");

  // --- 실제 API 연동 ---
  // try {
  //   const res = await apiFetch("/sessions", {
  //     method: "POST",
  //     body: JSON.stringify({ targetEmail }),
  //   });
  //   if (res.status === 201 || res.status === 200) {
  //     toast(t.toastSessionCreated, "ok");
  //   } else {
  //     toast(t.toastNetworkError, "err");
  //   }
  // } catch {
  //   toast(t.toastNetworkError, "err");
  // }
}

export default function TeamSettings() {
  const [members, setMembersRaw] = useState(loadMembers);
  const [invite, setInvite] = useState("");
  const [pg, setPg] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const { t } = useLang();

  const setMembers = (updater) => {
    setMembersRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveMembers(next);
      return next;
    });
  };

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const visible = members.slice((pg-1)*ITEMS_PER_PAGE, pg*ITEMS_PER_PAGE);

  const statusLabel = (label) => {
    if (label === "active") return t.statusActive;
    if (label === "idle") return t.statusIdle;
    if (label === "offline") return t.statusOffline;
    return label;
  };

  const doInvite = () => {
    if (!invite.includes("@")) { toast(t.toastInvalidEmail, "err"); return; }
    if (members.find(m=>m.email===invite)) { toast(t.toastAlreadyInvited, "warn"); return; }
    const nm = { name:invite.split("@")[0], email:invite, role:t.newMemberRole, location:"—", badge:"viewer", status:"offline", label:"offline", init:invite[0].toUpperCase() };
    setMembers(p=>[...p,nm]);
    toast(t.toastInviteSent(invite), "ok");
    setInvite("");
    setPg(Math.ceil((members.length+1)/ITEMS_PER_PAGE));
  };

  const remove = (email) => { setMembers(p=>p.filter(m=>m.email!==email)); toast(t.toastRemoved, "warn"); setSelected(null); };

  return (
    <div style={{ padding:24,flex:1 }}>
      {detailModal && (
        <Modal title={detailModal.name} sub={t.modalSub(detailModal.email, detailModal.role, detailModal.location)} onClose={()=>setDetailModal(null)}>
          <button className="btn-sm-blue" style={{width:"100%",marginBottom:8}} onClick={()=>{sendConnectionRequest(detailModal.email,detailModal.name,t);setDetailModal(null);}}>{t.connectBtn}</button>
          {detailModal.badge!=="admin" && <button className="btn-sm-red" style={{width:"100%",marginBottom:12}} onClick={()=>{remove(detailModal.email);setDetailModal(null);}}>{t.removeBtn}</button>}
        </Modal>
      )}

      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>{t.friendsTitle}</div>
          <div style={{ fontSize:13,color:"var(--text2)" }}>{t.friendsSubtitle(members.length)}</div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn-sm" onClick={()=>{toast(t.toastExportingReport, "info");setTimeout(()=>toast(t.toastExportedReport, "ok"),1500);}}>{t.exportReport}</button>
        </div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,padding:18,marginBottom:18 }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:6 }}>{t.inviteSection}</div>
        <div style={{ fontSize:13,color:"var(--text2)",marginBottom:10 }}>{t.inviteDesc}</div>
        <div style={{ display:"flex",gap:8 }}>
          <input className="invite-input" placeholder="email@directp2p.com" value={invite} onChange={e=>setInvite(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doInvite()} />
          <button className="btn-sm-blue" onClick={doInvite}>{t.inviteBtn}</button>
        </div>
      </div>

      <div style={{ display:"flex",gap:12,marginBottom:16,alignItems:"center" }}>
        {[["var(--green)","active"],["var(--yellow)","idle"],["var(--text3)","offline"]].map(([c,status])=>(
          <div key={status} style={{ display:"flex",alignItems:"center",gap:6,fontFamily:"var(--mono)",fontSize:11,color:"var(--text2)",background:"var(--surface)",border:"1px solid var(--border)",padding:"5px 12px",borderRadius:2 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c,display:"inline-block" }}/>{statusLabel(status)} <strong>{members.filter(m=>m.status===status).length}</strong>
          </div>
        ))}
        <div style={{ marginLeft:"auto",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)" }}>Last sync: Just now</div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,overflow:"hidden" }}>
        <table className="members-table">
          <thead><tr><th>{t.thProfile}</th><th>{t.thRole}</th><th>{t.thLocation}</th><th>{t.thPermission}</th><th>{t.thStatus}</th><th></th></tr></thead>
          <tbody>
            {visible.map(m => (
              <tr key={m.email} className={selected===m.email?"selected":""} onClick={()=>setSelected(m.email===selected?null:m.email)}>
                <td>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:10,color:"#fff",fontWeight:700,flexShrink:0 }}>{m.init}</div>
                    <div>
                      <div style={{ fontSize:13,color:"var(--text)",fontWeight:500 }}>{m.name}</div>
                      <div style={{ fontSize:11,color:"var(--text3)" }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td>{m.role}</td>
                <td>{m.location}</td>
                <td onClick={e=>e.stopPropagation()}>
                  <select
                    value={m.badge}
                    onChange={e=>{
                      const next = e.target.value;
                      setMembers(p=>p.map(mb=>mb.email===m.email?{...mb,badge:next}:mb));
                      toast(t.toastPermChanged(m.name, next), "ok");
                    }}
                    style={{
                      background:"var(--surface2)",border:"1px solid var(--border2)",
                      color:"var(--text)",fontFamily:"var(--mono)",fontSize:11,
                      padding:"5px 28px 5px 10px",borderRadius:4,cursor:"pointer",outline:"none",appearance:"auto",
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td><div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12 }}><span className={`status-dot ${m.status}`}/>{statusLabel(m.label)}</div></td>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{ display:"flex",gap:4 }}>
                    <button className="btn-sm-blue" onClick={()=>sendConnectionRequest(m.email,m.name,t)}>{t.connectBtn}</button>
                    {m.badge!=="admin" && <button className="btn-sm-red" onClick={()=>remove(m.email)}>✕</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:14,fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)" }}>
        <span>SHOWING {(pg-1)*ITEMS_PER_PAGE+1}–{Math.min(pg*ITEMS_PER_PAGE,members.length)} OF {members.length}</span>
        <button className="page-btn" disabled={pg===1} onClick={()=>setPg(1)}>«</button>
        {Array.from({length:totalPages},(_,i)=>(
          <button key={i} className={`page-btn${pg===i+1?" active":""}`} onClick={()=>setPg(i+1)}>{i+1}</button>
        ))}
        <button className="page-btn" disabled={pg===totalPages} onClick={()=>setPg(totalPages)}>»</button>
      </div>
    </div>
  );
}
