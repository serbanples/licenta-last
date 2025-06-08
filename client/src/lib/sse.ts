import { useState, useEffect } from 'react';

/**
 * Generic payload type for SSE messages.
 */
type SSEPayload = unknown;

type Callback<T = SSEPayload> = (payload: T) => void;

/**
 * SSEService manages a single EventSource connection and topic-based subscriptions.
 */
class SSEService {
  private es: EventSource | null = null;
  private topics: Map<string, Set<Callback>> = new Map();
  private reconnectInterval = 1000;
  private maxReconnectInterval = 30000;

  constructor(private url: string) {
    this.connect();
  }

  /** Initialize EventSource and bind handlers */
  private connect(): void {
    this.es = new EventSource(this.url, { withCredentials: true });

    this.es.onopen = (): void => {
      console.info('SSE connection established.');
      this.reconnectInterval = 1000;
    };

    this.es.onmessage = (e: MessageEvent): void => {
      try {
        console.log(e)
        const data = JSON.parse(e.data) as Record<string, unknown>;
        this.dispatch(data);
      } catch (error) {
        console.error('Failed to parse SSE message', error);
      }
    };

    this.es.onerror = (): void => {
      console.warn('SSE connection lost. Reconnecting...');
      if (this.es && this.es.readyState !== EventSource.CLOSED) {
        this.es.close();
      }
    //   this.es?.close();
      setTimeout(() => this.connect(), this.reconnectInterval);
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 2,
        this.maxReconnectInterval
      );
    };
  }

  /** Dispatch incoming data to all matching topic subscribers */
  private dispatch(data: Record<string, any>): void {
    // Object.entries(data).forEach(([key, value]) => {
    //   const handlers = this.topics.get(key);
    //   console.log(handlers)
    //   handlers?.forEach((cb) => cb(value));
    // });
    const topic = data.topic;
    console.log(topic);
    console.log(this.topics)
    const handlers = this.topics.get(topic);
    handlers?.forEach((cb) => cb(data))
  }

  /**
   * Subscribe to a specific topic.
   * @returns Unsubscribe function
   */
  public subscribe<T = SSEPayload>(
    topic: string,
    callback: Callback<T>
  ): () => void {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, new Set());
    }
    const handlers = this.topics.get(topic)!;
    handlers.add(callback as Callback);

    return () => this.unsubscribe(topic, callback as Callback);
  }

  /** Unsubscribe a handler from a topic */
  public unsubscribe<T = SSEPayload>(
    topic: string,
    callback: Callback<T>
  ): void {
    const handlers = this.topics.get(topic);
    if (handlers) {
      handlers.delete(callback as Callback);
      if (handlers.size === 0) {
        this.topics.delete(topic);
      }
    }
  }

  /** Close connection and clear all subscriptions */
  public close(): void {
    this.es?.close();
    this.topics.clear();
  }
}

// Singleton instance pointing at your SSE endpoint
const sseService = new SSEService('http://localhost:5610/sse/events');

/**
 * Subscribe to an SSE topic.
 */
export function subscribeToTopic<T>(
  topic: string,
  callback: Callback<T>
): () => void {
  return sseService.subscribe(topic, callback);
}

/**
 * React hook to subscribe to a topic and get its latest value.
 */
export function useSSETopic<T>(topic: string): T | undefined {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const unsubscribe = subscribeToTopic<T>(topic, setValue);
    return () => unsubscribe();
  }, [topic]);

  return value;
}
