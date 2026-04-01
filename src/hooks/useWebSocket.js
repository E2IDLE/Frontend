import { useRef, useCallback } from "react";

const WS_URL = "wss://api-dev.directp2p.com/ws";

/**
 * Manages a WebSocket connection to the DirectP2P server.
 * Call connect(token) after login; disconnect() on logout.
 * Callbacks are kept fresh via ref to avoid stale closures.
 */
export function useWebSocket({ onPeerJoined, onStatusChanged }) {
  const wsRef = useRef(null);
  const cbRef = useRef({});
  cbRef.current = { onPeerJoined, onStatusChanged };

  const connect = useCallback((token) => {
    if (!token) return;
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onmessage = (evt) => {
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }
      const { event, data } = msg;
      if (event === "session:peer_joined") cbRef.current.onPeerJoined?.(data);
      else if (event === "session:status_changed") cbRef.current.onStatusChanged?.(data);
    };

    ws.onerror = () => {};
    wsRef.current = ws;
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  return { connect, disconnect };
}
