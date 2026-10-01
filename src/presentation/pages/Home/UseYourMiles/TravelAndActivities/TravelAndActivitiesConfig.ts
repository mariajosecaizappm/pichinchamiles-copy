export const ACTIVITY_KEYS = ["vuelos", "hoteles", "autos", "actividades", "disney"] as const

export type ActivityKey = typeof ACTIVITY_KEYS[number]
