import { useState, useEffect, useRef } from "react";
import { toast } from "../../utils/toast";
import { useLang } from "../../i18n";

export default function Editor() {
  const [playing, setPlaying] = useState(false);
  const [tcSec, setTcSec] = useState(14*60+22+4/30);
  const [activeFile, setActiveFile] = useState(0);
  const [posX, setPosX] = useState(960);
  const [posY, setPosY] = useState(540);
  const [scale, setScale] = useState(100);
  const [rot, setRot] = useState(0);
  const [opac, setOpac] = useState(100);
  const [bgRemove, setBgRemove] = useState(false);
  const [chroma, setChroma] = useState(true);
  const intervalRef = useRef(null);
  const { t } = useLang();

  const files = [
    { name:"Scene_01_RAW.mov", size:"128 GB" },
    { name:"Interviews_04.r3d", size:"256 GB" },
    { name:"B-Roll_Footage_B.mp4", size:"94 GB" },
  ];

  const toTC = s => {
    const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=Math.floor(s%60), fr=Math.floor((s%1)*30);
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}:${String(fr).padStart(2,"0")}`;
  };

  useEffect(() => {
    if (playing) intervalRef.current = setInterval(() => setTcSec(p => (p+1/30) % (5*60)), 33);
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const headPct = ((tcSec/(5*60))*100).toFixed(1);

  const boxLeft = `${Math.max(5, Math.min(75, (posX/1920)*100))}%`;
  const boxTop  = `${Math.max(5, Math.min(75, (posY/1080)*100))}%`;
  const boxW    = `${Math.max(8, Math.min(40, scale/5))}%`;
  const boxH    = `${Math.max(5, Math.min(25, scale/8))}%`;

  const Row = ({ label, val }) => (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
      <span className="panel-key">{label}</span>
      <span className="panel-val">{val}</span>
    </div>
  );

  return (
    <div className="editor-layout" style={{ flex:1,overflow:"hidden" }}>
      {/* Transfer sidebar */}
      <div className="transfer-sidebar">
        <div style={{ padding:"14px 14px 0",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>{t.projectFiles}</div>
        {files.map((f,i) => (
          <div key={f.name} className={`file-item${activeFile===i?" active":""}`} onClick={() => { setActiveFile(i); toast(t.fileSelected(f.name), "info"); }}>
            <div className="file-name">{f.name}</div>
            <div className="file-size">{f.size}</div>
          </div>
        ))}
        <div style={{ padding:"12px 14px",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>{t.transferStatus}</div>
          {[[t.currentSpeed,"1.2 Gbps","green"],[t.latency,"15 ms",""],[t.remaining,"18 min",""]].map(([k,v,c]) => (
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }} key={k}>
              <span style={{ fontSize:11,color:"var(--text3)" }}>{k}</span>
              <span style={{ fontFamily:"var(--mono)",fontSize:11,color:c?"var(--green)":"var(--text)" }}>{v}</span>
            </div>
          ))}
          <div style={{ height:3,background:"var(--border)",borderRadius:2,margin:"10px 0",overflow:"hidden" }}>
            <div style={{ height:"100%",width:"65%",background:"var(--accent)",borderRadius:2,animation:"pulseBar 3s ease-in-out infinite" }} />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block" }} />
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>{t.agentConnected}</span>
          </div>
        </div>
        <div style={{ padding:"12px 14px",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>{t.nodeInfo}</div>
          <div style={{ fontSize:12,color:"var(--text2)",marginBottom:2 }}>{t.sender}</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:10.5,color:"var(--text3)" }}>IP: 211.232.xx.xx</div>
        </div>
      </div>

      {/* Center */}
      <div className="editor-center">
        <div className="preview-area">
          <div className="preview-canvas">
            <div className="preview-sun" />
            <div className="preview-overlay" style={{ opacity: bgRemove ? 0.95 : 1 }} />
            <div className="preview-transform-box" style={{
              left: boxLeft, top: boxTop, width: boxW, height: boxH,
              transform: `rotate(${rot}deg)`, opacity: opac/100,
              transition: "all .15s",
            }}>
              CLIP
            </div>
            <div className="preview-tc">{toTC(tcSec)}</div>
            <div className="preview-badge">8K RAW · {playing ? t.playing : t.paused} {bgRemove ? "· BG OFF" : ""}</div>
          </div>
        </div>

        <div className="ctrl-row">
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div className="ctrl-btn" onClick={() => setTcSec(0)}>⏮</div>
            <div className="ctrl-btn" onClick={() => setTcSec(p=>Math.max(0,p-10))}>⏪</div>
            <div className="ctrl-btn play" onClick={() => setPlaying(p=>!p)}>{playing?"⏸":"▶"}</div>
            <div className="ctrl-btn" onClick={() => setTcSec(p=>Math.min(5*60-0.1,p+10))}>⏩</div>
            <div className="ctrl-btn" onClick={() => setTcSec(5*60-0.1)}>⏭</div>
            <div className="tc-display">{toTC(tcSec)} / 00:05:00:00</div>
          </div>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>{t.editHint}</span>
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--accent2)" }}>Scale {scale}% · Rot {rot}°</span>
            <button className="btn-sm" onClick={()=>{setScale(100);setRot(0);setOpac(100);setPosX(960);setPosY(540);toast(t.toastReset, "info");}}>{t.reset}</button>
          </div>
        </div>

        <div className="timeline">
          <div className="tl-header">
            <span>Timeline_V1</span>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn-sm" onClick={()=>toast(t.toastExport, "info")}>{t.export}</button>
              <span style={{ color:"var(--accent2)" }}>V1</span>
            </div>
          </div>
          <div className="tl-ruler">
            {["00:00:00","00:01:15","00:02:30","00:03:45"].map(tc => (
              <div className="ruler-tick" key={tc}><span className="ruler-label">{tc}</span></div>
            ))}
          </div>
          <div className="tl-tracks">
            {[{ label:"V1", clip:files[activeFile].name }, { label:"A1", clip:null }].map(tr => (
              <div className="tl-track" key={tr.label}>
                <span className="track-label">{tr.label}</span>
                <div className="track-body" onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setTcSec(pct * 5 * 60);
                }}>
                  {tr.clip && <div className="track-clip">{tr.clip}</div>}
                  <div className="tl-head" style={{ left:`${headPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="right-panel">
        <div className="panel-section">
          <div className="panel-label">{t.transform}</div>
          <div style={{ marginBottom:10,fontSize:12,color:"var(--text2)" }}>{t.position}</div>
          <div style={{ display:"flex",gap:6,marginBottom:4 }}>
            <div style={{ flex:1 }}>
              <input className="panel-input" type="number" value={posX} onChange={e=>setPosX(+e.target.value)} />
              <div style={{ fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",textAlign:"center",marginTop:3 }}>X</div>
            </div>
            <div style={{ flex:1 }}>
              <input className="panel-input" type="number" value={posY} onChange={e=>setPosY(+e.target.value)} />
              <div style={{ fontFamily:"var(--mono)",fontSize:8,color:"var(--text3)",textAlign:"center",marginTop:3 }}>Y</div>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-label">{t.sizeRotation}</div>
          <Row label="Scale" val={`${scale}%`} />
          <input type="range" className="slider" min="0" max="300" value={scale} onChange={e=>setScale(+e.target.value)} />
          <div style={{ marginTop:14 }} />
          <Row label="Rotation" val={`${rot}°`} />
          <input type="range" className="slider" min="-180" max="180" value={rot} onChange={e=>setRot(+e.target.value)} />
        </div>

        <div className="panel-section">
          <div className="panel-label">{t.opacity}</div>
          <Row label="Opacity" val={`${opac}%`} />
          <input type="range" className="slider" min="0" max="100" value={opac} onChange={e=>setOpac(+e.target.value)} />
        </div>

        <div className="panel-section">
          <div className="panel-label">{t.systemPanel}</div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
            <span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block" }} />
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>{t.systemOk}</span>
          </div>
          <button className="btn-sm" style={{ width:"100%" }} onClick={()=>toast(t.toastSystemDiag, "ok")}>{t.systemDiag}</button>
        </div>
      </div>
    </div>
  );
}
