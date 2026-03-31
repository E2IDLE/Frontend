import { useState } from "react";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { toast } from "../../utils/toast";

export default function Payment() {
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

  return (
    <div style={{ flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 24px",gap:24,overflowY:"auto" }}>
      {modal && (
        <Modal icon="🎉" badge="결제 완료 — AES-256 보안 처리됨"
          title="구독이 시작되었습니다!"
          sub={`DirectP2P ${sel==="pro"?"Pro":"Free"} 플랜이 활성화되었습니다.\n이제 모든 프리미엄 기능을 이용하실 수 있습니다.`}
          onClose={() => setModal(false)} />
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
