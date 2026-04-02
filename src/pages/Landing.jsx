import { useEffect } from "react";
import PubNav from "../components/PubNav";
import PubFooter from "../components/PubFooter";
import { toast } from "../utils/toast";

export default function Landing({ setPage }) {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      <PubNav setPage={setPage} />
      <div className="hero" style={{alignItems:"center", textAlign:"center"}}>
        <div className="hero-grid" /><div className="hero-glow" />
        <div className="hero-badge"><span className="badge-dot" /> New Release — 8K RAW Streaming Engine V2.0</div>
        <h1 className="hero-title">가장 빠른 8K<br />영상 협업의 시작,<br /><em>DirectP2P</em></h1>
        <p className="hero-desc">중앙 서버 없는 혁신적인 P2P 아키텍처로 8K RAW 영상을 끊김 없이 스트리밍하고 전송하세요. QUIC 프로토콜 기반의 초저지연 기술이 편집 워크플로우를 재정의합니다.</p>
        <div className="hero-actions">
          <button className="btn-cta" onClick={() => setPage("signup")}>무료로 시작하기</button>
          <button className="btn-outline" onClick={() => setPage("install")}>에이전트 다운로드</button>
          <button className="btn-outline" onClick={() => toast("문의 이메일: support@directp2p.com", "info")}>문의하기</button>
        </div>
        <div className="hero-stats">
          {[["1.2 Gbps","P2P TRANSFER SPEED"],["0.1s","UDP-BASED LATENCY"],["AES-256","END-TO-END ENCRYPTION"]].map(([v,l]) => (
            <div key={v}><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="fade-in" style={{ padding:"100px 48px", textAlign:"center" }}>
        <div className="section-label">// CORE TECHNOLOGY</div>
        <h2 className="section-title" style={{maxWidth:"100%"}}>프로페셔널을 위한<br />정밀한 성능</h2>
        <div className="features-grid">
          {[
            { icon:"⚡", metric:"1.2 Gbps", title:"P2P Speed", desc:"전용 회선급의 압도적인 속도. 중앙 서버의 병목 현상 없이 유저 간 다이렉트 연결로 8K 대용량 파일을 수초 내에 전송합니다." },
            { icon:"▶", metric:"Edit-while", title:"Streaming", desc:"QUIC 프로토콜 최적화로 다운로드 완료 전에도 즉시 타임라인에서 프리뷰가 가능합니다. 실시간 프록시 생성 없는 8K 네이티브 편집." },
            { icon:"🔒", metric:"AES-256", title:"Security", desc:"엔드 투 엔드 암호화로 원본 소스의 유출을 원천 차단합니다. 그 어떤 노드나 서버도 데이터의 내용을 볼 수 없는 완벽한 보안."},
          ].map(f => (
            <div className="feature-card" key={f.title} >
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-metric">{f.metric}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="expand-section fade-in">
        <div className="expand-grid">
          <div>
            <div className="section-label">// GLOBAL WORKFLOW</div>
            <h2 className="section-title" style={{ marginBottom:32 }}>당신의 워크스테이션을<br />글로벌로 확장하세요</h2>
            {[
              { title:"원격 컬러 그레이딩", desc:"지연 없는 10-bit HDR 스트리밍으로 전 세계 어디서든 실시간 컨펌이 가능합니다."},
              { title:"분산형 렌더링 지원", desc:"유휴 자원을 활용한 분산 렌더링으로 작업 시간을 70% 이상 단축합니다." },
              { title:"Live Syncing", desc:"실시간 프로젝트 동기화로 팀 전원이 동일한 타임라인을 공유합니다." },
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

      <div className="fade-in" style={{ padding:"120px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
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
