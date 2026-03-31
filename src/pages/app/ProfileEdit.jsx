import { useState } from "react";
import { toast } from "../../utils/toast";

const SKILLS = ["영상 편집", "모션 그래픽", "색보정", "음향 편집", "3D 렌더링", "스트리밍"];

const DEFAULTS = {
  form: {
    displayName: "ML",
    fullName: "미래 리드",
    email: "ml@example.com",
    bio: "다이렉트 P2P 영상 편집 플랫폼을 주로 사용하는 영상 편집자입니다.",
    timezone: "Asia/Seoul",
    language: "ko",
    avatar: "ML",
  },
  skills: ["영상 편집", "색보정"],
  notifications: {
    transferComplete: true,
    teamInvite: true,
    systemAlert: false,
    newsletter: false,
  },
};

const PROFILE_VERSION = 1;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const { version, data } = JSON.parse(raw);
    if (version !== PROFILE_VERSION) return fallback;
    return data;
  } catch { return fallback; }
}

export default function ProfileEdit() {
  const [form, setForm] = useState(() => load("profile_form", DEFAULTS.form));
  const [selectedSkills, setSelectedSkills] = useState(() => load("profile_skills", DEFAULTS.skills));
  const [notifications, setNotifications] = useState(() => load("profile_notifications", DEFAULTS.notifications));
  const [saving, setSaving] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleSkill = (s) => {
    setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("profile_form", JSON.stringify({ version: PROFILE_VERSION, data: form }));
      localStorage.setItem("profile_skills", JSON.stringify({ version: PROFILE_VERSION, data: selectedSkills }));
      localStorage.setItem("profile_notifications", JSON.stringify({ version: PROFILE_VERSION, data: notifications }));
      setSaving(false);
      toast("프로필이 저장되었습니다.", "success");
    }, 900);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 760, margin: "0 auto" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>ACCOUNT</div>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, letterSpacing: "-.01em" }}>
          프로필 편집
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>
          계정 정보 및 개인 설정을 관리합니다.
        </p>
      </div>

      {/* 아바타 + 기본 정보 */}
      <div className="settings-card" style={{ marginBottom: 20 }}>
        <div className="panel-label" style={{ marginBottom: 20 }}>프로필 사진 및 이름</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
          {/* 아바타 미리보기 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--accent)", display: "flex", alignItems: "center",
              justifyContent: "center", fontFamily: "var(--mono)",
              fontSize: 22, fontWeight: 700, color: "#fff",
              border: "2px solid var(--border2)", flexShrink: 0,
            }}>
              {form.avatar.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="form-input"
                style={{ width: 72, textAlign: "center", fontFamily: "var(--mono)", fontSize: 12, padding: "5px 8px" }}
                value={avatarInput}
                maxLength={2}
                placeholder="이니셜"
                onChange={e => setAvatarInput(e.target.value)}
              />
              <button
                className="btn-sm-blue"
                onClick={() => { if (avatarInput.trim()) { set("avatar", avatarInput.trim()); setAvatarInput(""); } }}
              >변경</button>
            </div>
          </div>

          {/* 이름 필드 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">표시 이름 (이니셜)</label>
                <input className="form-input" value={form.displayName} maxLength={4}
                  onChange={e => set("displayName", e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">실명</label>
                <input className="form-input" value={form.fullName}
                  onChange={e => set("fullName", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">이메일</label>
              <input className="form-input" type="email" value={form.email}
                onChange={e => set("email", e.target.value)} />
            </div>
          </div>
        </div>

        {/* 소개 */}
        <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
          <label className="form-label">자기소개</label>
          <textarea
            className="form-input"
            style={{ resize: "vertical", minHeight: 72, lineHeight: 1.6 }}
            value={form.bio}
            maxLength={160}
            onChange={e => set("bio", e.target.value)}
          />
          <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", textAlign: "right", marginTop: 4 }}>
            {form.bio.length} / 160
          </div>
        </div>
      </div>

      {/* 지역 설정 */}
      <div className="settings-card" style={{ marginBottom: 20 }}>
        <div className="panel-label" style={{ marginBottom: 20 }}>지역 및 언어</div>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">시간대</label>
            <select className="form-input" value={form.timezone} onChange={e => set("timezone", e.target.value)}>
              <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">언어</label>
            <select className="form-input" value={form.language} onChange={e => set("language", e.target.value)}>
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </div>

      {/* 스킬 태그 */}
      <div className="settings-card" style={{ marginBottom: 20 }}>
        <div className="panel-label" style={{ marginBottom: 16 }}>전문 스킬</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SKILLS.map(s => (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              style={{
                fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".06em",
                padding: "5px 12px", borderRadius: 3, cursor: "pointer", transition: "all .15s",
                border: selectedSkills.includes(s) ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: selectedSkills.includes(s) ? "rgba(37,99,235,.12)" : "none",
                color: selectedSkills.includes(s) ? "var(--accent2)" : "var(--text3)",
              }}
            >{s}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 12, fontFamily: "var(--mono)" }}>
          {selectedSkills.length}개 선택됨
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="settings-card" style={{ marginBottom: 28 }}>
        <div className="panel-label" style={{ marginBottom: 20 }}>알림 설정</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "transferComplete", label: "전송 완료 알림", desc: "P2P 파일 전송이 완료되면 알림을 받습니다." },
            { key: "teamInvite",       label: "팀 초대 알림",   desc: "팀에 초대되었을 때 알림을 받습니다." },
            { key: "systemAlert",      label: "시스템 알림",    desc: "시스템 점검 및 오류 발생 시 알림을 받습니다." },
            { key: "newsletter",       label: "뉴스레터",        desc: "업데이트 및 새 기능 소식을 이메일로 받습니다." },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{desc}</div>
              </div>
              <label className="toggle" style={{ flexShrink: 0 }}>
                <input type="checkbox" checked={notifications[key]}
                  onChange={() => setNotifications(p => ({ ...p, [key]: !p[key] }))} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="btn-ghost" onClick={() => toast("변경사항이 취소되었습니다.", "warn")}>
          취소
        </button>
        <button className="btn-primary" style={{ padding: "9px 24px", fontSize: 12 }} onClick={handleSave} disabled={saving}>
          {saving && <span className="spinner" />}
          {saving ? "저장 중..." : "변경사항 저장"}
        </button>
      </div>
    </div>
  );
}
