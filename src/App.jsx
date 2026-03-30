import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   TOAST SYSTEM  (global singleton)
═══════════════════════════════════════════ */
let _tid = 0, _set = null;
function useToasts() { const [ts, set] = useState([]); _set = set; return ts; }
function toast(msg, type = "ok") {
  if (!_set) return;
  const id = ++_tid;
  _set(p => [...p, { id, msg, type }]);
  setTimeout(() => {
    _set(p => p.map(t => t.id === id ? { ...t, out: true } : t));
    setTimeout(() => _set(p => p.filter(t => t.id !== id)), 220);
  }, 2800);
}
function Toasts({ list }) {
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
      {list.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:10,
          background:"var(--surface2)", border:"1px solid var(--border2)", borderRadius:6,
          padding:"12px 18px", fontFamily:"var(--mono)", fontSize:11, color:"var(--text)",
          letterSpacing:"0.04em", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", minWidth:270,
          animation: t.out ? "tOut .22s ease forwards" : "tIn .25s ease",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", flexShrink:0,
            background: t.type==="ok"?"var(--green)":t.type==="err"?"var(--red)":t.type==="warn"?"var(--yellow)":"var(--accent2)",
            boxShadow: t.type==="ok"?"0 0 6px var(--green)":"none"
          }}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
function Modal({ icon, title, sub, badge, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)",animation:"tIn .2s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:10,padding:36,maxWidth:440,width:"90%",animation:"scIn .2s ease" }}>
        {icon && <div style={{ fontSize:42,textAlign:"center",marginBottom:16 }}>{icon}</div>}
        {badge && <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",border:"1px solid rgba(16,185,129,0.3)",padding:"4px 12px",borderRadius:2,background:"rgba(16,185,129,0.08)",marginBottom:18 }}><span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>{badge}</div>}
        <div style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:8 }}>{title}</div>
        <div style={{ fontSize:13,color:"var(--text2)",textAlign:"center",lineHeight:1.6,marginBottom:24,whiteSpace:"pre-line" }}>{sub}</div>
        {children}
        <button onClick={onClose} style={{ width:"100%",fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:"#fff",background:"var(--accent)",border:"none",padding:13,borderRadius:4,letterSpacing:"0.08em",cursor:"pointer" }}>확인</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c10;--surface:#0e1318;--surface2:#141a22;--surface3:#192030;
  --border:#1e2a35;--border2:#243040;
  --accent:#2563eb;--accent2:#3b82f6;--accent-glow:rgba(37,99,235,0.25);
  --text:#e8edf2;--text2:#8a9bb0;--text3:#4a5f75;
  --green:#10b981;--yellow:#f59e0b;--red:#ef4444;
  --mono:'Noto Sans KR',monospace;--sans:'Noto Sans KR',sans-serif;--display:'Syne',Noto Sans KR;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:15px;line-height:1.6;overflow-x:hidden}
button{font-family:var(--sans);cursor:pointer}
input,select{font-family:var(--sans)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

@keyframes tIn  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes tOut {from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(10px)}}
@keyframes scIn {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes pulseBar{0%{width:72%}50%{width:88%}100%{width:72%}}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── common buttons ── */
.btn-ghost{font-family:var(--mono);font-size:11px;color:var(--text2);background:none;border:1px solid var(--border);padding:7px 16px;border-radius:4px;letter-spacing:.06em;transition:all .2s}
.btn-ghost:hover{border-color:var(--accent2);color:var(--text)}
.btn-primary{font-family:var(--mono);font-size:11px;color:#fff;background:var(--accent);border:none;padding:7px 18px;border-radius:4px;letter-spacing:.06em;transition:all .2s}
.btn-primary:hover{background:var(--accent2);box-shadow:0 0 20px var(--accent-glow)}
.btn-cta{font-family:var(--mono);font-size:12px;color:#fff;background:var(--accent);border:none;padding:14px 28px;border-radius:4px;letter-spacing:.08em;font-weight:700;transition:all .2s}
.btn-cta:hover{background:var(--accent2);box-shadow:0 0 40px var(--accent-glow);transform:translateY(-1px)}
.btn-outline{font-family:var(--mono);font-size:12px;color:var(--text2);background:none;border:1px solid var(--border);padding:14px 28px;border-radius:4px;letter-spacing:.08em;transition:all .2s}
.btn-outline:hover{border-color:var(--border2);color:var(--text)}
.btn-sm{font-family:var(--mono);font-size:10px;color:var(--text2);background:none;border:1px solid var(--border);padding:5px 12px;border-radius:3px;letter-spacing:.06em;transition:all .2s}
.btn-sm:hover{border-color:var(--accent2);color:var(--accent2)}
.btn-sm-blue{font-family:var(--mono);font-size:10px;color:#fff;background:var(--accent);border:none;padding:6px 14px;border-radius:3px;letter-spacing:.06em;transition:all .2s}
.btn-sm-blue:hover{background:var(--accent2)}
.btn-sm-red{font-family:var(--mono);font-size:10px;color:var(--red);background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);padding:5px 10px;border-radius:3px;letter-spacing:.06em;transition:all .2s}
.btn-sm-red:hover{background:rgba(239,68,68,.18)}

/* ── forms ── */
.form-group{margin-bottom:16px}
.form-label{font-family:var(--mono);font-size:10px;color:var(--text3);letter-spacing:.08em;display:block;margin-bottom:7px}
.form-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:11px 14px;color:var(--text);font-size:14px;outline:none;transition:border-color .2s}
.form-input::placeholder{color:var(--text3)}
.form-input:focus{border-color:var(--accent)}
.form-input.err{border-color:var(--red)}
.form-err{font-size:11px;color:var(--red);margin-top:4px;font-family:var(--mono)}
.form-row{display:flex;gap:12px}
.form-row .form-group{flex:1}
.spinner{display:inline-block;width:11px;height:11px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;margin-right:7px;vertical-align:middle}

/* ── public nav ── */
.pub-nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:60px;background:rgba(8,12,16,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--text);letter-spacing:.08em;display:flex;align-items:center;gap:8px;background:none;border:none}
.nav-logo-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);flex-shrink:0}
.nav-link{font-family:var(--mono);font-size:11px;color:var(--text2);letter-spacing:.06em;transition:color .2s;background:none;border:none}
.nav-link:hover{color:var(--text)}
.footer-link{font-family:var(--mono);font-size:10px;color:var(--text3);transition:color .2s;background:none;border:none}
.footer-link:hover{color:var(--text2)}
.pub-footer{border-top:1px solid var(--border);padding:28px 48px;display:flex;align-items:center;justify-content:space-between}

/* ── page ── */
.page{min-height:100vh;padding-top:60px}
.section-label{font-family:var(--mono);font-size:10px;color:var(--accent2);letter-spacing:.15em;margin-bottom:16px}
.section-title{font-family:var(--display);font-size:clamp(28px,4vw,44px);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:60px;max-width:600px}

