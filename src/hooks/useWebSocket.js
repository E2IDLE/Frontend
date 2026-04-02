import { useRef, useCallback } from "react";

// 환경에 따라 주소가 다를 수 있으니 확인 필요 (현재는 깃허브 기준 주소)
const WS_URL = "wss://directp2p.happytanuki.kr/ws";

/**
 * Manages a WebSocket connection to the DirectP2P server.
 * 알람(Notification) 수신 기능을 추가하고 이벤트 처리를 강화했습니다.
 */
export function useWebSocket({ 
  onPeerJoined, 
  onStatusChanged, 
  onPeerDisconnected, 
  onConnectionRequest,
  onNotification // <-- 새로 추가된 알람 콜백
}) {
  const wsRef = useRef(null);
  const cbRef = useRef({});
  
  // 콜백 함수들을 최신 상태로 유지
  cbRef.current = { 
    onPeerJoined, 
    onStatusChanged, 
    onPeerDisconnected, 
    onConnectionRequest,
    onNotification 
  };

  const connect = useCallback((token) => {
    if (!token) return;
    // 기존 연결이 있다면 깔끔하게 닫고 새로 연결
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onmessage = (evt) => {
      let msg;
      try { 
        msg = JSON.parse(evt.data); 
      } catch (err) { 
        console.error("WS JSON Parse Error:", err);
        return; 
      }

      const { event, data } = msg;
      
      // 콘솔에서 실제 데이터가 어떻게 들어오는지 확인용 (디버깅 완료 후 삭제 가능)
      console.log(`[WS Event Received]: ${event}`, data);

      // 1. 기존 세션 관련 이벤트
      if (event === "session:peer_joined") cbRef.current.onPeerJoined?.(data);
      else if (event === "session:status_changed") cbRef.current.onStatusChanged?.(data);
      else if (event === "session:peer_disconnected") cbRef.current.onPeerDisconnected?.(data);
      else if (event === "session:connection_request") cbRef.current.onConnectionRequest?.(data);
      
      // 2. 알람 및 친구 신청 관련 이벤트 (서버 사양에 맞춰 추가)
      else if (event === "notification:new" || event === "friend:request_received") {
        cbRef.current.onNotification?.(data);
      }
      
      // 3. 서버 상태 체크 응답 (Status 체크 에러 방지용)
      else if (event === "system:status") {
        console.log("Server Status OK");
      }
    };

    ws.onopen = () => console.log("✅ WebSocket Connected");
    ws.onclose = () => console.log("❌ WebSocket Disconnected");
    ws.onerror = (err) => console.error("⚠️ WebSocket Error:", err);

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