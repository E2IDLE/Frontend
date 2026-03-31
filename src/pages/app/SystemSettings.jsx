import { useState } from "react";
import { toast } from "../../utils/toast";

export default function SystemSettings() {
  const [bw, setBw] = useState(60);
  const [savedBw, setSavedBw] = useState(60);
  const [port, setPort] = useState("50042");
  const [portStatus, setPortStatus] = useState(null);
  const [logs, setLogs] = useState([
    { time:"14:22:15", user:"김태우 (Admin)",   file:"Project_Alpha_V04.mxf",  status:"ok" },
    { time:"13:45:02", user:"이소민 (Editor)",   file:"Raw_Footage_0824.zip",   status:"ok" },
    { time:"12:10:33", user:"정민규 (VFX)",      file:"Comp_Final_V2.exr",      status:"fail" },
    { time:"11:05:19", user:"김태우 (Admin)",    file:"Client_Review_H264.mp4", status:"ok" },
  ]);

  const verifyPort = () => {
    const p = parseInt(port);
    if (isNaN(p) || p < 1 || p > 65535) { toast("올바른 포트 번호를 입력하세요 (1–65535).", "err"); return; }
    setPortStatus("checking"); toast("포트 연결 확인 중...", "info");
    setTimeout(() => { setPortStatus("ok"); toast(`포트 ${port} 연결 가능 ✓`, "ok"); }, 1400);
  };

  const save = () => { setSavedBw(bw); toast(`설정 저장 완료 — 대역폭 ${(bw*.1).toFixed(1)} Gbps, 포트 ${port}`, "ok"); };
  const cancel = () => { setBw(savedBw); setPortStatus(null); toast("변경 사항이 취소되었습니다.", "warn"); };
  const exportLogs = () => { toast("로그 내보내는 중...", "info"); setTimeout(()=>toast("transfer_log.csv 다운로드 완료.", "ok"),1500); };
  const retryFailed = () => {
    setLogs(p=>p.map(l=>l.status==="fail"?{...l,status:"ok"}:l));
    toast("실패 항목 재시도 완료.", "ok");
  };

  return (
    <div style={{ padding:24,flex:1 }}>
      <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>시스템 설정</div>
      <div style={{ fontSize:13,color:"var(--text2)",marginBottom:24 }}>네트워크 성능 및 보안 매개변수를 관리합니다.</div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>네트워크 최적화 (Network Optimization)</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:32,fontWeight:700,lineHeight:1,marginBottom:4 }}>{(bw*.1).toFixed(1)}</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",marginBottom:16 }}>Gbps — 대역폭 제한</div>
          <input type="range" className="slider" min="0" max="100" value={bw} onChange={e=>setBw(+e.target.value)} />
          <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:4 }}><span>0 Gbps</span><span>10 Gbps</span></div>
        </div>

        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>포트 포워딩 (Port Forwarding)</div>
          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:8 }}>
            <input style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:4,padding:"8px 12px",color:"var(--text)",fontFamily:"var(--mono)",fontSize:13,outline:"none",width:120 }}
              value={port} onChange={e=>{setPort(e.target.value);setPortStatus(null);}} onKeyDown={e=>e.key==="Enter"&&verifyPort()} />
            <button className="btn-sm" onClick={verifyPort} disabled={portStatus==="checking"}>
              {portStatus==="checking"?<><span className="spinner"/>확인 중</>:"확인"}
            </button>
            {portStatus==="ok" && <span className="port-ok">✓ OK</span>}
            {portStatus==="fail" && <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--red)" }}>✕ 실패</span>}
          </div>
          <div style={{ fontSize:11,color:"var(--text3)",lineHeight:1.5 }}>P2P 통신을 위한 로컬 수신 포트 번호입니다.</div>
        </div>
      </div>

      <div className="settings-card">
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700 }}>로그 관리 (Log Management)</div>
          <div style={{ display:"flex",gap:8 }}>
            {logs.some(l=>l.status==="fail") && <button className="btn-sm" onClick={retryFailed}>실패 항목 재시도</button>}
            <button className="btn-sm" onClick={exportLogs}>전체 로그 내보내기</button>
          </div>
        </div>
        <table className="log-table">
          <thead><tr><th>시간</th><th>사용자</th><th>파일명</th><th>상태</th></tr></thead>
          <tbody>
            {logs.map((l,i) => (
              <tr key={i}>
                <td style={{ fontFamily:"var(--mono)",fontSize:11 }}>{l.time}</td>
                <td>{l.user}</td>
                <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)" }}>{l.file}</td>
                <td><span className={`log-status ${l.status}`}>{l.status==="ok"?"Completed":"Failed"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:20 }}>
        <button className="btn-sm" onClick={cancel}>취소</button>
        <button className="btn-sm-blue" onClick={save}>설정 저장</button>
      </div>
    </div>
  );
}
