const globalCss = `
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

export default globalCss;
