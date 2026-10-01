import AssetImage from "@/presentation/components/AssetImage"
import { formatLocationName, formatOrderDateLong, ORDERS_BREAKPOINT } from "../OrderDetailsConfig"
import { Order, OrderLine, ShippingDetail } from "@/domain/entity/Order/order"
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities"
import { Divider } from "@heroui/react"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"

type OrderProductDetailsCardProps = {
    product: OrderLine | undefined
    order: Order
    selectedShipping: ShippingDetail | undefined
}

const OrderProductDetailsCard = ({ product, order, selectedShipping }: OrderProductDetailsCardProps) => {
    const { isDesktop } = useIsDesktop(ORDERS_BREAKPOINT)
    return (
        <div className="border border-darkGrayishBlue-300 py-6 px-2 lg:px-4 rounded-lg flex flex-col gap-2">
            <div className="h-42.5 lg:h-56.5 w-full flex justify-center">
                {
                    product?.image ? (
                        <AssetImage breakpoint={ORDERS_BREAKPOINT} asset={product?.image || { desktopUrl: "", mobileUrl: "" }} alt="map" width={isDesktop ? 
                            306 : 226} height={isDesktop ? 230 : 170} className="w-full h-full object-contain" />
                    ) : null
                }
            </div>
            <div className="py-2">
                <Divider className="max-lg:bg-transparent" />
            </div>
            <div className="space-y-1">
                <p className="text-[#252529] text-sm">
                    Fecha estimada de entrega: {formatOrderDateLong(order.estimatedDeliveredDate)}
                </p>
                <p className="font-semibold leading-5">
                    {product?.productName.replace(",", "")}
                </p>
            </div>
            <div className="py-2">
                <Divider />
            </div>
            <div className="space-y-1">
                {
                    selectedShipping?.guidNumber && (
                        <p className="text-[#252529] text-sm">
                            Número de guía: {selectedShipping.guidNumber}
                        </p>
                    )
                }
                <p className="font-semibold leading-5">
                    {
                        product?.totalCoins && product.totalCoins > 0 ?
                            `Copago: ${formatMiles(product.totalCoins)} millas + $${formatCopaymentAmount(product.totalCoins)}` :
                            `Canje con millas: ${formatMiles(product?.totalPoints || 0)}`
                    }
                </p>
                <div className="py-2">
                    <Divider />
                </div>
            </div>
            <div className="self-stretch justify-center text-[#252529] text-sm leading-5">Dirección: {`${order.shippingAddress?.street1} ${order.shippingAddress?.number} y ${order.shippingAddress?.street2}`}, {order.shippingAddress?.reference}, <span>{formatLocationName(order.shippingAddress?.city)} - {formatLocationName(order.shippingAddress?.country)}</span></div>
        </div>
    )
}

export default OrderProductDetailsCard