import { useState } from "react";
import PubNav from "../components/PubNav";
import FormField from "../components/FormField";
import { toast } from "../utils/toast";
import { apiFetch, setToken } from "../utils/api";

const LEGAL = {
  terms: {
    title: "이용약관",
    sections: [
      {
        heading: "제1조 (목적)",
        body: "본 약관은 DirectP2P(이하 '서비스')가 제공하는 P2P 미디어 전송 및 협업 플랫폼 서비스의 이용에 관한 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
      },
      {
        heading: "제2조 (정의)",
        body: "'서비스'란 DirectP2P가 운영하는 P2P 기반 미디어 전송·편집 협업 플랫폼 및 관련 부가 서비스 일체를 의미합니다.\n'이용자'란 본 약관에 동의하고 서비스에 가입하여 이용하는 개인 또는 법인을 말합니다.\n'콘텐츠'란 이용자가 서비스를 통해 업로드·전송·공유하는 영상, 이미지, 오디오 등 모든 디지털 파일을 의미합니다.",
      },
      {
        heading: "제3조 (약관의 효력 및 변경)",
        body: "본 약관은 서비스 가입 시 동의 절차를 통해 효력이 발생합니다. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 7일 전 공지합니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.",
      },
      {
        heading: "제4조 (서비스 이용)",
        body: "이용자는 서비스 가입 시 정확한 정보를 제공해야 하며, 허위 정보 제공으로 인한 불이익에 대한 책임은 이용자에게 있습니다. 이용자는 타인의 계정을 무단으로 사용할 수 없으며, 계정 도용 등의 사실을 인지한 경우 즉시 회사에 통보해야 합니다.",
      },
      {
        heading: "제5조 (P2P 전송 및 데이터)",
        body: "서비스는 P2P 방식으로 데이터를 전송하며, 전송 중 데이터는 AES-256 암호화로 보호됩니다. 이용자가 공유하는 콘텐츠의 저작권 및 법적 책임은 이용자에게 있으며, 불법 콘텐츠 전송 시 서비스 이용이 즉시 제한될 수 있습니다.",
      },
      {
        heading: "제6조 (금지 행위)",
        body: "이용자는 다음 행위를 해서는 안 됩니다: 타인의 저작권·지식재산권 침해 콘텐츠 전송, 악성코드·바이러스 등 유해 파일 배포, 서비스 시스템 해킹 및 무력화 시도, 상업적 목적의 스팸 전송, 기타 관련 법령 위반 행위.",
      },
      {
        heading: "제7조 (서비스 중단)",
        body: "회사는 시스템 점검·장애·천재지변 등 불가피한 사유 발생 시 서비스 제공을 일시 중단할 수 있습니다. 이 경우 사전 공지를 원칙으로 하나, 긴급한 경우 사후 공지할 수 있습니다.",
      },
      {
        heading: "제8조 (면책조항)",
        body: "회사는 이용자 간 P2P 전송 과정에서 발생하는 콘텐츠 손실·유출에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다. 이용자의 귀책사유로 인한 서비스 이용 장애에 대해서도 책임을 지지 않습니다.",
      },
      {
        heading: "제9조 (준거법 및 관할)",
        body: "본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁은 서울중앙지방법원을 제1심 전속 관할 법원으로 합니다.",
      },
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    sections: [
      {
        heading: "1. 수집하는 개인정보 항목",
        body: "[필수] 이름, 이메일 주소, 비밀번호(암호화 저장)\n[선택] 닉네임, 프로필 사진, 직무 정보, 시간대\n[자동 수집] IP 주소, 접속 기기 정보, 서비스 이용 로그, 쿠키",
      },
      {
        heading: "2. 개인정보의 수집 및 이용 목적",
        body: "회원 가입 및 본인 확인, 서비스 제공 및 계약 이행, P2P 연결 식별 및 보안 유지, 고객 지원 및 공지사항 전달, 서비스 개선을 위한 통계 분석 (개인 식별 불가 형태).",
      },
      {
        heading: "3. 개인정보의 보유 및 이용 기간",
        body: "회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.\n- 계약·청약철회 기록: 5년 (전자상거래법)\n- 접속 로그: 3개월 (통신비밀보호법)",
      },
      {
        heading: "4. 개인정보의 제3자 제공",
        body: "회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 이용자의 사전 동의가 있거나, 법령에 의거한 수사기관 요청 등 특별한 경우에는 예외로 합니다.",
      },
      {
        heading: "5. 개인정보 처리 위탁",
        body: "원활한 서비스 제공을 위해 아래 업무를 외부에 위탁할 수 있습니다.\n- 클라우드 인프라 운영: AWS / Google Cloud\n- 이메일 발송: SendGrid\n위탁 업체는 위탁받은 업무 수행 외 개인정보를 사용할 수 없습니다.",
      },
      {
        heading: "6. 이용자의 권리",
        body: "이용자는 언제든지 자신의 개인정보를 조회·수정·삭제할 수 있으며, 개인정보 처리에 대한 동의를 철회할 수 있습니다. 요청은 프로필 편집 메뉴 또는 고객센터(privacy@directp2p.com)를 통해 가능합니다.",
      },
      {
        heading: "7. 개인정보의 보안",
        body: "전송 데이터는 AES-256 암호화로 보호되며, 비밀번호는 단방향 해시(bcrypt) 처리 후 저장됩니다. 개인정보 접근 권한은 최소한의 담당자에게만 부여하고, 정기적인 보안 점검을 실시합니다.",
      },
      {
        heading: "8. 쿠키 및 자동 수집 정보",
        body: "서비스는 쿠키를 사용하여 로그인 상태 유지 및 이용 편의를 제공합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.",
      },
      {
        heading: "9. 개인정보 보호책임자",
        body: "성명: 미래 리드\n직책: 개인정보 보호책임자\n이메일: privacy@directp2p.com\n전화: 02-0000-0000",
      },
      {
        heading: "10. 시행일",
        body: "본 방침은 2025년 1월 1일부터 시행됩니다.",
      },
    ],
  },
};

function LegalModal({ type, onClose }) {
  const doc = LEGAL[type];
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:10,width:"min(680px,94vw)",maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"scIn .2s ease" }}>
        <div style={{ padding:"24px 28px 16px",borderBottom:"1px solid var(--border)",flexShrink:0 }}>
          <div style={{ fontFamily:"var(--mono)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",marginBottom:6 }}>// DirectP2P Legal</div>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-.02em" }}>{doc.title}</div>
        </div>
        <div style={{ overflowY:"auto",padding:"20px 28px",flex:1 }}>
          {doc.sections.map(s => (
            <div key={s.heading} style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--accent2)",marginBottom:6,letterSpacing:"0.03em" }}>{s.heading}</div>
              <div style={{ fontSize:13,color:"var(--text2)",lineHeight:1.8,whiteSpace:"pre-line" }}>{s.body}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 28px",borderTop:"1px solid var(--border)",flexShrink:0 }}>
          <button onClick={onClose} style={{ width:"100%",fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:"#fff",background:"var(--accent)",border:"none",padding:12,borderRadius:4,letterSpacing:"0.08em",cursor:"pointer" }}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function Auth({ mode, setPage }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name:"", nick:"", email:"", pw:"", agreeTerms:false, agreePrivacy:false });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const set = (k,v) => { setForm(p=>({...p,[k]:v})); setErrs(p=>({...p,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = "이름을 입력하세요.";
    if (!form.email.includes("@")) e.email = "올바른 이메일 주소를 입력하세요.";
    if (form.pw.length < 6) e.pw = "비밀번호는 6자 이상이어야 합니다.";
    if (!isLogin && !form.agreeTerms) e.agreeTerms = "이용약관에 동의해야 합니다.";
    if (!isLogin && !form.agreePrivacy) e.agreePrivacy = "개인정보처리방침에 동의해야 합니다.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);

    // TODO: 서버 준비 완료 후 아래 모킹 제거 및 실제 API 블록 주석 해제
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        setToken("mock-token");
        toast("로그인 성공! 워크스페이스로 이동합니다.", "ok");
        setTimeout(() => setPage("editor"), 700);
      } else {
        toast("계정이 생성되었습니다! 로그인 해주세요.", "ok");
        setTimeout(() => setPage("login"), 700);
      }
    }, 1300);

    // --- 실제 API 연동 (서버 준비 후 위 모킹 제거 후 주석 해제) ---
    // try {
    //   if (isLogin) {
    //     const res = await apiFetch("/auth/login", {
    //       method: "POST",
    //       body: JSON.stringify({ email: form.email, password: form.pw }),
    //     });
    //     if (res.status === 200) {
    //       const data = await res.json();
    //       setToken(data.token ?? data.accessToken ?? data.access_token ?? "");
    //       toast("로그인 성공! 워크스페이스로 이동합니다.", "ok");
    //       setTimeout(() => setPage("editor"), 700);
    //     } else if (res.status === 401) {
    //       toast("이메일 또는 비밀번호가 올바르지 않습니다.", "err");
    //     } else {
    //       toast("서버에 연결할 수 없습니다.", "err");
    //     }
    //   } else {
    //     const res = await apiFetch("/auth/register", {
    //       method: "POST",
    //       body: JSON.stringify({ email: form.email, password: form.pw, nickname: form.nick || form.name }),
    //     });
    //     if (res.status === 201) {
    //       toast("계정이 생성되었습니다! 로그인 해주세요.", "ok");
    //       setTimeout(() => setPage("login"), 700);
    //     } else if (res.status === 400) {
    //       toast("입력값을 확인해주세요.", "err");
    //     } else if (res.status === 409) {
    //       toast("이미 사용 중인 이메일입니다.", "err");
    //     } else {
    //       toast("서버에 연결할 수 없습니다.", "err");
    //     }
    //   }
    // } catch (err) {
    //   toast("서버에 연결할 수 없습니다.", "err");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="page">
      {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
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
            : <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
                <div>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:errs.agreeTerms?4:0 }}>
                    <input type="checkbox" id="agreeTerms" checked={form.agreeTerms} onChange={e=>set("agreeTerms",e.target.checked)} style={{ marginTop:2,accentColor:"var(--accent)",flexShrink:0 }} />
                    <label htmlFor="agreeTerms" style={{ fontSize:12,color:"var(--text2)" }}>
                      <span style={{ color:"var(--accent2)",cursor:"pointer" }} onClick={e=>{e.preventDefault();setLegalModal("terms");}}>이용약관</span>에 동의합니다.
                    </label>
                  </div>
                  {errs.agreeTerms && <div className="form-err" style={{ marginTop:2 }}>{errs.agreeTerms}</div>}
                </div>
                <div>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:errs.agreePrivacy?4:0 }}>
                    <input type="checkbox" id="agreePrivacy" checked={form.agreePrivacy} onChange={e=>set("agreePrivacy",e.target.checked)} style={{ marginTop:2,accentColor:"var(--accent)",flexShrink:0 }} />
                    <label htmlFor="agreePrivacy" style={{ fontSize:12,color:"var(--text2)" }}>
                      <span style={{ color:"var(--accent2)",cursor:"pointer" }} onClick={e=>{e.preventDefault();setLegalModal("privacy");}}>개인정보처리방침</span>에 동의합니다.
                    </label>
                  </div>
                  {errs.agreePrivacy && <div className="form-err" style={{ marginTop:2 }}>{errs.agreePrivacy}</div>}
                </div>
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
