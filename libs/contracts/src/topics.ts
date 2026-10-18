export const TOPICS = {
  ACTIVATION_REQUESTED: 'activation.requested',
  BILLING_EVENTS: 'billing.events',
  PROVISIONING_EVENTS: 'provisioning.events',
  ACTIVATION_EVENTS: 'activation.events',
} as const;

export type TopicName = (typeof TOPICS)[keyof typeof TOPICS];

export const dlqOf = (topic: string): string => `${topic}.dlq`;


//Este archivo centraliza los nombres de los topics de Kafka que usa la aplicación:

//TOPICS guarda los nombres de los topics de activación, facturación y aprovisionamiento. as const hace que TypeScript los trate como valores literales fijos.
//TopicName crea un tipo que solo admite esos nombres. Así se evitan errores al referirse a un topic.
//dlqOf(topic) recibe el nombre de un topic y devuelve el de su cola de mensajes fallidos (DLQ). Por ejemplo, dlqOf('billing.events') devuelve 'billing.events.dlq'.