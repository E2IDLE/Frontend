import { useState } from "react";
import PubNav from "../components/PubNav";
import PubFooter from "../components/PubFooter";
import { toast } from "../utils/toast";

const OS_DATA = {
  windows: {
    label: "⊞ Windows",
    file: "DirectP2P_Agent_Win_x64.exe",
    size: "45MB",
    checksum: "a3f9b2c17d4e58f0912ab34cd5ef6789abcd1234ef567890abcdef1234567890",
    installStep: "다운로드한 .exe 파일을 실행하고 설치 마법사의 지침에 따라 설정을 완료합니다.",
    installCmd: "directp2p-agent setup.exe",
  },
  macos: {
    label: "⌘ macOS",
    file: "DirectP2P_Agent_Mac_arm64.dmg",
    size: "42MB",
    checksum: "b4e0c3d28e5f69a1023bc45de6fg7890bcde2345fg678901bcdefg2345678901",
    installStep: "DMG를 마운트하고 Applications 폴더로 드래그합니다.",
    installCmd: "open DirectP2P_Agent_Mac_arm64.dmg",
  },
  linux: {
    label: "🐧 Linux",
    file: "DirectP2P_Agent_Linux_amd64.deb",
    size: "38MB",
    checksum: "c5f1d4e39f6g7ab2134cd56ef7gh8901cdef3456gh789012cdefgh3456789012",
    installStep: "sudo dpkg -i directp2p-agent_1.0.0_amd64.deb 명령어로 설치합니다.",
    installCmd: "sudo dpkg -i directp2p-agent_1.0.0_amd64.deb",
  },
};

const FAQS = [
  {
    q: "방화벽 설정이 필요한가요?",
    a: "DirectP2P Agent는 로컬 포트 17432를 사용합니다. 방화벽에서 TCP/UDP 17432 포트를 허용해 주세요. Windows의 경우 설치 과정에서 자동으로 방화벽 예외 규칙이 추가됩니다.",
  },
  {
    q: "바이러스 백신에서 위험 요소로 감지됩니다.",
    a: "DirectP2P Agent는 코드 서명(Code Signing)된 공식 바이너리입니다. 일부 휴리스틱 기반 바이러스 백신이 P2P 네트워크 연결을 오탐지할 수 있습니다. 공식 사이트에서 다운로드한 파일의 SHA-256 체크섬을 확인하면 무결성을 검증할 수 있습니다.",
  },
  {
    q: "자동 업데이트는 지원되나요?",
    a: "네, DirectP2P Agent는 백그라운드에서 최신 버전을 확인하고 자동으로 업데이트합니다. 시스템 트레이 아이콘을 통해 업데이트 상태를 확인할 수 있으며, 설정에서 자동 업데이트를 비활성화할 수도 있습니다.",
  },
  {
    q: "에이전트를 완전히 삭제하려면 어떻게 하나요?",
    a: "Windows: 제어판 → 프로그램 추가/제거에서 DirectP2P Agent를 제거합니다. macOS: Applications 폴더에서 앱을 휴지통으로 이동 후 ~/Library/Application Support/DirectP2P를 삭제합니다. Linux: sudo apt remove directp2p-agent 명령어를 사용합니다.",
  },
];

