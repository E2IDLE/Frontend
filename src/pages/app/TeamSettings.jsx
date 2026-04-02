import { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import { apiFetch } from "../../utils/api";

async function requestConnect(user) {
  try {
    const res = await apiFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({ userId: user.userId }),
    });
    if (res.ok) {
      toast("연결 신청을 보냈습니다.", "ok");
    } else {
      toast("연결 신청에 실패했습니다.", "err");
    }
  } catch {
    toast("연결 신청에 실패했습니다.", "err");
  }
}

function extractUsers(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const nested = raw.users ?? raw.data ?? raw.items ?? raw.list;
    if (Array.isArray(nested)) return nested;
  }
  return [];
}

function ConnectionStatus({ dot, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
      <span className={`status-dot ${dot}`} />
      {label}
    </div>
  );
}

export default function TeamSettings() {
  const [me, setMe] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      let myProfile = null;

      // 내 프로필
      try {
        const res = await apiFetch("/users/me");
        if (!cancelled && res.ok) {
          myProfile = await res.json();
          setMe(myProfile);
        } else if (!cancelled) {
          toast("유저 정보를 불러오지 못했습니다.", "err");
        }
      } catch {
        if (!cancelled) toast("유저 정보를 불러오지 못했습니다.", "err");
      }

      // 전체 유저 목록 (나 제외)
      try {
        const res = await apiFetch("/users");
        if (!cancelled) {
          if (res.ok) {
            const raw = await res.json();
            const all = extractUsers(raw);
            const myId = myProfile?.userId;
            setOthers(myId ? all.filter(u => u.userId !== myId) : all);
          } else {
            toast("유저 목록을 불러오지 못했습니다.", "err");
          }
        }
      } catch {
        if (!cancelled) toast("유저 목록을 불러오지 못했습니다.", "err");
      }

      if (!cancelled) setLoading(false);
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  const totalCount = (me ? 1 : 0) + others.length;

  return (
    <div style={{ padding: 24, flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
          친구 설정
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>
          총 {totalCount}명
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
          <div style={{
            width: 28, height: 28,
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin .6s linear infinite",
          }} />
        </div>
      ) : (
        <>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            <table className="members-table">
              <thead>
                <tr>
                  <th>프로필</th>
                  <th>권한</th>
                  <th>연결 상태</th>
                  <th>연결 신청</th>
                </tr>
              </thead>
              <tbody>
                {me && (
                  <tr>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "var(--accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--mono)", fontSize: 10, color: "#fff", fontWeight: 700, flexShrink: 0,
                        }}>
                          {(me.nickname || me.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                              {me.nickname || me.email}
                            </span>
                            <span style={{
                              fontFamily: "var(--mono)", fontSize: 10,
                              background: "var(--accent)", color: "#fff",
                              padding: "1px 6px", borderRadius: 2,
                            }}>나</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>
                            {me.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge admin">Admin</span></td>
                    <td><ConnectionStatus dot="idle" label="대기 중" /></td>
                    <td></td>
                  </tr>
                )}

                {others.map(user => {
                  const display = user.nickname || user.email || String(user.userId || "");
                  const initial = display[0]?.toUpperCase() || "?";
                  return (
                    <tr key={user.userId ?? user.email}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "var(--surface2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--mono)", fontSize: 10, color: "var(--text)", fontWeight: 700, flexShrink: 0,
                          }}>
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                              {display}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text3)" }}>
                              {user.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span className="role-badge editor">Editor</span></td>
                      <td><ConnectionStatus dot="idle" label="대기 중" /></td>
                      <td>
                        <button className="btn-sm-blue" onClick={() => requestConnect(user)}>
                          연결 신청
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {others.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text2)", fontSize: 13 }}>
              등록된 다른 유저가 없습니다.
            </div>
          )}
        </>
      )}
    </div>
  );
}
