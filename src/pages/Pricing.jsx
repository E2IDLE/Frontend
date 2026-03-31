import { useState } from "react";
import PubNav from "../components/PubNav";
import PubFooter from "../components/PubFooter";

export default function Pricing({ setPage }) {
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