/* ── hero ── */
.hero{position:relative;min-height:calc(100vh - 60px);display:flex;flex-direction:column;justify-content:center;padding:80px 48px;overflow:hidden}
.hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(37,99,235,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.04) 1px,transparent 1px);background-size:60px 60px}
.hero-glow{position:absolute;top:-200px;left:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(37,99,235,.12) 0%,transparent 70%);z-index:0;pointer-events:none}
.hero-badge{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--accent2);border:1px solid rgba(37,99,235,.3);padding:5px 12px;border-radius:2px;letter-spacing:.1em;margin-bottom:32px;position:relative;z-index:1;background:rgba(37,99,235,.06)}
.badge-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 2s infinite}
.hero-title{font-family:var(--display);font-size:clamp(48px,7vw,96px);font-weight:800;line-height:1.02;letter-spacing:-.03em;color:var(--text);position:relative;z-index:1;max-width:800px;margin-bottom:24px}
.hero-title em{font-style:normal;color:var(--accent2)}
.hero-desc{font-size:16px;color:var(--text2);line-height:1.7;max-width:540px;position:relative;z-index:1;margin-bottom:40px}
.hero-actions{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
.hero-stats{display:flex;gap:48px;margin-top:72px;position:relative;z-index:1;padding-top:40px;border-top:1px solid var(--border)}
.stat-val{font-family:var(--mono);font-size:28px;font-weight:700}
.stat-label{font-size:12px;color:var(--text3);margin-top:2px;letter-spacing:.05em}

/* ── features ── */
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.feature-card{background:var(--surface);padding:36px;transition:background .2s;cursor:pointer}
.feature-card:hover{background:var(--surface2)}
.feature-icon{width:36px;height:36px;border-radius:6px;background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:16px}
.feature-metric{font-family:var(--mono);font-size:22px;font-weight:700;color:var(--accent2);margin-bottom:8px}
.feature-title{font-family:var(--display);font-size:16px;font-weight:700;margin-bottom:10px}
.feature-desc{font-size:13px;color:var(--text2);line-height:1.7}

/* ── expand ── */
.expand-section{padding:100px 48px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.expand-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.expand-item{padding:28px 0;border-bottom:1px solid var(--border);display:flex;gap:20px;cursor:pointer;transition:background .15s;border-radius:4px}
.expand-item:first-child{border-top:1px solid var(--border)}
.expand-item:hover .expand-item-title{color:var(--accent2)}
.expand-num{font-family:var(--mono);font-size:10px;color:var(--text3);margin-top:3px;min-width:24px}
.expand-item-title{font-family:var(--display);font-size:15px;font-weight:700;margin-bottom:6px;transition:color .2s}
.expand-item-desc{font-size:13px;color:var(--text2);line-height:1.6}
.live-card-title{font-family:var(--mono);font-size:10px;color:var(--text3);letter-spacing:.1em;margin-bottom:20px}
.live-speed{font-family:var(--mono);font-size:48px;font-weight:700;line-height:1}
.live-unit{font-family:var(--mono);font-size:14px;color:var(--accent2);margin-top:4px}
.live-bar-bg{height:4px;background:var(--border);border-radius:2px;margin:24px 0;overflow:hidden}
.live-bar-fill{height:100%;background:var(--accent);border-radius:2px;animation:pulseBar 3s ease-in-out infinite}
.live-nodes{display:flex;gap:10px}
.live-node{flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:4px;padding:10px;font-family:var(--mono);font-size:10px;color:var(--text3)}
.live-node-val{color:var(--green);font-size:13px;margin-bottom:2px}

/* ── pricing ── */
.plans-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);max-width:800px;margin:60px auto;border:1px solid var(--border)}
.plan-card{background:var(--surface);padding:44px 40px;position:relative}
.plan-card.rec{background:var(--surface2)}
.plan-rec-badge{position:absolute;top:-1px;right:-1px;font-family:var(--mono);font-size:9px;color:var(--accent2);background:rgba(37,99,235,.15);border:1px solid rgba(37,99,235,.3);padding:4px 10px;letter-spacing:.1em}
.plan-name{font-family:var(--mono);font-size:11px;color:var(--text3);letter-spacing:.1em;margin-bottom:16px}
.plan-price{font-family:var(--display);font-size:52px;font-weight:800;letter-spacing:-.03em;line-height:1}
.plan-period{font-family:var(--mono);font-size:11px;color:var(--text3);margin-bottom:32px;margin-top:4px}
.plan-features{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:36px}
.plan-feature{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text2)}
.plan-check{color:var(--green);font-size:12px;margin-top:2px}
.plan-btn{width:100%;font-family:var(--mono);font-size:11px;letter-spacing:.08em;padding:13px;border-radius:4px;transition:all .2s}
.plan-btn.free{background:none;border:1px solid var(--border);color:var(--text2)}
.plan-btn.free:hover{border-color:var(--border2);color:var(--text)}
.plan-btn.pro{background:var(--accent);border:none;color:#fff;font-weight:700}
.plan-btn.pro:hover{background:var(--accent2);box-shadow:0 0 30px var(--accent-glow)}
.faq-item{border-top:1px solid var(--border)}
.faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;padding:20px 0;font-size:14px;font-weight:500;background:none;border:none;color:var(--text);text-align:left;transition:color .2s}
.faq-q:hover{color:var(--accent2)}
.faq-icon{font-family:var(--mono);font-size:16px;color:var(--text3)}
.faq-a{font-size:13px;color:var(--text2);line-height:1.7;padding-bottom:20px}

/* ── auth ── */
.auth-card{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:44px 40px}
.auth-submit{width:100%;font-family:var(--mono);font-size:12px;font-weight:700;color:#fff;background:var(--accent);border:none;padding:13px;border-radius:4px;letter-spacing:.08em;transition:all .2s;margin-bottom:16px}
.auth-submit:hover{background:var(--accent2);box-shadow:0 0 30px var(--accent-glow)}
.auth-submit:disabled{opacity:.5;cursor:not-allowed}

/* ── app shell ── */
.app-shell{display:flex;height:100vh;padding-top:60px;overflow:hidden}
.app-nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:60px;background:rgba(8,12,16,.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.app-tab{font-family:var(--mono);font-size:10px;color:var(--text3);letter-spacing:.06em;background:none;border:none;border-bottom:2px solid transparent;padding:8px 16px;transition:all .2s}
.app-tab:hover{color:var(--text2)}
.app-tab.active{color:var(--accent2);border-bottom-color:var(--accent2)}
.transfer-pill{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--text2);border:1px solid var(--border);padding:4px 12px;border-radius:2px;background:var(--surface)}
.transfer-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 1.5s infinite}
.avatar-btn{width:30px;height:30px;border-radius:50%;background:var(--accent);border:none;font-family:var(--mono);font-size:11px;font-weight:700;color:#fff;transition:all .2s;position:relative}
.avatar-btn:hover{background:var(--accent2);transform:scale(1.1)}
.avatar-menu{position:absolute;top:38px;right:0;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;padding:6px;min-width:160px;z-index:300;animation:tIn .15s ease}
.avatar-menu-item{display:block;width:100%;text-align:left;padding:8px 12px;font-size:12px;color:var(--text2);background:none;border:none;border-radius:4px;transition:all .15s;cursor:pointer}
.avatar-menu-item:hover{background:var(--surface3);color:var(--text)}
.avatar-menu-item.danger{color:var(--red)}
.avatar-menu-item.danger:hover{background:rgba(239,68,68,.1)}
.sidebar{width:210px;min-width:210px;background:var(--surface);border-right:1px solid var(--border);overflow-y:auto;display:flex;flex-direction:column}
.sidebar-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.12em;padding:0 8px;margin-bottom:6px}
.sidebar-item{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:4px;font-size:13px;color:var(--text2);transition:all .15s;cursor:pointer}
.sidebar-item:hover{background:var(--surface2);color:var(--text)}
.sidebar-item.active{background:rgba(37,99,235,.1);color:var(--accent2)}
.sidebar-badge{font-family:var(--mono);font-size:9px;padding:2px 6px;border-radius:2px;background:var(--surface3);color:var(--text3)}
.app-main{flex:1;overflow-y:auto;display:flex;flex-direction:column;min-width:0}

