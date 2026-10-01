import { ShippingStatus, ShippingTracking } from "@/domain/entity/Order/order"

export type TrackingStep = {
    status: ShippingStatus
    label: string
}

export type TrackingStepWithEntry = {
    step: TrackingStep
    trackingEntry: ShippingTracking | undefined
}
