import { ShippingDetail, ShippingStatus, ShippingTracking } from "@/domain/entity/Order/order"
import OrderTracking from "./OrderTracking"
import { TrackingStep } from "./types"
import { baseTrackingSteps, noveltyStep } from "../OrderDetailsConfig"

type Props = {
    selectedShipping: ShippingDetail | undefined
}


const OrderTrackingContainer = ({ selectedShipping }: Props) => {
    const hasNoveltyTracking = selectedShipping?.tracking?.some((t) => t.status === ShippingStatus.NOVELTY)
    const getStepsToRender = (): { step: TrackingStep; trackingEntry: ShippingTracking | undefined }[] => {
        const trackingSteps = hasNoveltyTracking ? [...baseTrackingSteps, noveltyStep] : baseTrackingSteps

        const mappedSteps = trackingSteps.map((step) => ({
            step,
            trackingEntry: selectedShipping?.tracking?.find((t) => t.status === step.status),
        }))

        const lastDatedIndex = mappedSteps.reduce(
            (last, { trackingEntry }, index) => (trackingEntry?.trackingDate ? index : last),
            -1
        )

        const visibleSteps = mappedSteps.filter(
            ({ trackingEntry }, index) => !!trackingEntry?.trackingDate || index > lastDatedIndex
        )

        if (selectedShipping?.shippingStatus !== ShippingStatus.NOVELTY) return visibleSteps

        const noveltyIndex = visibleSteps.findIndex(
            ({ step, trackingEntry }) => step.status === ShippingStatus.NOVELTY && trackingEntry
        )

        return noveltyIndex !== -1 ? visibleSteps.slice(0, noveltyIndex + 1) : visibleSteps
    }
    return (
        <OrderTracking
            selectedShipping={selectedShipping}
            hasNoveltyTracking={hasNoveltyTracking}
            getStepsToRender={getStepsToRender}
        />
    )
}

export default OrderTrackingContainer