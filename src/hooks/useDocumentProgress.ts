import { Client, type IMessage } from '@stomp/stompjs'
import { useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { apiUrl } from '@/lib/api'
import type { WebSocketProgressMessage } from '@/types/api'

const DOCUMENTS_ENDPOINT = '/ws/documents'
const DOCUMENTS_QUEUE = '/user/queue/documents'

/**
 * Subscribes to the authenticated user's private document queue.
 * STOMP requires an explicit bearer header because HttpOnly cookies are not sent
 * by STOMP clients; the token is kept in memory by the API client.
 */
export function useDocumentProgress(
  userId: string | undefined,
  token: string | null,
  onMessage: (message: WebSocketProgressMessage) => void,
) {
  const handler = useRef(onMessage)
  useEffect(() => {
    handler.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!userId || !token) return

    const client = new Client({
      webSocketFactory: () => new SockJS(apiUrl(DOCUMENTS_ENDPOINT)) as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      onConnect: () => {
        client.subscribe(DOCUMENTS_QUEUE, (frame: IMessage) => {
          try {
            handler.current(JSON.parse(frame.body) as WebSocketProgressMessage)
          } catch {
            // Ignore malformed frames; the REST status endpoint remains authoritative.
          }
        })
      },
    })

    client.activate()
    return () => {
      void client.deactivate()
    }
  }, [userId, token])
}