/* ── editor ── */
.editor-layout{display:flex;flex:1;overflow:hidden}
.editor-center{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.preview-area{flex:1;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden;min-height:300px}
.preview-canvas{width:100%;max-height:340px;aspect-ratio:16/9;background:linear-gradient(135deg,#0a1a2e,#0d2040 40%,#1a3a60);position:relative;overflow:hidden}
.preview-sun{position:absolute;bottom:-80px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#f59e0b 0%,#f97316 40%,transparent 70%);box-shadow:0 0 80px rgba(245,158,11,.4)}
.preview-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(0,0,0,.6))}
.preview-tc{position:absolute;bottom:12px;left:16px;font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.06em}
.preview-badge{position:absolute;top:12px;right:12px;font-family:var(--mono);font-size:9px;color:var(--accent2);background:rgba(37,99,235,.15);border:1px solid rgba(37,99,235,.3);padding:3px 8px;border-radius:2px;letter-spacing:.08em}
.preview-transform-box{position:absolute;top:50%;left:50%;border:1px solid rgba(59,130,246,.7);background:rgba(37,99,235,.08);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:9px;color:rgba(59,130,246,.9);letter-spacing:.06em;pointer-events:none}
.ctrl-row{background:var(--surface);border-top:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;justify-content:space-between}
.ctrl-btn{width:28px;height:28px;border-radius:4px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--text2);transition:all .15s;cursor:pointer;user-select:none}
.ctrl-btn:hover{border-color:var(--accent2);color:var(--accent2)}
.ctrl-btn.play{background:var(--accent);border-color:var(--accent);color:#fff}
.tc-display{font-family:var(--mono);font-size:12px;color:var(--text);letter-spacing:.08em}
.timeline{height:120px;background:var(--surface);border-top:1px solid var(--border);display:flex;flex-direction:column}
.tl-header{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.08em}
.tl-ruler{display:flex;padding:0 12px;height:18px;border-bottom:1px solid var(--border);overflow:hidden}
.ruler-tick{flex:1;border-left:1px solid var(--border);display:flex;align-items:flex-end;padding-bottom:2px}
.ruler-label{font-family:var(--mono);font-size:8px;color:var(--text3);transform:translateX(4px);white-space:nowrap}
.tl-tracks{flex:1;padding:6px 12px;display:flex;flex-direction:column;gap:4px;overflow:hidden}
.tl-track{display:flex;align-items:center;gap:8px}
.track-label{font-family:var(--mono);font-size:9px;color:var(--text3);width:20px}
.track-body{flex:1;height:22px;background:var(--surface2);border-radius:2px;position:relative;overflow:hidden;cursor:pointer}
.track-body:hover{background:var(--surface3)}
.track-clip{position:absolute;top:2px;bottom:2px;left:4px;right:20%;background:linear-gradient(90deg,rgba(37,99,235,.5),rgba(37,99,235,.3));border:1px solid rgba(37,99,235,.5);border-radius:2px;display:flex;align-items:center;padding:0 8px;font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.5)}
.tl-head{position:absolute;top:0;bottom:0;width:2px;background:var(--accent);pointer-events:none;transition:left .08s linear}
.right-panel{width:230px;min-width:230px;background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.panel-section{padding:14px;border-bottom:1px solid var(--border)}
.panel-label{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em;margin-bottom:12px}
.panel-key{font-size:12px;color:var(--text2)}
.panel-val{font-family:var(--mono);font-size:11px;color:var(--text)}
.panel-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:5px 8px;color:var(--text);font-family:var(--mono);font-size:11px;outline:none;transition:border-color .2s;text-align:center;width:100%}
.panel-input:focus{border-color:var(--accent)}
.slider{-webkit-appearance:none;width:100%;height:3px;background:var(--border);border-radius:2px;outline:none;cursor:pointer;margin-top:6px}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--accent)}
.toggle{position:relative;width:32px;height:17px}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:var(--border);border-radius:17px;cursor:pointer;transition:.2s}
.toggle-slider::before{content:'';position:absolute;width:13px;height:13px;left:2px;bottom:2px;background:var(--text3);border-radius:50%;transition:.2s}
.toggle input:checked+.toggle-slider{background:var(--accent)}
.toggle input:checked+.toggle-slider::before{transform:translateX(15px);background:#fff}
.transfer-sidebar{width:195px;min-width:195px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.file-item{padding:10px 14px;border-bottom:1px solid var(--border);transition:background .15s;cursor:pointer}
.file-item:hover{background:var(--surface2)}
.file-item.active{background:rgba(37,99,235,.08);border-left:2px solid var(--accent)}
.file-name{font-size:12px;color:var(--text);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-size{font-family:var(--mono);font-size:9px;color:var(--text3)}

/* ── team ── */
.members-table{width:100%;border-collapse:collapse}
.members-table th{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em;text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--surface);font-weight:400}
.members-table td{padding:11px 12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text2);vertical-align:middle}
.members-table tr{cursor:pointer}
.members-table tr:hover td{background:var(--surface2)}
.members-table tr.selected td{background:rgba(37,99,235,.06)}
.role-badge{font-family:var(--mono);font-size:9px;padding:3px 8px;border-radius:2px;letter-spacing:.06em;cursor:pointer;transition:all .2s}
.role-badge.admin{background:rgba(37,99,235,.15);color:var(--accent2);border:1px solid rgba(37,99,235,.25)}
.role-badge.editor{background:rgba(16,185,129,.1);color:var(--green);border:1px solid rgba(16,185,129,.2)}
.role-badge.viewer{background:var(--surface3);color:var(--text3);border:1px solid var(--border)}
.role-badge:hover{opacity:.75}
.status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.status-dot.active{background:var(--green);box-shadow:0 0 6px var(--green)}
.status-dot.idle{background:var(--yellow)}
.status-dot.offline{background:var(--text3)}
.page-btn{padding:4px 10px;border:1px solid var(--border);border-radius:3px;background:none;color:var(--text3);font-family:var(--mono);font-size:11px;transition:all .2s}
.page-btn.active{border-color:var(--accent2);color:var(--accent2)}
.page-btn:hover{border-color:var(--border2);color:var(--text)}
.invite-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:9px 14px;color:var(--text);font-size:13px;outline:none;transition:border-color .2s}
.invite-input::placeholder{color:var(--text3)}
.invite-input:focus{border-color:var(--accent)}

