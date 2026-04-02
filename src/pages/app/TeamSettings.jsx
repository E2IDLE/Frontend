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

function TransferStatus({ status, connectionType, isMe }) {
  if (isMe) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
        <span className="status-dot active" />
        전송 중
      </div>
    );
  }
  if (status === "connected" && connectionType) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
        <span className="status-dot active" />
        전송 중
      </div>
    );
  }
  if (status === "connected") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
        <span className="status-dot idle" />
        대기 중
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
      <span className="status-dot offline" />
      접속 종료
    </div>
  );
}

export default function TeamSettings() {
  const [me, setMe] = useState(null);
  const [peers, setPeers] = useState([]);
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

      // 에이전트 피어 목록 (에이전트 미실행 시 빈 배열)
      try {
        const res = await agentCall("GET", "/peers");
        if (!cancelled && res.ok) {
          setPeers(await res.json());
        }
      } catch {
        if (!cancelled) setPeers([]);
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
                  <th>전송 상태</th>
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
                    <td><TransferStatus isMe /></td>
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
                      <TransferStatus
                        status={peer.status}
                        connectionType={peer.connectionType}
                      />
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
              연결된 피어가 없습니다. 에이전트를 실행하고 상대방과 연결하세요.
            </div>
          )}
        </>
      )}
    </div>
  );
}
