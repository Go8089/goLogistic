import { Client, IMessage, StompConfig } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
const subscriptions: Map<string, (msg: any) => void> = new Map();

function ensureClient() {
  if (stompClient && stompClient.connected) return stompClient;

  stompClient = new Client({
    // BrokerURL not used when using SockJS - supply webSocketFactory instead
    webSocketFactory: () => new SockJS("/ws"),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  } as StompConfig);

  stompClient.onConnect = () => {
    console.log("STOMP connected");
    // re-subscribe existing handlers
    subscriptions.forEach((handler, key) => {
      stompClient?.subscribe(key, (message: IMessage) => {
        try {
          handler(JSON.parse(message.body));
        } catch (e) {
          handler(message.body);
        }
      });
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("Broker reported error: ", frame.headers["message"], frame.body);
  };

  stompClient.activate();
  return stompClient;
}

export function subscribeToShipmentLocation(trackingId: string, handler: (payload: any) => void) {
  const topic = `/topic/shipments/${trackingId}/location`;
  subscriptions.set(topic, handler);
  const client = ensureClient();

  // if already connected subscribe immediately
  if (client && client.connected) {
    client.subscribe(topic, (message: IMessage) => {
      try {
        handler(JSON.parse(message.body));
      } catch (e) {
        handler(message.body);
      }
    });
  }

  return () => unsubscribeShipmentLocation(trackingId);
}

export function unsubscribeShipmentLocation(trackingId: string) {
  const topic = `/topic/shipments/${trackingId}/location`;
  subscriptions.delete(topic);
  // NOTE: stomp.js returns subscription objects normally - we used a simple map and rely on broker to drop
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
