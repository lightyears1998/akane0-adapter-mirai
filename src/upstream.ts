export type UpstreamMessage = Record<string, unknown>

export interface WebsocketMessage {
  syncId: string
  data: UpstreamMessage
}

export type WebSocketMessageCallback = (message: UpstreamMessage) => void
