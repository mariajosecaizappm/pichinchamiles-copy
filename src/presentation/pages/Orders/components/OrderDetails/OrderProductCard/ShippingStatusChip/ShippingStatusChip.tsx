import { ShippingStatus } from "@/domain/entity/Order/order"
import { StatusChipWrapper } from "@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip"
import { DeliveredIcon, NoveltyIcon, PaidIcon, PendingIcon } from "@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/Icons"
import ErrorIcon from "@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/Icons/ErrorIcon"

const ShippingStatusChip = ({ status }: { status: ShippingStatus }) => {
    const getStatusIcon = () => {
        switch (status) {
        case ShippingStatus.PENDING:
            return (
                <StatusChipWrapper className="border-darkGrayishBlue-300 bg-darkGrayishBlue-100">
                    <PendingIcon />
                    Pendiente
                </StatusChipWrapper>
            )
        case ShippingStatus.ASSIGNED:
            return (
                <StatusChipWrapper className="border-information-200 bg-information-50 text-information-500">
                    <PaidIcon />
                    Asignado
                </StatusChipWrapper>
            )
        case ShippingStatus.WAIT_TO_SEND:
            return (
                <StatusChipWrapper className="border-information-200 bg-information-50 text-information-500">
                    <PaidIcon />
                    Esperando courier
                </StatusChipWrapper>
            )
        case ShippingStatus.ARRIVED_AT_THE_LOCAL:
            return (
                <StatusChipWrapper className="border-information-200 bg-information-50 text-information-500">
                    <PaidIcon />
                    En ruta
                </StatusChipWrapper>
            )
        case ShippingStatus.DELIVERED:
            return (
                <StatusChipWrapper className="bg-success-50 border-success-200 text-success-500">
                    <DeliveredIcon />
                    Entregado
                </StatusChipWrapper>
            )
        case ShippingStatus.NOVELTY:
            return (
                <StatusChipWrapper className="border-warning-200 bg-warning-50 text-warning-500">
                    <NoveltyIcon />
                    Con novedad
                </StatusChipWrapper>
            )
        case ShippingStatus.CANCELED:
            return (
                <StatusChipWrapper className="border-error-200 bg-error-50 text-error-500">
                    <ErrorIcon />
                    Cancelado
                </StatusChipWrapper>
            )
        case ShippingStatus.WITH_DRAWN:
            return (
                <StatusChipWrapper className="border-warning-200 bg-warning-50 text-warning-500">
                    <NoveltyIcon />
                    Devuelto
                </StatusChipWrapper>
            )
        }
    }
    return getStatusIcon()
}
export default ShippingStatusChip