import { OrderStatus } from "@/domain/entity/Order/order"
import StatusChipWrapper from "./StatusChipWrapper"
import { PendingIcon, NoveltyIcon, PaidIcon, DeliveredIcon } from "./Icons"

type Props = {
    status: OrderStatus
}

const StatusChip = ({ status }: Props) => {
    const getStatusIcon = () => {
        switch (status) {
        case OrderStatus.CREATED:
        case OrderStatus.PAY_PENDING:
        case OrderStatus.APPROVED:
        case OrderStatus.PENDING:
            return (
                <StatusChipWrapper className="border-darkGrayishBlue-300 bg-darkGrayishBlue-100">
                    <PendingIcon />
                    Pendiente
                </StatusChipWrapper>
            )
        case OrderStatus.CANCELED:
        case OrderStatus.REJECTED:
        case OrderStatus.NOVELTY:
            return (
                <StatusChipWrapper className="border-warning-200 bg-warning-50 text-warning-500">
                    <NoveltyIcon />
                    Con novedad
                </StatusChipWrapper>
            )
        case OrderStatus.PAID:
            return (
                <StatusChipWrapper className="border-information-200 bg-information-50 text-information-500">
                    <PaidIcon />
                    Por entregar
                </StatusChipWrapper>
            )
        case OrderStatus.DELIVERED:
            return (
                <StatusChipWrapper className="bg-success-50 border-success-200 text-success-500">
                    <DeliveredIcon />
                    Entregado
                </StatusChipWrapper>
            )
        default:
            return (
                <span className="flex gap-1 items-center rounded-2xl border border-darkGrayishBlue-300 bg-darkGrayishBlue-100">
                    <PendingIcon />
                    Pendiente
                </span>
            )
        }
    }
    return (
        <span>
            {getStatusIcon()}
        </span>
    )
}

export default StatusChip