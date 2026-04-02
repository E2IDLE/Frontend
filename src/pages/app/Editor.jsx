import { useState, useEffect, useRef } from "react";
import { toast } from "../../utils/toast";
import { useLang } from "../../i18n";
import { agentCall } from "../../utils/api";

const formatBytes = (bytes) => {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
};

const formatEta = (seconds) => {
  if (seconds === null || seconds === undefined) return "계산 중";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
};

const formatSpeed = (bytesPerSec) => `${(bytesPerSec / 1e6).toFixed(1)} MB/s`;

const toTC = s => {
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=Math.floor(s%60), fr=Math.floor((s%1)*30);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}:${String(fr).padStart(2,"0")}`;
};

const parseIp = (multiAddress) => {
  if (!multiAddress) return null;
  const m = multiAddress.match(/\/ip4\/([^/]+)/);
  return m ? m[1] : null;
};

export default function Editor({ agentInfo, connectedPeers = [] }) {
  const [playing, setPlaying]       = useState(false);
  const [tcSec, setTcSec]           = useState(14*60+22+4/30);
  const [activeFile, setActiveFile] = useState(0);
  const [inPoint, setInPoint]       = useState(null);
  const [outPoint, setOutPoint]     = useState(null);
  const [cuts, setCuts]             = useState([]);
  const [editingId, setEditingId]   = useState(null);   // id of cut being renamed
  const [transferProgress, setTransferProgress] = useState(null);
  const intervalRef = useRef(null);
  const cutIdRef    = useRef(1);
  const fileInputRef = useRef(null);
  const lastTransferStatusRef = useRef(null);
  const { t } = useLang();

  // Refs so the keyboard listener always reads current values
  const tcSecRef = useRef(tcSec); tcSecRef.current = tcSec;
  const tRef     = useRef(t);     tRef.current     = t;

  const files = [
    { name:"Scene_01_RAW.mov",     size:"128 GB" },
    { name:"Interviews_04.r3d",    size:"256 GB" },
    { name:"B-Roll_Footage_B.mp4", size:"94 GB"  },
  ];

  /* ── playback ticker ── */
  useEffect(() => {
    if (playing) intervalRef.current = setInterval(() => setTcSec(p => (p+1/30) % (5*60)), 33);
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  /* ── transfer progress polling ── */
  useEffect(() => {
    if (!agentInfo) { setTransferProgress(null); return; }
    const poll = async () => {
      try {
        const res = await agentCall("GET", "/transfer/progress");
        if (!res.ok) return;
        const data = await res.json();
        setTransferProgress(data);
        if (lastTransferStatusRef.current !== data.status) {
          if (data.status === "completed") toast("전송이 완료되었습니다.", "ok");
          else if (data.status === "failed") toast("전송 중 오류가 발생했습니다.", "err");
          else if (data.status === "cancelled") toast("전송이 취소되었습니다.", "warn");
          lastTransferStatusRef.current = data.status;
        }
      } catch { /* silent */ }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [agentInfo]);

  /* ── keyboard shortcuts  I = 인점  O = 아웃점 ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const tc = tcSecRef.current;
      const tr = tRef.current;
      if (e.key === "i" || e.key === "I") {
        setInPoint(tc);
        toast(tr.toastInSet(toTC(tc)), "info");
      } else if (e.key === "o" || e.key === "O") {
        setOutPoint(tc);
        toast(tr.toastOutSet(toTC(tc)), "info");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ── file transfer ── */
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (connectedPeers.length === 0) { toast("연결된 피어가 없습니다.", "err"); return; }
    const peer = connectedPeers[0];
    try {
      const res = await agentCall("POST", `/peers/${peer.peerId}`, {
        files: [{ name: file.name, path: file.name, size: file.size, mimeType: file.type }],
      });
      if (res.status === 409) { toast("이미 전송이 진행 중입니다.", "warn"); return; }
      if (res.status === 404) { toast("연결된 피어를 찾을 수 없습니다.", "err"); return; }
      const json = await res.json();
      toast(json.message || "전송을 시작합니다.", "ok");
    } catch {
      toast("에이전트에 연결할 수 없습니다. 에이전트가 실행 중인지 확인하세요.", "err");
    }
  };

  const cancelTransfer = async () => {
    try {
      const res = await agentCall("POST", "/transfer/cancel");
      const json = await res.json();
      const mb = ((json.transferredBytes ?? 0) / 1024 / 1024).toFixed(1);
      toast(`전송이 취소되었습니다. (${mb}MB 전송됨)`, "warn");
    } catch {
      toast("에이전트에 연결할 수 없습니다. 에이전트가 실행 중인지 확인하세요.", "err");
    }
  };

  /* ── cut actions ── */
  const addCut = () => {
    if (inPoint === null || outPoint === null) { toast(t.toastCutNeedPoints, "error"); return; }
    if (inPoint >= outPoint)                  { toast(t.toastCutInvalid,    "error"); return; }
    const id = cutIdRef.current++;
    setCuts(prev => [...prev, { id, name:`Cut ${id}`, in:inPoint, out:outPoint, enabled:true }]);
    toast(t.toastCutAdded, "ok");
  };

  const deleteCut = (id) => {
    setCuts(prev => prev.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
    toast(t.toastCutDeleted, "info");
  };

  const renameCut = (id, name) => {
    setCuts(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const toggleCut = (id) => {
    const cut = cuts.find(c => c.id === id);
    if (!cut) return;
    const next = !cut.enabled;
    toast(next ? t.toastCutEnabled : t.toastCutDisabled, "info");
    setCuts(prev => prev.map(c => c.id === id ? { ...c, enabled: next } : c));
  };

  const moveCut = (idx, dir) => {
    setCuts(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  /* ── timeline positions ── */
  const TOTAL   = 5 * 60;
  const headPct = ((tcSec / TOTAL) * 100).toFixed(2);
  const inPct   = inPoint  !== null ? ((inPoint  / TOTAL) * 100).toFixed(2) : null;
  const outPct  = outPoint !== null ? ((outPoint / TOTAL) * 100).toFixed(2) : null;

  return (
    <div className="editor-layout" style={{ flex:1, overflow:"hidden" }}>

      {/* ── Left: transfer sidebar ── */}
      <input ref={fileInputRef} type="file" accept="video/*" style={{ display:"none" }} onChange={handleFileSelected} />
      <div className="transfer-sidebar">
        <div style={{ padding:"14px 14px 0", fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:10 }}>
          {t.projectFiles}
        </div>
        {files.map((f,i) => (
          <div key={f.name} className={`file-item${activeFile===i?" active":""}`}
               onClick={() => { setActiveFile(i); toast(t.fileSelected(f.name), "info"); }}>
            <div className="file-name">{f.name}</div>
            <div className="file-size">{f.size}</div>
          </div>
        ))}
        <div style={{ padding:"8px 14px", borderBottom:"1px solid var(--border)" }}>
          <button className="btn-sm" style={{ width:"100%", marginBottom:4 }}
                  onClick={() => fileInputRef.current?.click()}>
            ＋ 미디어 가져오기
          </button>
          {transferProgress && (transferProgress.status === "transferring" || transferProgress.status === "preparing") && (
            <button className="btn-sm-red" style={{ width:"100%", fontSize:10 }} onClick={cancelTransfer}>
              전송 취소
            </button>
          )}
        </div>
        <div style={{ padding:"12px 14px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:10 }}>{t.transferStatus}</div>
          {transferProgress ? (
            <>
              {[
                [t.currentSpeed, formatSpeed(transferProgress.currentSpeed ?? 0), "green"],
                [t.remaining,    formatEta(transferProgress.eta),                  ""],
                ["전송량",        `${formatBytes(transferProgress.totalTransferred ?? 0)} / ${formatBytes(transferProgress.totalSize ?? 0)}`, ""],
              ].map(([k,v,c]) => (
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }} key={k}>
                  <span style={{ fontSize:11, color:"var(--text3)" }}>{k}</span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:11, color:c?"var(--green)":"var(--text)" }}>{v}</span>
                </div>
              ))}
              <div style={{ height:3, background:"var(--border)", borderRadius:2, margin:"10px 0", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${transferProgress.totalProgress ?? 0}%`, background:"var(--accent)", borderRadius:2, transition:"width .5s" }} />
              </div>
              {transferProgress.files?.map(f => (
                <div key={f.name} style={{ marginBottom:4 }}>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  <div style={{ height:2, background:"var(--border)", borderRadius:1, overflow:"hidden", marginTop:2 }}>
                    <div style={{ height:"100%", width:`${f.progress ?? 0}%`, background:"var(--accent2)", borderRadius:1, transition:"width .5s" }} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>전송 없음</div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background: agentInfo?.status ? "var(--green)" : "var(--text3)", display:"inline-block" }} />
            {agentInfo ? (
              <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>
                {agentInfo.agentName} · v{agentInfo.agentVersion} · {agentInfo.natType}
              </span>
            ) : (
              <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>{t.agentConnected}</span>
            )}
          </div>
        </div>
        <div style={{ padding:"12px 14px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:10 }}>{t.nodeInfo}</div>
          {agentInfo?.connectedPeer?.[0]?.nickname ? (
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>{t.sender}</span>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text)" }}>{agentInfo.connectedPeer[0].nickname}</span>
            </div>
          ) : (
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", marginBottom:5 }}>연결된 피어 없음</div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>IP</span>
            <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text)" }}>{parseIp(agentInfo?.multiAddress) ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* ── Center: preview + controls + timeline ── */}
      <div className="editor-center">

        {/* Preview */}
        <div className="preview-area">
          <div className="preview-canvas">
            <div className="preview-sun" />
            <div className="preview-overlay" />
            <div className="preview-tc">{toTC(tcSec)}</div>
            <div className="preview-badge">8K RAW · {playing ? t.playing : t.paused}</div>
          </div>
        </div>

        {/* Control row */}
        <div className="ctrl-row">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div className="ctrl-btn" onClick={() => setTcSec(0)}>⏮</div>
            <div className="ctrl-btn" onClick={() => setTcSec(p => Math.max(0, p-10))}>⏪</div>
            <div className="ctrl-btn play" onClick={() => setPlaying(p => !p)}>{playing ? "⏸" : "▶"}</div>
            <div className="ctrl-btn" onClick={() => setTcSec(p => Math.min(TOTAL-0.1, p+10))}>⏩</div>
            <div className="ctrl-btn" onClick={() => setTcSec(TOTAL-0.1)}>⏭</div>
            <div className="tc-display">{toTC(tcSec)} / 00:05:00:00</div>
            <div style={{ width:1, height:20, background:"var(--border)", margin:"0 2px" }} />
            <div className="ctrl-btn"
                 style={{ fontFamily:"var(--mono)", fontSize:10,
                          color: inPoint  !== null ? "var(--green)" : "",
                          borderColor: inPoint  !== null ? "rgba(16,185,129,.6)" : "" }}
                 title={t.setIn}
                 onClick={() => { setInPoint(tcSec); toast(t.toastInSet(toTC(tcSec)), "info"); }}>
              I
            </div>
            <div className="ctrl-btn"
                 style={{ fontFamily:"var(--mono)", fontSize:10,
                          color: outPoint !== null ? "var(--red)" : "",
                          borderColor: outPoint !== null ? "rgba(239,68,68,.6)" : "" }}
                 title={t.setOut}
                 onClick={() => { setOutPoint(tcSec); toast(t.toastOutSet(toTC(tcSec)), "info"); }}>
              O
            </div>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            {inPoint  !== null && <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--green)" }}>IN {toTC(inPoint)}</span>}
            {outPoint !== null && <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--red)"   }}>OUT {toTC(outPoint)}</span>}
            {inPoint === null && outPoint === null &&
              <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)" }}>{t.editHint}</span>}
            <button className="btn-sm" onClick={() => toast(t.toastExport, "info")}>{t.export}</button>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <div className="tl-header">
            <span>Timeline_V1</span>
            <span style={{ color:"var(--accent2)" }}>V1</span>
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
                  setTcSec((e.clientX - rect.left) / rect.width * TOTAL);
                }}>
                  {tr.clip && <div className="track-clip">{tr.clip}</div>}

                  {/* Committed cuts — enabled=yellow, disabled=grey */}
                  {tr.label === "V1" && cuts.map(c => (
                    <div key={c.id} style={{
                      position:"absolute", top:0, bottom:0,
                      left:`${(c.in /TOTAL*100).toFixed(2)}%`,
                      width:`${((c.out-c.in)/TOTAL*100).toFixed(2)}%`,
                      background: c.enabled ? "rgba(245,158,11,0.18)" : "rgba(100,100,100,0.12)",
                      borderLeft:  `2px solid ${c.enabled ? "var(--yellow)" : "var(--border2)"}`,
                      borderRight: `2px solid ${c.enabled ? "var(--yellow)" : "var(--border2)"}`,
                      pointerEvents:"none", zIndex:1,
                    }} />
                  ))}

                  {/* Current selection range */}
                  {tr.label === "V1" && inPoint !== null && outPoint !== null && outPoint > inPoint && (
                    <div style={{
                      position:"absolute", top:0, bottom:0,
                      left:`${inPct}%`,
                      width:`${((outPoint-inPoint)/TOTAL*100).toFixed(2)}%`,
                      background:"rgba(16,185,129,0.15)",
                      pointerEvents:"none", zIndex:2,
                    }} />
                  )}

                  {/* In-point marker */}
                  {tr.label === "V1" && inPoint !== null && (
                    <div style={{
                      position:"absolute", top:0, bottom:0, width:2,
                      background:"var(--green)", left:`${inPct}%`,
                      pointerEvents:"none", zIndex:3,
                    }} />
                  )}

                  {/* Out-point marker */}
                  {tr.label === "V1" && outPoint !== null && (
                    <div style={{
                      position:"absolute", top:0, bottom:0, width:2,
                      background:"var(--red)", left:`${outPct}%`,
                      pointerEvents:"none", zIndex:3,
                    }} />
                  )}

                  <div className="tl-head" style={{ left:`${headPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: cut-edit panel ── */}
      <div className="right-panel">

        {/* System info */}
        {agentInfo && (
          <div className="panel-section">
            <div className="panel-label">시스템</div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)" }}>NAT</span>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--accent2)" }}>{agentInfo.natType ?? "—"}</span>
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", wordBreak:"break-all" }}>
              {agentInfo.multiAddress ?? "—"}
            </div>
          </div>
        )}

        {/* In / Out controls */}
        <div className="panel-section">
          <div className="panel-label">{t.cutEdit}</div>

          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:".08em" }}>IN</span>
              <span style={{ fontFamily:"var(--mono)", fontSize:11, color: inPoint !== null ? "var(--green)" : "var(--text3)" }}>
                {inPoint !== null ? toTC(inPoint) : "--:--:--:--"}
              </span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:".08em" }}>OUT</span>
              <span style={{ fontFamily:"var(--mono)", fontSize:11, color: outPoint !== null ? "var(--red)" : "var(--text3)" }}>
                {outPoint !== null ? toTC(outPoint) : "--:--:--:--"}
              </span>
            </div>
            {inPoint !== null && outPoint !== null && outPoint > inPoint && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:6, borderTop:"1px solid var(--border)" }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", letterSpacing:".08em" }}>{t.cutDuration}</span>
                <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--accent2)" }}>{toTC(outPoint - inPoint)}</span>
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:6, marginBottom:8 }}>
            <button className="btn-sm"
                    style={{ flex:1, color: inPoint  !== null ? "var(--green)" : "", borderColor: inPoint  !== null ? "rgba(16,185,129,.5)" : "" }}
                    onClick={() => { setInPoint(tcSec); toast(t.toastInSet(toTC(tcSec)), "info"); }}>
              [I] {t.setIn}
            </button>
            <button className="btn-sm"
                    style={{ flex:1, color: outPoint !== null ? "var(--red)" : "", borderColor: outPoint !== null ? "rgba(239,68,68,.5)" : "" }}
                    onClick={() => { setOutPoint(tcSec); toast(t.toastOutSet(toTC(tcSec)), "info"); }}>
              [O] {t.setOut}
            </button>
          </div>

          <button className="btn-sm-blue" style={{ width:"100%" }} onClick={addCut}>
            + {t.addCut}
          </button>

          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", marginTop:8, textAlign:"center" }}>
            I = {t.setIn} · O = {t.setOut}
          </div>
        </div>

        {/* Cut list */}
        <div className="panel-section" style={{ flex:1, overflowY:"auto" }}>
          <div className="panel-label">{t.cutList}</div>

          {cuts.length === 0 ? (
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--text3)", textAlign:"center", padding:"16px 0" }}>
              {t.noCuts}
            </div>
          ) : (
            cuts.map((c, idx) => (
              <div key={c.id} className={`cut-item${c.enabled ? "" : " cut-item-disabled"}`}
                   onClick={() => setTcSec(c.in)}>

                {/* Row 1: enable toggle · name · move · delete */}
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>

                  {/* Enable/Disable dot */}
                  <div title={c.enabled ? t.cutDisable : t.cutEnable}
                       style={{
                         width:8, height:8, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                         background: c.enabled ? "var(--green)" : "var(--text3)",
                         boxShadow:  c.enabled ? "0 0 5px var(--green)" : "none",
                         transition:"all .2s",
                       }}
                       onClick={e => { e.stopPropagation(); toggleCut(c.id); }} />

                  {/* Cut name — double-click to rename */}
                  {editingId === c.id ? (
                    <input className="cut-name-input"
                           autoFocus
                           value={c.name}
                           onChange={e => renameCut(c.id, e.target.value)}
                           onBlur={() => setEditingId(null)}
                           onKeyDown={e => {
                             if (e.key === "Enter" || e.key === "Escape") setEditingId(null);
                             e.stopPropagation();
                           }}
                           onClick={e => e.stopPropagation()} />
                  ) : (
                    <span title={t.cutRenameHint}
                          style={{
                            flex:1, fontFamily:"var(--mono)", fontSize:10, overflow:"hidden",
                            textOverflow:"ellipsis", whiteSpace:"nowrap", cursor:"text",
                            color: c.enabled ? "var(--accent2)" : "var(--text3)",
                          }}
                          onDoubleClick={e => { e.stopPropagation(); setEditingId(c.id); }}>
                      {c.name}
                    </span>
                  )}

                  {/* Move up / down */}
                  <div style={{ display:"flex", flexDirection:"column", gap:1, flexShrink:0 }}>
                    <button className="cut-move-btn" disabled={idx === 0}
                            title={t.cutMoveUp}
                            onClick={e => { e.stopPropagation(); moveCut(idx, -1); }}>▲</button>
                    <button className="cut-move-btn" disabled={idx === cuts.length - 1}
                            title={t.cutMoveDown}
                            onClick={e => { e.stopPropagation(); moveCut(idx, 1); }}>▼</button>
                  </div>

                  {/* Delete */}
                  <button className="btn-sm-red"
                          style={{ flexShrink:0, padding:"1px 6px" }}
                          onClick={e => { e.stopPropagation(); deleteCut(c.id); }}>
                    ✕
                  </button>
                </div>

                {/* Row 2: timecodes */}
                <div style={{ fontFamily:"var(--mono)", fontSize:9, opacity: c.enabled ? 1 : 0.45 }}>
                  <span style={{ color:"var(--green)" }}>{toTC(c.in)}</span>
                  <span style={{ color:"var(--text3)" }}> → </span>
                  <span style={{ color:"var(--red)"   }}>{toTC(c.out)}</span>
                  <span style={{ color:"var(--text3)", marginLeft:6 }}>({toTC(c.out - c.in)})</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
