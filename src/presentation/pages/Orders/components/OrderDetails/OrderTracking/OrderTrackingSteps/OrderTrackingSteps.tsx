import { TrackingStepWithEntry } from "../types"
import OrderTrackingItemStep from "./OrderTrackingItemStep"

type Props = {
    getStepsToRender: () => TrackingStepWithEntry[]
}

const OrderTrackingSteps = ({ getStepsToRender }: Props) => {
    const stepsToRender = getStepsToRender()
    return (
        <ol
            className="space-y-1"
        >
            {
                stepsToRender.map(({ step, trackingEntry }, index) => (
                    <OrderTrackingItemStep
                        key={step.status}
                        trackingStep={{ step, trackingEntry }}
                        index={index}
                        totalSteps={stepsToRender.length}
                    />
                ))
            }
        </ol>
    )
}

export default OrderTrackingSteps