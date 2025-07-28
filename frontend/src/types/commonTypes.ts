export const PAYMENT_METHODS = ['cash', 'card', 'bank_transfer', 'other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];