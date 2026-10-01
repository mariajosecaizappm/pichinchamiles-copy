import { ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order"
import { TrackingStep } from "./OrderTracking/types"

export const ORDERS_BREAKPOINT = 1000

export const getShippingKey = (shipping: ShippingDetail, index: number) =>
    `${JSON.stringify(shipping.orderLines[0])}-${index}`

export const formatOrderDate = (date?: Date | null) =>
    date?.toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const formatOrderDateLong = (date?: Date | null) =>
    date?.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })



export const formatLocationName = (value?: string) =>
    value
        ? value
            .toLowerCase()
            .split(" ")
            .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
            .join(" ")
        : ""


export const baseTrackingSteps: TrackingStep[] = [
    { status: ShippingStatus.ASSIGNED, label: "Asignado" },
    { status: ShippingStatus.WAIT_TO_SEND, label: "Esperando courier" },
    { status: ShippingStatus.ARRIVED_AT_THE_LOCAL, label: "En ruta" },
    { status: ShippingStatus.DELIVERED, label: "Entregado" },
]
        
export const noveltyStep = { status: ShippingStatus.NOVELTY, label: "Con novedad" }