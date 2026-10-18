import { randomUUID } from 'crypto';
import { EventEnvelope, EventType } from './events';

export function createEvent<T extends EventType, P>(params: {
  eventType: T;
  correlationId: string;
  customerId: string;
  source: string;
  payload: P;
  version?: number;
}): EventEnvelope<T, P> {
  return {
    eventId: randomUUID(),
    eventType: params.eventType,
    version: params.version ?? 1,
    occurredAt: new Date().toISOString(),
    correlationId: params.correlationId,
    customerId: params.customerId,
    source: params.source,
    payload: params.payload,
  };
}