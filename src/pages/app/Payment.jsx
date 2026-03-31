import { useState } from "react";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { toast } from "../../utils/toast";

function loadSub() {
  try { const v = localStorage.getItem("subscription"); return v ? JSON.parse(v) : null; } catch { return null; }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("ko-KR", { year:"numeric", month:"long", day:"numeric" });
}
function nextBilling(iso) {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("ko-KR", { year:"numeric", month:"long", day:"numeric" });
}

function SubscriptionView({ sub, onCancel }) {
  const [confirmModal, setConfirmModal] = useState(false);

  const isPro = sub.plan === "pro";

  return (
    <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"32px 24px", gap:24, overflowY:"auto" }}>
      {confirmModal && (
        <Modal
          title="구독을 취소하시겠습니까?"
          sub="취소 후에는 현재 구독 혜택이 즉시 종료됩니다. 
          정말로 구독을 취소하시겠습니까?"
          onClose={() => setConfirmModal(false)}
        >
          <button
            className="btn-sm-red"
            style={{ width:"100%", marginBottom:8, padding:"10px 0", fontSize:13 }}
            onClick={onCancel}
          >
            네, 구독을 취소합니다
          </button>
          <button
            className="btn-sm"
            style={{ width:"100%", padding:"10px 0", fontSize:13 }}
            onClick={() => setConfirmModal(false)}
          >
            돌아가기
          </button>
        </Modal>
      )}

      <div style={{ width:560, maxWidth:"100%" }}>
        {/* 상단 헤더 */}
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:28, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:6 }}>// 현재 구독</div>
              <div style={{ fontFamily:"var(--display)", fontSize:22, fontWeight:800, letterSpacing:"-.02em" }}>
                DirectP2P {isPro ? "Pro" : "Free"} 플랜
              </div>
            </div>
            <div style={{
              background: isPro ? "rgba(37,99,235,.12)" : "rgba(16,185,129,.08)",
              border: isPro ? "1px solid rgba(37,99,235,.3)" : "1px solid rgba(16,185,129,.3)",
              color: isPro ? "var(--accent2)" : "var(--green)",
              fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.08em",
              padding:"5px 14px", borderRadius:3,
            }}>
              ACTIVE
            </div>
          </div>

          {/* 플랜 정보 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {[
              { label:"월 구독료", value: isPro ? "$53.90" : "$0.00" },
              { label:"구독 시작일", value: formatDate(sub.startedAt) },
              { label:"다음 결제일", value: isPro ? nextBilling(sub.startedAt) : "해당 없음" },
              { label:"결제 수단", value: sub.cardLast4 ? `카드 **** ${sub.cardLast4}` : "없음 (무료)" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:5, padding:"12px 16px" }}>
                <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:5 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* 포함된 기능 */}
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:10 }}>// 포함된 기능</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {(isPro
              ? ["Unlimited 8K RAW transfer", "10 team members", "24/7 priority support", "고급 색보정 워크플로우"]
              : ["100GB transfer", "standard speed", "2 team members"]
            ).map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text2)" }}>
                <span style={{ color:"var(--green)", fontFamily:"var(--mono)" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* 구독자 이름 */}
        {sub.cardName && (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:6, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
              {sub.cardName[0]}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{sub.cardName}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>구독 계정</div>
            </div>
          </div>
        )}

        {/* 구독 취소 버튼 */}
        <button
          onClick={() => setConfirmModal(true)}
          style={{
            width:"100%", padding:"12px 0", borderRadius:5, cursor:"pointer",
            background:"none", border:"1px solid var(--red)",
            color:"var(--red)", fontFamily:"var(--mono)", fontSize:12,
            letterSpacing:"0.05em", transition:"all .15s",
          }}
          onMouseEnter={e => { e.target.style.background="rgba(239,68,68,.08)"; }}
          onMouseLeave={e => { e.target.style.background="none"; }}
        >
          구독 취소
        </button>
      </div>
    </div>
  );
}

export default function Payment() {
  const [subscription, setSubscription] = useState(loadSub);
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
    setTimeout(() => {
      setLoading(false);
      setModal(true);
    }, 1800);
  };

  const confirmPay = () => {
    const cardDigits = form.card.replace(/\s/g,"");
    const sub = {
      plan: sel,
      startedAt: new Date().toISOString(),
      cardLast4: cardDigits.length >= 4 ? cardDigits.slice(-4) : null,
      cardName: form.name || null,
    };
    localStorage.setItem("subscription", JSON.stringify(sub));
    setSubscription(sub);
    setModal(false);
  };

  const cancelSubscription = () => {
    localStorage.removeItem("subscription");
    setSubscription(null);
    setForm({ card:"", exp:"", cvc:"", name:"" });
    setErrs({});
    toast("구독이 취소되었습니다.", "warn");
  };

  if (subscription) {
    return <SubscriptionView sub={subscription} onCancel={cancelSubscription} />;
  }

  return (
    <div style={{ flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 24px",gap:24,overflowY:"auto" }}>
      {modal && (
        <Modal icon="🎉" badge="결제 완료"
          title="구독이 시작되었습니다!"
          sub={`DirectP2P ${sel==="pro"?"Pro":"Free"} 플랜이 활성화되었습니다.\n이제 모든 프리미엄 기능을 이용하실 수 있습니다.`}
          onClose={confirmPay}
        />
      )}

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

      <div style={{ width:320,minWidth:320 }}>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:24,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:18 }}>결제 정보 입력</div>
          {sel==="free" && (
            <div style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:4,padding:"10px 14px",marginBottom:16,fontFamily:"var(--mono)",fontSize:11,color:"var(--green)" }}>
              ✓ 무료 플랜은 결제 정보가 필요 없습니다.
            </div>
          )}
          <FormField label="카드 번호" id="card" ph="0000 0000 0000 0000" val={form.card} err={errs.card} disabled={sel==="free"} extra={{ letterSpacing:"0.1em" }} onChange={e=>setF("card",fmtCard(e.target.value))} />
          <div className="form-row">
            <FormField label="만료일 (MM/YY)" id="exp" ph="12/28" val={form.exp} err={errs.exp} disabled={sel==="free"} onChange={e=>setF("exp",fmtExp(e.target.value))} />
            <FormField label="CVC" id="cvc" ph="***" type="password" val={form.cvc} err={errs.cvc} disabled={sel==="free"} onChange={e=>setF("cvc",e.target.value.replace(/\D/g,"").slice(0,3))} />
          </div>
          <FormField label="카드 소유자 이름" id="cname" ph="홍길동" val={form.name} err={errs.name} disabled={sel==="free"} onChange={e=>setF("name",e.target.value)} />
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
