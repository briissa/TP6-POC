export type SimulateFailure = 'none' | 'billing' | 'provisioning';

export type EventType =
  | 'ActivationRequested'
  | 'BillingAccountCreated'
  | 'BillingFailed'
  | 'BillingAccountCancelled'
  | 'ProvisioningCompleted'
  | 'ProvisioningFailed'
  | 'ActivationCompleted'
  | 'ActivationFailed';

// Sobre común: todos los eventos lo comparten
export interface EventEnvelope<T extends EventType, P> {
  eventId: string;
  eventType: T;
  version: number;
  occurredAt: string;
  correlationId: string; // = activationId
  customerId: string; // también es la clave de partición en Kafka
  source: string;
  payload: P;
}

// Payloads
export interface ActivationRequestedPayload {
  planId: string;
  channel: string;
  simulateFailure: SimulateFailure;
}

export interface BillingAccountCreatedPayload {
  accountId: string;
}

export interface FailurePayload {
  reason: string;
}

export interface ProvisioningCompletedPayload {
  orderId: string;
}

export interface ActivationFailedPayload {
  reason: string;
  failedStep: 'billing' | 'provisioning';
}

// Eventos concretos
export type ActivationRequested = EventEnvelope<'ActivationRequested', ActivationRequestedPayload>;
export type BillingAccountCreated = EventEnvelope<'BillingAccountCreated', BillingAccountCreatedPayload>;
export type BillingFailed = EventEnvelope<'BillingFailed', FailurePayload>;
export type BillingAccountCancelled = EventEnvelope<'BillingAccountCancelled', BillingAccountCreatedPayload>;
export type ProvisioningCompleted = EventEnvelope<'ProvisioningCompleted', ProvisioningCompletedPayload>;
export type ProvisioningFailed = EventEnvelope<'ProvisioningFailed', FailurePayload>;
export type ActivationCompleted = EventEnvelope<'ActivationCompleted', Record<string, never>>;
export type ActivationFailed = EventEnvelope<'ActivationFailed', ActivationFailedPayload>;

export type AnyEvent =
  | ActivationRequested
  | BillingAccountCreated
  | BillingFailed
  | BillingAccountCancelled
  | ProvisioningCompleted
  | ProvisioningFailed
  | ActivationCompleted
  | ActivationFailed;


///Este archivo define cómo deben estar formados los eventos del sistema de activación:
//  qué tipos de eventos existen y qué datos debe llevar cada uno. TypeScript usa estas definiciones para detectar errores,
//  pero el archivo no ejecuta acciones por sí mismo.