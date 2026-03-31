import { useState } from "react";
import Modal from "../../components/Modal";
import { toast } from "../../utils/toast";

const ROLES = ["admin","editor","viewer"];
const ITEMS_PER_PAGE = 4;

export default function TeamSettings() {
  const base = [
    { name:"김철수",      email:"chulsoo.k@mediagrid.p2p",  role:"촬영 감독",    location:"현장 A (서울)",   badge:"admin",  status:"active",  label:"현재 편집 중", init:"ST" },
    { name:"이영희",       email:"yh.lee@mediagrid.p2p",     role:"메인 에디터",   location:"편집실 B (부산)", badge:"editor", status:"idle",    label:"대기 중",      init:"JA" },
    { name:"김가연",      email:"jimin.p@mediagrid.p2p",    role:"색보정 전문가", location:"본사 (인천)",    badge:"editor", status:"active",  label:"현재 편집 중", init:"LA" },
    { name:"김나연",email:"assist.a@mediagrid.p2p",  role:"어시스턴트",   location:"오프라인",       badge:"viewer", status:"offline", label:"접속 종료",    init:"AS" },
    { name:"김다연",     email:"dk.kim@mediagrid.p2p",     role:"사운드 디자인", location:"원격 (대구)",    badge:"editor", status:"idle",    label:"대기 중",      init:"KD" },
  ];
  const [members, setMembers] = useState(base);
  const [invite, setInvite] = useState("");
  const [pg, setPg] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  const visible = members.slice((pg-1)*ITEMS_PER_PAGE, pg*ITEMS_PER_PAGE);

  const doInvite = () => {
    if (!invite.includes("@")) { toast("올바른 이메일 주소를 입력하세요.", "err"); return; }
    if (members.find(m=>m.email===invite)) { toast("이미 초대된 멤버입니다.", "warn"); return; }
    const nm = { name:invite.split("@")[0], email:invite, role:"신규 멤버", location:"미정", badge:"viewer", status:"offline", label:"초대 전송됨", init:invite[0].toUpperCase() };
    setMembers(p=>[...p,nm]);
    toast(`${invite}에 초대 링크를 발송했습니다.`, "ok");
    setInvite("");
    setPg(Math.ceil((members.length+1)/ITEMS_PER_PAGE));
  };

  const remove = (email) => { setMembers(p=>p.filter(m=>m.email!==email)); toast("멤버가 제거되었습니다.", "warn"); setSelected(null); };

  return (
    <div style={{ padding:24,flex:1 }}>
      {detailModal && (
        <Modal title={detailModal.name} sub={`${detailModal.email}\n역할: ${detailModal.role}\n위치: ${detailModal.location}`} onClose={()=>setDetailModal(null)}>
          <button className="btn-sm" style={{width:"100%",marginBottom:8}} onClick={()=>{toast(`${detailModal.name}에게 메시지를 보냅니다.`,"info");setDetailModal(null);}}>메시지 보내기</button>
          {detailModal.badge!=="admin" && <button className="btn-sm-red" style={{width:"100%",marginBottom:12}} onClick={()=>{remove(detailModal.email);setDetailModal(null);}}>멤버 제거</button>}
        </Modal>
      )}

      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>팀 관리</div>
          <div style={{ fontSize:13,color:"var(--text2)" }}>총 {members.length}명의 멤버가 활성화되어 있습니다</div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn-sm" onClick={()=>{toast("보고서를 내보내는 중...", "info");setTimeout(()=>toast("team_report.csv 다운로드 완료.", "ok"),1500);}}>보고서 내보내기</button>
        </div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,padding:18,marginBottom:18 }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:6 }}>// 새로운 팀원 초대</div>
        <div style={{ fontSize:13,color:"var(--text2)",marginBottom:10 }}>팀원을 초대하여 실시간 협업 환경을 구축하세요.</div>
        <div style={{ display:"flex",gap:8 }}>
          <input className="invite-input" placeholder="email@directp2p.com" value={invite} onChange={e=>setInvite(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doInvite()} />
          <button className="btn-sm-blue" onClick={doInvite}>팀원 초대</button>
        </div>
      </div>

      <div style={{ display:"flex",gap:12,marginBottom:16,alignItems:"center" }}>
        {[["var(--green)","편집 중",members.filter(m=>m.status==="active").length],["var(--yellow)","대기 중",members.filter(m=>m.status==="idle").length],["var(--text3)","오프라인",members.filter(m=>m.status==="offline").length]].map(([c,l,n])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontFamily:"var(--mono)",fontSize:10,color:"var(--text2)",background:"var(--surface)",border:"1px solid var(--border)",padding:"5px 12px",borderRadius:2 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c,display:"inline-block" }}/>{l} <strong>{n}</strong>
          </div>
        ))}
        <div style={{ marginLeft:"auto",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)" }}>Last sync: Just now</div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,overflow:"hidden" }}>
        <table className="members-table">
          <thead><tr><th>프로필</th><th>역할</th><th>접속 지점</th><th>권한 </th><th>작업 상태</th><th></th></tr></thead>
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
                      toast(`${m.name}의 권한이 ${next}로 변경되었습니다.`, "ok");
                    }}
                    style={{
                      background:"var(--surface2)",
                      border:"1px solid var(--border2)",
                      color:"var(--text)",
                      fontFamily:"var(--mono)",
                      fontSize:11,
                      padding:"5px 28px 5px 10px",
                      borderRadius:4,
                      cursor:"pointer",
                      outline:"none",
                      appearance:"auto",
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td><div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12 }}><span className={`status-dot ${m.status}`}/>{m.label}</div></td>
                <td onClick={e=>e.stopPropagation()}>
                  <div style={{ display:"flex",gap:4 }}>
                    <button className="btn-sm" onClick={()=>setDetailModal(m)}>상세</button>
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
