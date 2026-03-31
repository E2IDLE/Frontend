import { useState } from "react";
import PubNav from "../components/PubNav";
import FormField from "../components/FormField";
import { toast } from "../utils/toast";

export default function Auth({ mode, setPage }) {
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
              <FormField label="이름" id="name" ph="성함을 입력하세요" err={errs.name} val={form.name} onChange={e=>set("name",e.target.value)} />
              <FormField label="닉네임" id="nick" ph="닉네임" val={form.nick} onChange={e=>set("nick",e.target.value)} />
            </div>
          )}
          <FormField label="이메일 주소" id="email" type="email" ph="name@company.com" err={errs.email} val={form.email} onChange={e=>set("email",e.target.value)} />
          <FormField label="비밀번호" id="pw" type="password" ph="••••••••" err={errs.pw} val={form.pw} onChange={e=>set("pw",e.target.value)} />

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