/* ── settings ── */
.settings-card{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:20px}
.log-table{width:100%;border-collapse:collapse}
.log-table th{font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.08em;text-align:left;padding:6px 10px;border-bottom:1px solid var(--border);font-weight:400}
.log-table td{padding:8px 10px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text2)}
.log-status{font-family:var(--mono);font-size:9px;padding:2px 7px;border-radius:2px}
.log-status.ok{background:rgba(16,185,129,.12);color:var(--green)}
.log-status.fail{background:rgba(239,68,68,.12);color:var(--red)}
.port-ok{font-family:var(--mono);font-size:10px;color:var(--green);transition:opacity .3s;white-space:nowrap}

/* ── payment ── */
.pay-plan-card{border:1px solid var(--border);border-radius:6px;padding:14px;margin-bottom:10px;position:relative;transition:all .2s;cursor:pointer}
.pay-plan-card:hover{border-color:var(--border2)}
.pay-plan-card.selected{border-color:var(--accent);background:rgba(37,99,235,.05)}
.plan-select-dot{position:absolute;top:14px;right:14px;width:14px;height:14px;border-radius:50%;border:2px solid var(--border);transition:all .2s}
.pay-plan-card.selected .plan-select-dot{border-color:var(--accent);background:var(--accent)}
.rec-tag{font-family:var(--mono);font-size:8px;color:var(--accent2);background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.25);padding:2px 7px;border-radius:2px;letter-spacing:.08em}
.order-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:13px;color:var(--text2)}
.order-row.total{border-top:1px solid var(--border);padding-top:10px;margin-top:4px;font-size:15px;color:var(--text);font-weight:600}
.order-val{font-family:var(--mono);font-size:13px}
.pay-btn{width:100%;font-family:var(--mono);font-size:12px;font-weight:700;color:#fff;background:var(--accent);border:none;padding:14px;border-radius:4px;letter-spacing:.08em;transition:all .2s;margin-bottom:10px}
.pay-btn:hover{background:var(--accent2);box-shadow:0 0 30px var(--accent-glow)}
.pay-btn:disabled{opacity:.5;cursor:not-allowed}
`;

/* ════════════════════════════════════════
   SHARED COMPONENTS
════════════════════════════════════════ */
function Logo({ onClick }) {
  return (
    <button className="nav-logo" onClick={onClick} style={{ background:"none",border:"none" }}>
      <span className="nav-logo-dot" /> DirectP2P
    </button>
  );
}

function PubNav({ setPage }) {
  return (
    <nav className="pub-nav">
      <Logo onClick={() => setPage("landing")} />
      <div style={{ display:"flex", gap:32 }}>
        <button className="nav-link" onClick={() => setPage("landing")}>Features</button>
        <button className="nav-link" onClick={() => setPage("pricing")}>Pricing</button>
        <button className="nav-link" onClick={() => toast("문의 이메일: support@directp2p.com", "info")}>문의하기</button>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button className="btn-ghost" onClick={() => setPage("login")}>Login</button>
        <button className="btn-primary" onClick={() => setPage("signup")}>Get Started</button>
      </div>
    </nav>
  );
}

function PubFooter({ setPage }) {
  return (
    <footer className="pub-footer">
      <Logo onClick={() => setPage("landing")} />
      <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",letterSpacing:"0.06em" }}>
        © 2024 DirectP2P. Precision Engineering for 8K Workflow.
      </div>
      <div style={{ display:"flex", gap:20 }}>
        {["Privacy Policy","Terms of Service","Documentation","Support"].map(l => (
          <button key={l} className="footer-link" onClick={() => toast(`${l} 페이지로 이동합니다.`, "info")}>{l}</button>
        ))}
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   LANDING
════════════════════════════════════════ */
function Landing({ setPage }) {
  return (
    <div className="page">
      <PubNav setPage={setPage} />
      <div className="hero" style={{alignItems:"center", textAlign:"center"}}>
        <div className="hero-grid" /><div className="hero-glow" />
        <div className="hero-badge"><span className="badge-dot" /> New Release — 8K RAW Streaming Engine V2.0</div>
        <h1 className="hero-title">가장 빠른 8K<br />영상 협업의 <em>시작</em>,<br />DirectP2P</h1>
        <p className="hero-desc">중앙 서버 없는 혁신적인 P2P 아키텍처로 8K RAW 영상을 끊김 없이 스트리밍하고 전송하세요. QUIC 프로토콜 기반의 초저지연 기술이 편집 워크플로우를 재정의합니다.</p>
        <div className="hero-actions">
          <button className="btn-cta" onClick={() => setPage("signup")}>무료로 시작하기</button>
          <button className="btn-outline" onClick={() => setPage("pricing")}>요금제 보기</button>
          <button className="btn-outline" onClick={() => toast("문의 이메일: support@directp2p.com", "info")}>문의하기</button>
        </div>
        <div className="hero-stats">
          {[["1.2 Gbps","P2P TRANSFER SPEED"],["0.1s","UDP-BASED LATENCY"],["AES-256","END-TO-END ENCRYPTION"]].map(([v,l]) => (
            <div key={v}><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ padding:"100px 48px", textAlign:"center" }}>
        <div className="section-label">// CORE TECHNOLOGY</div>
        <h2 className="section-title" style={{maxWidth:"100%"}}>프로페셔널을 위한<br />정밀한 성능</h2>
        <div className="features-grid">
          {[
            { icon:"⚡", metric:"1.2 Gbps", title:"P2P Speed", desc:"전용 회선급의 압도적인 속도. 중앙 서버의 병목 현상 없이 유저 간 다이렉트 연결로 8K 대용량 파일을 수초 내에 전송합니다.", action:() => toast("P2P 속도 벤치마크 문서로 이동합니다.", "info") },
            { icon:"▶", metric:"Edit-while", title:"Streaming", desc:"QUIC 프로토콜 최적화로 다운로드 완료 전에도 즉시 타임라인에서 프리뷰가 가능합니다. 실시간 프록시 생성 없는 8K 네이티브 편집.", action:() => { toast("데모 영상을 불러오는 중...", "info"); setTimeout(() => setPage("editor"), 900); } },
            { icon:"🔒", metric:"AES-256", title:"Security", desc:"엔드 투 엔드 암호화로 원본 소스의 유출을 원천 차단합니다. 그 어떤 노드나 서버도 데이터의 내용을 볼 수 없는 완벽한 보안.", action:() => toast("보안 백서(White Paper)를 다운로드합니다.", "info") },
          ].map(f => (
            <div className="feature-card" key={f.title} onClick={f.action}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-metric">{f.metric}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="expand-section">
        <div className="expand-grid">
          <div>
            <div className="section-label">// GLOBAL WORKFLOW</div>
            <h2 className="section-title" style={{ marginBottom:32 }}>당신의 워크스테이션을<br />글로벌로 확장하세요</h2>
            {[
              { title:"원격 컬러 그레이딩", desc:"지연 없는 10-bit HDR 스트리밍으로 전 세계 어디서든 실시간 컨펌이 가능합니다.", action:() => toast("원격 컬러 그레이딩 가이드를 불러옵니다.", "info") },
              { title:"분산형 렌더링 지원", desc:"유휴 자원을 활용한 분산 렌더링으로 작업 시간을 70% 이상 단축합니다.", action:() => toast("분산 렌더링 설정 방법을 확인합니다.", "info") },
              { title:"Live Syncing", desc:"실시간 프로젝트 동기화로 팀 전원이 동일한 타임라인을 공유합니다.", action:() => { toast("Live Sync 데모로 이동합니다.", "info"); setTimeout(()=>setPage("editor"),900); } },
            ].map((item, i) => (
              <div className="expand-item" key={item.title} onClick={item.action}>
                <span className="expand-num">0{i+1}</span>
                <div><div className="expand-item-title">{item.title}</div><div className="expand-item-desc">{item.desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:28 }}>
            <div className="live-card-title">// LIVE TRANSFER STATUS</div>
            <div className="live-speed">1.24</div>
            <div className="live-unit">GB/s  ↑ ACTIVE</div>
            <div className="live-bar-bg"><div className="live-bar-fill" /></div>
            <div className="live-nodes">
              {[["LATENCY","15ms"],["NODES","4 P2P"],["UPTIME","99.9%"]].map(([l,v]) => (
                <div className="live-node" key={l}><div className="live-node-val">{v}</div><div>{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"120px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:400,background:"radial-gradient(ellipse,rgba(37,99,235,.1) 0%,transparent 70%)",pointerEvents:"none" }} />
        <h2 style={{ fontFamily:"var(--display)",fontSize:"clamp(32px,5vw,56px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:16,position:"relative",zIndex:1 }}>지금 바로 8K 협업을<br />시작하세요</h2>
        <p style={{ fontSize:15,color:"var(--text2)",marginBottom:36,position:"relative",zIndex:1 }}>첫 30일간 모든 프리미엄 기능을 무제한으로 제공합니다.</p>
        <div style={{ display:"flex",gap:16,justifyContent:"center",position:"relative",zIndex:1 }}>
          <button className="btn-cta" onClick={() => setPage("signup")}>프로젝트 시작하기</button>
          <button className="btn-outline" onClick={() => setPage("pricing")}>요금제 확인하기</button>
        </div>
      </div>
      <PubFooter setPage={setPage} />
    </div>
  );
}

/* ════════════════════════════════════════
   PRICING
════════════════════════════════════════ */
function Pricing({ setPage }) {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"결제는 어떤 방식으로 이루어지나요?", a:"모든 결제는 매월 자동 갱신되며, 신용카드 및 해외 결제가 가능한 체크카드로 간편하게 이용하실 수 있습니다." },
    { q:"보안은 안전한가요?", a:"DirectP2P는 종단간 암호화(E2EE)를 지원하며, 서버에 파일을 저장하지 않는 순수 P2P 방식으로 데이터 유출 걱정이 없습니다." },
    { q:"플랜을 중간에 변경할 수 있나요?", a:"언제든지 계정 설정에서 상위 플랜으로 업그레이드하거나 해지하실 수 있습니다. 차액은 일할 계산되어 적용됩니다." },
    { q:"팀 멤버 수를 초과하면 어떻게 되나요?", a:"팀 멤버 초과 시 자동으로 Pro 플랜 업그레이드 안내가 발송됩니다. 추가 멤버는 그 전까지 뷰어 권한으로 제한됩니다." },
  ];
  return (
    <div className="page">
      <PubNav setPage={setPage} />
      <div style={{ padding:"80px 48px 60px",textAlign:"center" }}>
        <div className="section-label">// PRICING PLANS</div>
        <h1 style={{ fontFamily:"var(--display)",fontSize:"clamp(36px,5vw,60px)",fontWeight:800,letterSpacing:"-.03em",marginBottom:16 }}>전문가용 워크플로우를 위한<br />합리적인 요금제</h1>
        <p style={{ fontSize:15,color:"var(--text2)",maxWidth:480,margin:"0 auto" }}>복잡한 전송 과정은 잊으세요. 영상 전문가를 위해 설계된 최적의 P2P 전송 솔루션을 선택하세요.</p>
      </div>
      <div className="plans-grid">
        <div className="plan-card">
          <div className="plan-name">FREE</div><div className="plan-price">$0</div><div className="plan-period">/month</div>
          <ul className="plan-features">{["100GB 전송 용량","표준 전송 속도","최대 2명의 팀원","8K RAW 전송 제한"].map(f=><li className="plan-feature" key={f}><span className="plan-check">✓</span>{f}</li>)}</ul>
          <button className="plan-btn free" onClick={() => setPage("signup")}>무료로 시작하기</button>
        </div>
        <div className="plan-card rec">
          <div className="plan-rec-badge">RECOMMENDED</div>
          <div className="plan-name">PRO</div><div className="plan-price">$49</div><div className="plan-period">/month</div>
          <ul className="plan-features">{["무제한 8K RAW 전송","Priority QUIC Stream (초고속)","최대 10명의 팀원 협업","24/7 전담 기술 지원","커스텀 브랜딩 링크"].map(f=><li className="plan-feature" key={f}><span className="plan-check">✓</span>{f}</li>)}</ul>
          <button className="plan-btn pro" onClick={() => setPage("signup")}>Pro 선택하기</button>
        </div>
      </div>
      <div style={{ padding:"60px 48px 100px",maxWidth:700,margin:"0 auto" }}>
        <h2 style={{ fontFamily:"var(--display)",fontSize:22,fontWeight:800,marginBottom:32,letterSpacing:"-.02em" }}>자주 묻는 질문</h2>
        {faqs.map((f,i) => (
          <div className="faq-item" key={i}>
            <button className="faq-q" onClick={() => setOpen(open===i?null:i)}>{f.q}<span className="faq-icon">{open===i?"−":"+"}</span></button>
            {open===i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
      <PubFooter setPage={setPage} />
    </div>
  );
}

/* ════════════════════════════════════════
   AUTH
════════════════════════════════════════ */
function F({ label, id, type="text", ph, err, val, onChange, disabled, extra }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} className={`form-input${err?" err":""}`} type={type} placeholder={ph} value={val} onChange={onChange} disabled={disabled} style={{ opacity:disabled?.4:1, ...extra }} />
      {err && <div className="form-err">{err}</div>}
    </div>
  );
}

function Auth({ mode, setPage }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name:"", nick:"", email:"", pw:"", agree:false });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = "이름을 입력하세요.";
    if (!form.email.includes("@")) e.email = "올바른 이메일 주소를 입력하세요.";
    if (form.pw.length < 6) e.pw = "비밀번호는 6자 이상이어야 합니다.";
    if (!isLogin && !form.agree) e.agree = "이용약관에 동의해야 합니다.";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(isLogin ? "로그인 성공! 워크스페이스로 이동합니다." : "계정이 생성되었습니다! 환영합니다 🎉", "ok");
      setTimeout(() => setPage("editor"), 700);
    }, 1300);
  };


  return (
    <div className="page">
      <PubNav setPage={setPage} />
      <div style={{ minHeight:"calc(100vh - 60px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px" }}>
        <div className="auth-card">
          <div style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--text3)",textAlign:"center",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <span className="nav-logo-dot" />DirectP2P
          </div>
          <h1 style={{ fontFamily:"var(--display)",fontSize:26,fontWeight:800,textAlign:"center",marginBottom:6,letterSpacing:"-.02em" }}>{isLogin?"계정 로그인":"계정 생성"}</h1>
          <p style={{ fontSize:13,color:"var(--text2)",textAlign:"center",marginBottom:32 }}>{isLogin?"DirectP2P에 접속하여 워크플로우를 이어가세요.":"DirectP2P와 함께 워크플로우를 혁신하세요."}</p>

          {!isLogin && (
            <div className="form-row">
              <F label="이름" id="name" ph="성함을 입력하세요" err={errs.name} val={form.name} onChange={e=>set("name",e.target.value)} />
              <F label="닉네임" id="nick" ph="닉네임" val={form.nick} onChange={e=>set("nick",e.target.value)} />
            </div>
          )}
          <F label="이메일 주소" id="email" type="email" ph="name@company.com" err={errs.email} val={form.email} onChange={e=>set("email",e.target.value)} />
          <F label="비밀번호" id="pw" type="password" ph="••••••••" err={errs.pw} val={form.pw} onChange={e=>set("pw",e.target.value)} />

          {isLogin
            ? <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:20 }}>
                <button style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",background:"none",border:"none",cursor:"pointer" }}
                  onClick={() => toast("비밀번호 재설정 이메일이 발송되었습니다.", "info")}>비밀번호를 잊으셨나요?</button>
              </div>
            : <div>
                <div style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:errs.agree?6:20 }}>
                  <input type="checkbox" id="terms" checked={form.agree} onChange={e=>set("agree",e.target.checked)} style={{ marginTop:2,accentColor:"var(--accent)" }} />
                  <label htmlFor="terms" style={{ fontSize:12,color:"var(--text2)" }}>
                    <span style={{ color:"var(--accent2)",cursor:"pointer" }} onClick={()=>toast("이용약관 전문을 확인합니다.", "info")}>이용약관</span> 및{" "}
                    <span style={{ color:"var(--accent2)",cursor:"pointer" }} onClick={()=>toast("개인정보처리방침을 확인합니다.", "info")}>개인정보처리방침</span>에 동의합니다.
                  </label>
                </div>
                {errs.agree && <div className="form-err" style={{ marginBottom:14 }}>{errs.agree}</div>}
              </div>
          }

          <button className="auth-submit" disabled={loading} onClick={submit}>
            {loading ? <><span className="spinner" />{isLogin?"로그인 중...":"생성 중..."}</> : (isLogin?"로그인":"계정 생성하기")}
          </button>
          <div style={{ textAlign:"center",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)",marginBottom:16 }}>또는</div>
          <div style={{ textAlign:"center",fontSize:12,color:"var(--text2)" }}>
            {isLogin?"계정이 없으신가요?":"이미 계정이 있으신가요?"}&nbsp;
            <button style={{ background:"none",border:"none",color:"var(--accent2)",fontSize:12,cursor:"pointer" }} onClick={()=>setPage(isLogin?"signup":"login")}>{isLogin?"회원가입":"로그인하기"}</button>
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:24,fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.08em" }}>
            <span style={{ width:4,height:4,borderRadius:"50%",background:"var(--green)",display:"inline-block" }} />AES-256 Encrypted · P2P Security Verified
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   APP NAV + SIDEBAR
════════════════════════════════════════ */
function AppNav({ tab, setTab, setPage }) {
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

function Sidebar({ tab, setTab }) {
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

/* ════════════════════════════════════════
   EDITOR
════════════════════════════════════════ */
function Editor() {
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

  /* transform: box position in preview (normalized 0–1) */
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
        <div style={{ padding:"14px 14px 0",fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>// 프로젝트 파일</div>
        {files.map((f,i) => (
          <div key={f.name} className={`file-item${activeFile===i?" active":""}`} onClick={() => { setActiveFile(i); toast(`${f.name} 선택됨`, "info"); }}>
            <div className="file-name">{f.name}</div>
            <div className="file-size">{f.size}</div>
          </div>
        ))}
        <div style={{ padding:"12px 14px",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>// 전송 상태</div>
          {[["현재 속도","1.2 Gbps","green"],["지연 시간","15 ms",""],["남은 시간","18 분",""]].map(([k,v,c]) => (
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
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>로컬 에이전트 연결됨</span>
          </div>
        </div>
        <div style={{ padding:"12px 14px",borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:10 }}>// 노드 정보</div>
          <div style={{ fontSize:12,color:"var(--text2)",marginBottom:2 }}>송신처: 촬영 현장 A</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)" }}>IP: 211.232.xx.xx</div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6,padding:"12px 14px",marginTop:"auto",borderTop:"1px solid var(--border)" }}>
          <button className="btn-sm" onClick={() => { toast("가상 드라이브에 마운트하는 중...", "info"); setTimeout(()=>toast("가상 드라이브 마운트 완료 ✓", "ok"),1500); }}>가상 드라이브로 마운트</button>
          <button className="btn-sm" onClick={() => { toast("SHA-256 무결성 검증 중...", "info"); setTimeout(()=>toast("무결성 검증 완료 ✓  해시 일치", "ok"),2000); }}>무결성 검증 (SHA-256)</button>
          <button className="btn-sm-blue" onClick={() => { toast(`${files[activeFile].name} 타임라인에 추가됨`, "ok"); }}>미디어 가져오기</button>
        </div>
      </div>

      {/* Center */}
      <div className="editor-center">
        <div className="preview-area">
          <div className="preview-canvas">
            <div className="preview-sun" />
            <div className="preview-overlay" style={{ opacity: bgRemove ? 0.95 : 1 }} />
            {/* Live transform box */}
            <div className="preview-transform-box" style={{
              left: boxLeft, top: boxTop, width: boxW, height: boxH,
              transform: `rotate(${rot}deg)`, opacity: opac/100,
              transition: "all .15s",
            }}>
              CLIP
            </div>
            <div className="preview-tc">{toTC(tcSec)}</div>
            <div className="preview-badge">8K RAW · {playing?"재생 중":"일시정지"} {bgRemove?"· BG OFF":""}</div>
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
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>현재 컷 편집 및 프리뷰 가능</span>
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--accent2)" }}>Scale {scale}% · Rot {rot}°</span>
            <button className="btn-sm" onClick={()=>{setScale(100);setRot(0);setOpac(100);setPosX(960);setPosY(540);toast("변환값이 초기화되었습니다.", "info");}}>초기화</button>
          </div>
        </div>

        <div className="timeline">
          <div className="tl-header">
            <span>Timeline_V1</span>
            <div style={{ display:"flex",gap:8 }}>
              <button className="btn-sm" onClick={()=>toast("타임라인을 내보내는 중...", "info")}>내보내기</button>
              <span style={{ color:"var(--accent2)" }}>V1</span>
            </div>
          </div>
          <div className="tl-ruler">
            {["00:00:00","00:01:15","00:02:30","00:03:45"].map(t => (
              <div className="ruler-tick" key={t}><span className="ruler-label">{t}</span></div>
            ))}
          </div>
          <div className="tl-tracks">
            {[{ label:"V1", clip:files[activeFile].name }, { label:"A1", clip:null }].map(t => (
              <div className="tl-track" key={t.label}>
                <span className="track-label">{t.label}</span>
                <div className="track-body" onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setTcSec(pct * 5 * 60);
                }}>
                  {t.clip && <div className="track-clip">{t.clip}</div>}
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
          <div className="panel-label">// 변형 옵션 (TRANSFORM)</div>
          <div style={{ marginBottom:10,fontSize:12,color:"var(--text2)" }}>편집 위치 (Position)</div>
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
          <div className="panel-label">// 크기 / 회전</div>
          <Row label="Scale" val={`${scale}%`} />
          <input type="range" className="slider" min="0" max="300" value={scale} onChange={e=>setScale(+e.target.value)} />
          <div style={{ marginTop:14 }} />
          <Row label="Rotation" val={`${rot}°`} />
          <input type="range" className="slider" min="-180" max="180" value={rot} onChange={e=>setRot(+e.target.value)} />
        </div>

        <div className="panel-section">
          <div className="panel-label">// 불투명도 (OPACITY)</div>
          <Row label="Opacity" val={`${opac}%`} />
          <input type="range" className="slider" min="0" max="100" value={opac} onChange={e=>setOpac(+e.target.value)} />
        </div>

        <div className="panel-section">
          <div className="panel-label">// 배경 설정</div>
          {[["배경 제거", bgRemove, setBgRemove], ["크로마키 선명도 조정", chroma, setChroma]].map(([lbl,val,setV]) => (
            <div key={lbl} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
              <span className="panel-key">{lbl}</span>
              <label className="toggle">
                <input type="checkbox" checked={val} onChange={e=>{setV(e.target.checked);toast(`${lbl} ${e.target.checked?"ON":"OFF"}`, "info");}} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        <div className="panel-section">
          <div className="panel-label">// 시스템</div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
            <span style={{ width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block" }} />
            <span style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)" }}>정상 작동 중 · 에이전트 v1.0.1</span>
          </div>
          <button className="btn-sm" style={{ width:"100%" }} onClick={()=>toast("시스템 진단 결과: 모든 노드 정상", "ok")}>시스템 진단</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TEAM SETTINGS
════════════════════════════════════════ */
const ROLES = ["admin","editor","viewer"];
const ITEMS_PER_PAGE = 4;

function TeamSettings() {
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

  const cycleRole = (email) => {
    setMembers(p=>p.map(m=>{
      if (m.email!==email) return m;
      const next = ROLES[(ROLES.indexOf(m.badge)+1)%ROLES.length];
      toast(`${m.name}의 권한이 ${next}으로 변경되었습니다.`, "ok");
      return {...m, badge:next};
    }));
  };

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

      {/* Invite */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,padding:18,marginBottom:18 }}>
        <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:6 }}>// 새로운 팀원 초대</div>
        <div style={{ fontSize:13,color:"var(--text2)",marginBottom:10 }}>팀원을 초대하여 실시간 협업 환경을 구축하세요.</div>
        <div style={{ display:"flex",gap:8 }}>
          <input className="invite-input" placeholder="email@directp2p.com" value={invite} onChange={e=>setInvite(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doInvite()} />
          <button className="btn-sm-blue" onClick={doInvite}>팀원 초대</button>
        </div>
      </div>

      {/* Status pills */}
      <div style={{ display:"flex",gap:12,marginBottom:16,alignItems:"center" }}>
        {[["var(--green)","편집 중",members.filter(m=>m.status==="active").length],["var(--yellow)","대기 중",members.filter(m=>m.status==="idle").length],["var(--text3)","오프라인",members.filter(m=>m.status==="offline").length]].map(([c,l,n])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontFamily:"var(--mono)",fontSize:10,color:"var(--text2)",background:"var(--surface)",border:"1px solid var(--border)",padding:"5px 12px",borderRadius:2 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c,display:"inline-block" }}/>{l} <strong>{n}</strong>
          </div>
        ))}
        <div style={{ marginLeft:"auto",fontFamily:"var(--mono)",fontSize:10,color:"var(--text3)" }}>Last sync: Just now</div>
      </div>

      {/* Table */}
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

/* ════════════════════════════════════════
   SYSTEM SETTINGS
════════════════════════════════════════ */
function SystemSettings() {
  const [bw, setBw] = useState(60);
  const [savedBw, setSavedBw] = useState(60);
  const [port, setPort] = useState("50042");
  const [portStatus, setPortStatus] = useState(null); // null | "checking" | "ok" | "fail"
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
        {/* Bandwidth */}
        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>네트워크 최적화 (Network Optimization)</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:32,fontWeight:700,lineHeight:1,marginBottom:4 }}>{(bw*.1).toFixed(1)}</div>
          <div style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)",marginBottom:16 }}>Gbps — 대역폭 제한</div>
          <input type="range" className="slider" min="0" max="100" value={bw} onChange={e=>setBw(+e.target.value)} />
          <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",marginTop:4 }}><span>0 Gbps</span><span>10 Gbps</span></div>
        </div>

        {/* Port forwarding */}
        <div className="settings-card">
          <div style={{ fontFamily:"var(--display)",fontSize:14,fontWeight:700,marginBottom:16 }}>포트 포워딩 (Port Forwarding)</div>
          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:8 }}>
            <input style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:4,padding:"8px 12px",color:"var(--text)",fontFamily:"var(--mono)",fontSize:13,outline:"none",width:120 }}
              value={port} onChange={e=>{setPort(e.target.value);setPortStatus(null);}} onKeyDown={e=>e.key==="Enter"&&verifyPort()} />
            <button className="btn-sm" onClick={verifyPort} disabled={portStatus==="checking"}>
              {portStatus==="checking"?<><span className="spinner"/>확인 중</>:"확인"}
            </button>
            {portStatus==="ok" && <span className="port-ok" style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--green)" }}>✓ OK</span>}
            {portStatus==="fail" && <span style={{ fontFamily:"var(--mono)",fontSize:10,color:"var(--red)" }}>✕ 실패</span>}
          </div>
          <div style={{ fontSize:11,color:"var(--text3)",lineHeight:1.5 }}>P2P 통신을 위한 로컬 수신 포트 번호입니다.</div>
        </div>
      </div>

      {/* Log */}
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

/* ════════════════════════════════════════
   PAYMENT
════════════════════════════════════════ */
function Payment() {
  const [sel, setSel] = useState("pro");
  const [form, setForm] = useState({ card:"", exp:"", cvc:"", name:"" });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const plans = [
    { id:"pro",  name:"Pro",  sub:"전문가용 8K 워크플로우", price:"$49", features:["Unlimited 8K RAW transfer","10 team members","24/7 support"], rec:true },
    { id:"free", name:"Free", sub:"기본 협업용",             price:"$0",  features:["100GB transfer","standard speed","2 team members"],           rec:false },
  ];
  const totals = { pro:{ sub:"$49.00",tax:"$4.90",total:"$53.90" }, free:{ sub:"$0.00",tax:"$0.00",total:"$0.00" } };
  const t = totals[sel];

  const setF = (k,v) => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };
  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ");
  const fmtExp  = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const validate = () => {
    if (sel==="free") return {};
    const e = {};
    if (form.card.replace(/\s/g,"").length<16) e.card="카드 번호 16자리를 입력하세요.";
    if (!/^\d{2}\/\d{2}$/.test(form.exp)) e.exp="MM/YY 형식으로 입력하세요.";
    if (form.cvc.length<3) e.cvc="CVC 3자리를 입력하세요.";
    if (!form.name.trim()) e.name="카드 소유자 이름을 입력하세요.";
    return e;
  };

  const pay = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setModal(true); }, 1800);
  };

  const FG = ({ label, id, ph, val, onChange, err, type="text", disabled, extra }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input id={id} className={`form-input${err?" err":""}`} type={type} placeholder={ph} value={val} onChange={onChange} disabled={disabled} style={{ opacity:disabled?.4:1, ...extra }} />
      {err && <div className="form-err">{err}</div>}
    </div>
  );

  return (
    <div style={{ flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 24px",gap:24,overflowY:"auto" }}>
      {modal && (
        <Modal icon="🎉" badge="결제 완료 — AES-256 보안 처리됨"
          title="구독이 시작되었습니다!"
          sub={`DirectP2P ${sel==="pro"?"Pro":"Free"} 플랜이 활성화되었습니다.\n이제 모든 프리미엄 기능을 이용하실 수 있습니다.`}
          onClose={() => setModal(false)} />
      )}

      {/* Left */}
      <div style={{ width:300,minWidth:300 }}>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:24,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>구독 플랜 선택</div>
          <div style={{ fontSize:13,color:"var(--text2)",marginBottom:18 }}>워크플로우에 가장 적합한 솔루션을 선택하세요.</div>
          {plans.map(p => (
            <div key={p.id} className={`pay-plan-card${sel===p.id?" selected":""}`} onClick={()=>setSel(p.id)}>
              <div className="plan-select-dot" />
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                <div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                    <div style={{ fontFamily:"var(--display)",fontSize:15,fontWeight:700 }}>{p.name}</div>
                    {p.rec && <span className="rec-tag">RECOMMENDED</span>}
                  </div>
                  <div style={{ fontSize:11,color:"var(--text2)" }}>{p.sub}</div>
                </div>
                <div style={{ fontFamily:"var(--mono)",fontSize:22,fontWeight:700,textAlign:"right" }}>{p.price}<span style={{ fontSize:11,color:"var(--text3)",fontWeight:400 }}>/mo</span></div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                {p.features.map(f=><div key={f} style={{ fontSize:11,color:"var(--text3)",display:"flex",alignItems:"center",gap:6 }}><span style={{ color:"var(--green)" }}>✓</span>{f}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ width:320,minWidth:320 }}>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:24,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:18 }}>결제 정보 입력</div>
          {sel==="free" && (
            <div style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:4,padding:"10px 14px",marginBottom:16,fontFamily:"var(--mono)",fontSize:11,color:"var(--green)" }}>
              ✓ 무료 플랜은 결제 정보가 필요 없습니다.
            </div>
          )}
          <FG label="카드 번호" id="card" ph="0000 0000 0000 0000" val={form.card} err={errs.card} disabled={sel==="free"} extra={{ letterSpacing:"0.1em" }} onChange={e=>setF("card",fmtCard(e.target.value))} />
          <div className="form-row">
            <FG label="만료일 (MM/YY)" id="exp" ph="12/28" val={form.exp} err={errs.exp} disabled={sel==="free"} onChange={e=>setF("exp",fmtExp(e.target.value))} />
            <FG label="CVC" id="cvc" ph="***" type="password" val={form.cvc} err={errs.cvc} disabled={sel==="free"} onChange={e=>setF("cvc",e.target.value.replace(/\D/g,"").slice(0,3))} />
          </div>
          <FG label="카드 소유자 이름" id="cname" ph="홍길동" val={form.name} err={errs.name} disabled={sel==="free"} onChange={e=>setF("name",e.target.value)} />
        </div>

        <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:6,padding:16,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:12 }}>// 주문 요약</div>
          <div className="order-row"><span>{sel==="pro"?"Pro 플랜 (월간)":"Free 플랜"}</span><span className="order-val">{t.sub}</span></div>
          <div className="order-row"><span>세금 (VAT 10%)</span><span className="order-val">{t.tax}</span></div>
          <div className="order-row total"><span>총 결제 금액</span><span className="order-val">{t.total}</span></div>
        </div>

        <button className="pay-btn" disabled={loading} onClick={pay}>
          {loading?<><span className="spinner"/>결제 처리 중...</>:(sel==="free"?"무료로 시작하기":"구독 시작하기")}
        </button>
        <div style={{ fontSize:11,color:"var(--text3)",textAlign:"center",lineHeight:1.5 }}>
          결제 버튼을 누름으로써 DirectP2P의 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   APP SHELL
════════════════════════════════════════ */
function AppShell({ setPage }) {
  const [tab, setTab] = useState("편집 툴");
  return (
    <div className="app-shell">
      <AppNav tab={tab} setTab={setTab} setPage={setPage} />
      <Sidebar tab={tab} setTab={setTab} />
      <div className="app-main">
        {tab==="편집 툴"    && <Editor />}
        {tab==="팀 설정"    && <TeamSettings />}
        {tab==="시스템 설정" && <SystemSettings />}
        {tab==="구독 플랜"  && <Payment />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const toasts = useToasts();
  return (
    <>
      <style>{css}</style>
      {page==="landing" && <Landing setPage={setPage} />}
      {page==="pricing" && <Pricing setPage={setPage} />}
      {page==="login"   && <Auth mode="login"  setPage={setPage} />}
      {page==="signup"  && <Auth mode="signup" setPage={setPage} />}
      {page==="editor"  && <AppShell setPage={setPage} />}
      <Toasts list={toasts} />
    </>
  );
}
