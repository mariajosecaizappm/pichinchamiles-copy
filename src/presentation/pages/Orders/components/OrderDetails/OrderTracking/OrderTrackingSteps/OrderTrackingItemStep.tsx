import { ShippingStatus } from "@/domain/entity/Order/order"
import Icon from "@/presentation/components/icons/Icon"
import { cn } from "@heroui/react"
import { TrackingStepWithEntry } from "../types"

type Props = {
    trackingStep: TrackingStepWithEntry
    index: number
    totalSteps: number
}

const OrderTrackingItemStep = ({ trackingStep, index, totalSteps }: Props) => {
    const { step, trackingEntry } = trackingStep
    const isCompleted = !!trackingEntry
    const isNovelty = trackingEntry?.status === ShippingStatus.NOVELTY

    let statusBgClass = 'bg-blue-500'
    if (isCompleted) {
        statusBgClass = isNovelty ? 'bg-warning-500' : 'bg-success-500'
    }

    return (
        <li key={step.status} className="space-y-1">
            <div className="flex items-center gap-3">
                <div
                    className={cn("w-6 h-6 aspect-square rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white",
                        statusBgClass
                    )}
                >
                    {isCompleted ? <Icon name={isNovelty ? "icon-priority-high" : "icon-check"} size={16} /> : index + 1}
                </div>
                <p className="text-sm leading-5">
                    <span className="text-helper-500">
                        {step.label + ": "}
                    </span>
                    {trackingEntry?.trackingDate && (
                        <span className="text-[#252529] font-medium">{trackingEntry.trackingDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    )}
                </p>
            </div>
            {
                index + 1 < totalSteps && (
                    <div className="w-6 h-6 aspect-square flex justify-center">
                        <div className="h-full w-px bg-grayscale-300" />
                    </div>
                )
            }
        </li>
    )
}

export default OrderTrackingItemStep