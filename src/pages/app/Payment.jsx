import { useState } from "react";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { toast } from "../../utils/toast";
import { useLang } from "../../i18n";

function loadSub() {
  try { const v = localStorage.getItem("subscription"); return v ? JSON.parse(v) : null; } catch { return null; }
}

function formatDate(iso, locale) {
  return new Date(iso).toLocaleDateString(locale, { year:"numeric", month:"long", day:"numeric" });
}
function nextBilling(iso, locale) {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString(locale, { year:"numeric", month:"long", day:"numeric" });
}

function SubscriptionView({ sub, onCancel }) {
  const [confirmModal, setConfirmModal] = useState(false);
  const { t } = useLang();
  const isPro = sub.plan === "pro";

  return (
    <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"32px 24px", gap:24, overflowY:"auto" }}>
      {confirmModal && (
        <Modal
          title={t.confirmCancelTitle}
          sub={t.confirmCancelSub}
          onClose={() => setConfirmModal(false)}
        >
          <button
            className="btn-sm-red"
            style={{ width:"100%", marginBottom:8, padding:"10px 0", fontSize:13 }}
            onClick={onCancel}
          >
            {t.confirmCancelBtn}
          </button>
          <button
            className="btn-sm"
            style={{ width:"100%", padding:"10px 0", fontSize:13 }}
            onClick={() => setConfirmModal(false)}
          >
            {t.backBtn}
          </button>
        </Modal>
      )}

      <div style={{ width:560, maxWidth:"100%" }}>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:28, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.1em", marginBottom:6 }}>{t.currentSubLabel}</div>
              <div style={{ fontFamily:"var(--display)", fontSize:22, fontWeight:800, letterSpacing:"-.02em" }}>
                {isPro ? t.planProTitle : t.planFreeTitle}
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

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {[
              { label: t.monthlyFee,       value: isPro ? "$53.90" : "$0.00" },
              { label: t.startDate,        value: formatDate(sub.startedAt, t.dateLocale) },
              { label: t.nextBillingLabel, value: isPro ? nextBilling(sub.startedAt, t.dateLocale) : t.notApplicable },
              { label: t.payMethod,        value: sub.cardLast4 ? t.cardMasked(sub.cardLast4) : t.noPayment },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:5, padding:"12px 16px" }}>
                <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:5 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--text3)", letterSpacing:"0.08em", marginBottom:10 }}>{t.includedFeatures}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {(isPro
              ? ["Unlimited 8K RAW transfer", "10 team members", "24/7 priority support", t.proFeature4]
              : ["100GB transfer", "standard speed", "2 team members"]
            ).map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text2)" }}>
                <span style={{ color:"var(--green)", fontFamily:"var(--mono)" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {sub.cardName && (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:6, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
              {sub.cardName[0]}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{sub.cardName}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>{t.subAccount}</div>
            </div>
          </div>
        )}

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
          {t.cancelSubBtn}
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
  const { t } = useLang();

  const plans = [
    { id:"pro",  name:"Pro",  sub:t.planProSub,  price:"$320", features:["Unlimited 8K RAW transfer","10 team members","24/7 support"], rec:true },
    { id:"free", name:"Free", sub:t.planFreeSub, price:"$0",  features:["100GB transfer","standard speed","2 team members"],           rec:false },
  ];
  const totals = { pro:{ sub:"$320.00",tax:"$32.00",total:"$352.00" }, free:{ sub:"$0.00",tax:"$0.00",total:"$0.00" } };
  const tot = totals[sel];

  const setF = (k,v) => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };
  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ");
  const fmtExp  = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const validate = () => {
    if (sel==="free") return {};
    const e = {};
    if (form.card.replace(/\s/g,"").length<16) e.card=t.errCard;
    if (!/^\d{2}\/\d{2}$/.test(form.exp)) e.exp=t.errExp;
    if (form.cvc.length<3) e.cvc=t.errCvc;
    if (!form.name.trim()) e.name=t.errName;
    return e;
  };

  const pay = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setModal(true); }, 1800);
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
    toast(t.toastSubCancelled, "warn");
  };

  if (subscription) {
    return <SubscriptionView sub={subscription} onCancel={cancelSubscription} />;
  }

  return (
    <div style={{ flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 24px",gap:24,overflowY:"auto" }}>
      {modal && (
        <Modal icon="🎉" badge={t.paymentComplete}
          title={t.subStarted}
          sub={t.subActivated(sel==="pro"?"Pro":"Free")}
          onClose={confirmPay}
        />
      )}

      <div style={{ width:300,minWidth:300 }}>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:24,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:4 }}>{t.selectPlan}</div>
          <div style={{ fontSize:13,color:"var(--text2)",marginBottom:18 }}>{t.selectPlanSub}</div>
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
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:18 }}>{t.enterPayment}</div>
          {sel==="free" && (
            <div style={{ background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:4,padding:"10px 14px",marginBottom:16,fontFamily:"var(--mono)",fontSize:11,color:"var(--green)" }}>
              {t.freeNoCreditCard}
            </div>
          )}
          <FormField label={t.cardNumber} id="card" ph="0000 0000 0000 0000" val={form.card} err={errs.card} disabled={sel==="free"} extra={{ letterSpacing:"0.1em" }} onChange={e=>setF("card",fmtCard(e.target.value))} />
          <div className="form-row">
            <FormField label={t.expiry} id="exp" ph="12/28" val={form.exp} err={errs.exp} disabled={sel==="free"} onChange={e=>setF("exp",fmtExp(e.target.value))} />
            <FormField label={t.cvcLabel} id="cvc" ph="***" type="password" val={form.cvc} err={errs.cvc} disabled={sel==="free"} onChange={e=>setF("cvc",e.target.value.replace(/\D/g,"").slice(0,3))} />
          </div>
          <FormField label={t.cardName} id="cname" ph={t.cardNamePh} val={form.name} err={errs.name} disabled={sel==="free"} onChange={e=>setF("name",e.target.value)} />
        </div>

        <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:6,padding:16,marginBottom:14 }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:12 }}>{t.orderSummary}</div>
          <div className="order-row"><span>{sel==="pro" ? t.planMonthlyLabel : t.planFreeRowLabel}</span><span className="order-val">{tot.sub}</span></div>
          <div className="order-row"><span>{t.taxLabel}</span><span className="order-val">{tot.tax}</span></div>
          <div className="order-row total"><span>{t.totalAmount}</span><span className="order-val">{tot.total}</span></div>
        </div>

        <button className="pay-btn" disabled={loading} onClick={pay}>
          {loading ? <><span className="spinner"/>{t.processingBtn}</> : (sel==="free" ? t.startFreeBtn : t.startSubBtn)}
        </button>
        <div style={{ fontSize:11,color:"var(--text3)",textAlign:"center",lineHeight:1.5 }}>
          {t.terms}
        </div>
      </div>
    </div>
  );
}
