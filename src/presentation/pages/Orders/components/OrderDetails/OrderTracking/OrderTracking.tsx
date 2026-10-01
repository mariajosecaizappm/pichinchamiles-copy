import { ShippingDetail, ShippingTracking } from "@/domain/entity/Order/order"
import Alert from "@/presentation/components/Alert"
import { Divider } from "@heroui/react"
import ShippingStatusChip from "../OrderProductCard/ShippingStatusChip"
import { OrderTrackingSteps } from "./OrderTrackingSteps"
import { TrackingStep } from "./types"


type Props = {
    selectedShipping: ShippingDetail | undefined
    hasNoveltyTracking: boolean | undefined
    getStepsToRender: () => { step: TrackingStep; trackingEntry: ShippingTracking | undefined }[]
}

const OrderTracking = ({ selectedShipping, hasNoveltyTracking, getStepsToRender }: Props) => {

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-0.5">
                    <h3 className="font-semibold leading-6">
                        Estado del pedido
                    </h3>
                    {
                        selectedShipping && (
                            <ShippingStatusChip status={selectedShipping?.shippingStatus} />
                        )
                    }
                </div>
                <div className="py-2">
                    <Divider />
                </div>
                <OrderTrackingSteps getStepsToRender={getStepsToRender} />
            </div>
            {
                hasNoveltyTracking && (
                    <Alert variant="warning">
                        Nos comunicaremos contigo para informarte sobre el estado de tu producto. Si aún no has recibido contacto, llámanos al <span className="font-semibold">1800 - BPMILE (276-453).</span>
                    </Alert>
                )
            }
        </div>
    )
}

export default OrderTracking