export default function Install({ setPage }) {
  const [os, setOs] = useState("windows");
  const [faqOpen, setFaqOpen] = useState(null);
  const data = OS_DATA[os];

  const handleDownload = () => {
    toast("다운로드가 시작됩니다.", "ok");
  };

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(data.checksum).catch(() => {});
    toast("체크섬이 복사되었습니다.", "info");
  };

  return (
    <div className="page">
      <PubNav setPage={setPage} />

      {/* ① 히어로 섹션 */}
      <div className="hero" style={{ alignItems: "center", textAlign: "center", minHeight: 320, justifyContent: "center" }}>
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-badge">
          <span className="badge-dot" />
          AGENT V1.0.1 — 최신 버전
        </div>
        <h1 className="hero-title" style={{ fontFamily: "var(--display)", fontSize: "clamp(32px,5vw,64px)", maxWidth: "100%" }}>
          DirectP2P Agent<br />설치 가이드
        </h1>
        <p className="hero-desc" style={{ marginBottom: 0 }}>
          로컬 에이전트를 설치하면 안전하고 빠른 P2P 전송이 시작됩니다.<br />
          워크플로우의 가속을 경험하세요.
        </p>
      </div>

      {/* ② OS 탭 */}
      <div style={{ padding: "0 48px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {Object.entries(OS_DATA).map(([key, d]) => (
            <button
              key={key}
              className={`app-tab${os === key ? " active" : ""}`}
              onClick={() => setOs(key)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ③ 설치 섹션 */}
      <div style={{ padding: "48px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* 왼쪽 카드 */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 28 }}>
          <div className="section-label">// 01. DOWNLOAD</div>

          {/* 다운로드 버튼 */}
          <button
            className="btn-cta"
            style={{ width: "100%", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            onClick={handleDownload}
          >
            <span style={{ fontSize: 16 }}>↓</span>
            <span>{data.file} ({data.size})</span>
          </button>

          {/* SHA-256 체크섬 행 */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>SHA-256: </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", wordBreak: "break-all" }}>
                {data.checksum}
              </span>
            </div>
            <button
              onClick={handleCopyChecksum}
              style={{ background: "none", border: "1px solid var(--border)", borderRadius: 3, padding: "4px 8px", color: "var(--text3)", fontSize: 12, flexShrink: 0, cursor: "pointer", transition: "all .2s" }}
              title="복사"
            >
              ⧉
            </button>
          </div>

          {/* 설치 단계 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                num: "01",
                title: "파일 다운로드",
                desc: "위의 버튼을 클릭하여 시스템 아키텍처에 맞는 설치 프로그램을 다운로드합니다.",
              },
              {
                num: "02",
                title: "설치 프로그램 실행",
                desc: data.installStep,
              },
              {
                num: "03",
                title: "대시보드 연결",
                desc: "설치가 완료되면 에이전트가 백그라운드에서 실행되며 웹 대시보드와 자동으로 동기화됩니다.",
              },
            ].map((step) => (
              <div key={step.num} style={{ display: "flex", gap: 16 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent2)", minWidth: 28, paddingTop: 2 }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 카드 */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>// INSTALL GUIDE</div>
            <span style={{ fontSize: 20 }}>🛡</span>
          </div>

          <h2 style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>설치 확인</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
            에이전트가 올바르게 작동하는지 확인하려면 아래 명령어를 터미널에서 실행하거나 상태 코드를 확인하세요.
          </p>

          {/* REQUEST 코드블록 */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: ".1em" }}>REQUEST</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--accent2)", background: "rgba(37,99,235,0.15)", padding: "2px 6px", borderRadius: 2, letterSpacing: ".06em" }}>GET</span>
            </div>
            <code style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)" }}>
              curl http://localhost:17432/status
            </code>
          </div>

          {/* RESPONSE 코드블록 */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: 14, marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: ".1em", marginBottom: 10 }}>RESPONSE</div>
            <pre style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--green)", margin: 0, lineHeight: 1.7 }}>{`{
  "status": "ready",
  "version": "1.0.1",
  "p2p_active": true,
  "node_id": "dp2p_8f2a9..."
}`}</pre>
          </div>

          {/* DirectP2P 시작하기 버튼 */}
          <button
            className="btn-cta"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            onClick={() => setPage("login")}
          >
            <span>DirectP2P 시작하기</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* ④ FAQ 섹션 */}
      <div style={{ padding: "80px 48px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: 40 }}>
          자주 묻는 질문
        </h2>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "left" }}>
          {FAQS.map((f, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {f.q}
                <span className="faq-icon">{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>

      <PubFooter setPage={setPage} />
    </div>
  );
}
