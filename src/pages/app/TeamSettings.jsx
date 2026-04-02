import { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import { apiFetch, agentCall } from "../../utils/api";

async function requestConnect(peer) {
  try {
    const res = await apiFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({ peerId: peer.peerId }),
    });
    if (res.ok) {
      toast("연결 신청을 보냈습니다.", "ok");
    } else {
      toast("연결 신청에 실패했습니다.", "err");
    }
  } catch {
    toast("에이전트에 연결할 수 없습니다.", "err");
  }
}

// 피어 응답에서 배열을 추출 (배열 직접 반환 or { peers/data/items: [] } 등 래핑 대응)
function extractPeers(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const nested = raw.peers ?? raw.data ?? raw.items ?? raw.list;
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

function MeStatus({ peers, agentError }) {
  if (agentError) {
    return <ConnectionStatus dot="offline" label="접속 종료" />;
  }
  const hasConnected = peers.some(p => p.status === "connected");
  if (hasConnected) {
    return <ConnectionStatus dot="active" label="연결 중" />;
  }
  return <ConnectionStatus dot="idle" label="대기 중" />;
}

function PeerStatus({ status, connectionType }) {
  if (status === "connected" && connectionType) {
    return <ConnectionStatus dot="active" label="연결 중" />;
  }
  if (status === "connected") {
    return <ConnectionStatus dot="idle" label="대기 중" />;
  }
  return <ConnectionStatus dot="offline" label="접속 종료" />;
}

export default function TeamSettings() {
  const [me, setMe] = useState(null);
  const [peers, setPeers] = useState([]);
  const [agentError, setAgentError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      // 내 프로필
      try {
        const res = await apiFetch("/users/me");
        if (!cancelled) {
          if (res.ok) {
            setMe(await res.json());
          } else {
            toast("유저 정보를 불러오지 못했습니다.", "err");
          }
        }
      } catch {
        if (!cancelled) toast("유저 정보를 불러오지 못했습니다.", "err");
      }

      // 에이전트 피어 목록
      try {
        const res = await agentCall("GET", "/users");
        if (!cancelled) {
          if (res.ok) {
            const raw = await res.json();
            console.log("[TeamSettings] /peers raw:", raw);
            setPeers(extractPeers(raw));
            setAgentError(false);
          } else {
            setPeers([]);
            setAgentError(true);
          }
        }
      } catch {
        if (!cancelled) {
          setPeers([]);
          setAgentError(true);
        }
      }

      if (!cancelled) setLoading(false);
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  const totalCount = (me ? 1 : 0) + peers.length;

  return (
    <div style={{ padding: 24, flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 4 }}>
          팀 설정
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
                          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                            {me.userId ? String(me.userId).slice(0, 8) : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge admin">Admin</span></td>
                    <td><MeStatus peers={peers} agentError={agentError} /></td>
                    <td></td>
                  </tr>
                )}

                {peers.map(peer => (
                  <tr key={peer.peerId}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "var(--surface2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--mono)", fontSize: 10, color: "var(--text)", fontWeight: 700, flexShrink: 0,
                        }}>
                          {(peer.nickname || peer.peerId || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                            {peer.nickname || "알 수 없음"}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                            {peer.peerId ? String(peer.peerId).slice(0, 8) : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge editor">Editor</span></td>
                    <td>
                      <PeerStatus status={peer.status} connectionType={peer.connectionType} />
                    </td>
                    <td>
                      <button className="btn-sm-blue" onClick={() => requestConnect(peer)}>
                        연결 신청
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {peers.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text2)", fontSize: 13 }}>
              {agentError
                ? "에이전트에 연결할 수 없습니다. 에이전트가 실행 중인지 확인하세요."
                : "연결된 피어가 없습니다. 상대방과 연결하세요."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
