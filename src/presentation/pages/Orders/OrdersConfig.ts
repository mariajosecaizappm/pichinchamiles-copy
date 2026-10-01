export const PENDING_ORDER_PARAM = "pending-order" as const
export const CONSUMPTIONS_PARAM = "consumptions" as const

export const sanitizeOrderNumber = (value: string) => value.replace(/\D/g, "")
