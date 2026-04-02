import { useState } from "react";
import { toast } from "../../utils/toast";
import { useLang } from "../../i18n";

const SYS_VERSION = 1;

function loadSys() {
  try {
    const raw = localStorage.getItem("sys_settings");
    if (!raw) return null;
    const { version, data } = JSON.parse(raw);
    if (version !== SYS_VERSION) return null;
    return data;
  } catch { return null; }
}

export default function SystemSettings() {
  const saved = loadSys();
  const [bw, setBw] = useState(saved?.bw ?? 60);
  const [savedBw, setSavedBw] = useState(saved?.bw ?? 60);
  const [port, setPort] = useState(saved?.port ?? "50042");
  const [portStatus, setPortStatus] = useState(null);
  const logs = [
    { time:"14:22:15", user:"김태우 (Admin)",   file:"Project_Alpha_V04.mxf",  status:"ok" },
    { time:"13:45:02", user:"이소민 (Editor)",   file:"Raw_Footage_0824.zip",   status:"ok" },
    { time:"12:10:33", user:"정민규 (VFX)",      file:"Comp_Final_V2.exr",      status:"fail" },
    { time:"11:05:19", user:"김태우 (Admin)",    file:"Client_Review_H264.mp4", status:"ok" },
  ];
  const { t } = useLang();

  const verifyPort = () => {
    const p = parseInt(port);
    if (isNaN(p) || p < 1 || p > 65535) { toast(t.toastInvalidPort, "err"); return; }
    setPortStatus("checking"); toast(t.toastPortChecking, "info");
    setTimeout(() => { setPortStatus("ok"); toast(t.toastPortOk(port), "ok"); }, 1400);
  };

  const save = async () => {
    setSavedBw(bw);
    localStorage.setItem("sys_settings", JSON.stringify({ version: SYS_VERSION, data: { bw, port } }));
    toast(t.toastSettingsSaved((bw*.1).toFixed(1), port), "ok");
    try {
      const speedBytes = bw * 0.1 * 1e9;
      const res = await fetch("http://127.0.0.1:17432/transfer/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speed: speedBytes }),
      });
      if (res.ok) toast("에이전트 대역폭 설정 완료", "ok");
    } catch {
      toast("에이전트에 연결할 수 없습니다. 에이전트가 실행 중인지 확인하세요.", "err");
    }
  };
  const cancel = () => { setBw(savedBw); setPortStatus(null); toast(t.toastSettingsCancelled, "warn"); };

  return (
    <div style={{ padding:24,flex:1 }}>
      <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>{t.sysTitle}</div>
      <div style={{ fontSize:13,color:"var(--text2)",marginBottom:24 }}>{t.sysSubtitle}</div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>{t.netOpt}</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:32,fontWeight:700,lineHeight:1,marginBottom:4 }}>{(bw*.1).toFixed(1)}</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",marginBottom:16 }}>{t.bwLabel}</div>
          <input type="range" className="slider" min="0" max="100" value={bw} onChange={e=>setBw(+e.target.value)} />
          <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:4 }}><span>0 Gbps</span><span>10 Gbps</span></div>
        </div>

        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>{t.portFwd}</div>
          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:8 }}>
            <input style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:4,padding:"8px 12px",color:"var(--text)",fontFamily:"var(--mono)",fontSize:13,outline:"none",width:120 }}
              value={port} onChange={e=>{setPort(e.target.value);setPortStatus(null);}} onKeyDown={e=>e.key==="Enter"&&verifyPort()} />
            <button className="btn-sm" onClick={verifyPort} disabled={portStatus==="checking"}>
              {portStatus==="checking"?<><span className="spinner"/>{t.portChecking}</>:t.portCheck}
            </button>
            {portStatus==="ok" && <span className="port-ok">✓ OK</span>}
            {portStatus==="fail" && <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--red)" }}>{t.portFail}</span>}
          </div>
          <div style={{ fontSize:11,color:"var(--text3)",lineHeight:1.5 }}>{t.portHelp}</div>
        </div>
      </div>

      <div className="settings-card">
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700 }}>{t.logMgmt}</div>
        </div>
        <table className="log-table">
          <thead><tr><th>{t.thTime}</th><th>{t.thUser}</th><th>{t.thFile}</th><th>{t.thLogStatus}</th></tr></thead>
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
        <button className="btn-sm" onClick={cancel}>{t.cancel}</button>
        <button className="btn-sm-blue" onClick={save}>{t.saveSettings}</button>
      </div>
    </div>
  );
}
