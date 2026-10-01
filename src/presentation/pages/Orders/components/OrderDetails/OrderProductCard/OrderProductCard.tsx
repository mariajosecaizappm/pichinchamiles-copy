import { Order, OrderLine, ShippingDetail } from "@/domain/entity/Order/order"
import AssetImage from "@/presentation/components/AssetImage"
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities"
import { formatOrderDate, ORDERS_BREAKPOINT } from "../OrderDetailsConfig"
import ShippingStatusChip from "./ShippingStatusChip"

type Props = {
    order: Order
    shipping: ShippingDetail
    orderProduct: OrderLine
    selected?: boolean
    onSelectOrderProduct?: (orderLine: OrderLine) => void
}

const OrderProductCard = ({ order, shipping, orderProduct, selected = false, onSelectOrderProduct }: Props) => {
    return (
        <button
            type="button"
            data-selected={selected}
            className={"flex lg:data-[selected=true]:bg-darkGrayishBlue-100 rounded-lg cursor-pointer"}
            onClick={() => onSelectOrderProduct?.(orderProduct)}
        >
            <div className="w-35 h-37.5 p-2">
                <AssetImage
                    breakpoint={ORDERS_BREAKPOINT}
                    asset={orderProduct.image}
                    alt={orderProduct.productName}
                    width={140}
                    height={150}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="py-2 px-1 flex flex-col justify-center items-start gap-1 flex-1 self-stretch lg:px-3">
                <div className="flex w-full text-left">
                    <div className="lg:min-w-50 lg:max-w-50" >
                        <h3 className="text-blue-500 text-xs lg:text-sm font-medium">{orderProduct?.productName.replace(",", "")}</h3>
                    </div>
                    <div className="hidden lg:block w-full">
                        <p className="text-sm font-semibold whitespace-nowrap w-full hidden lg:block text-right text-blue-500">
                            {formatMiles(orderProduct.totalPoints)} Millas {orderProduct.totalCoins > 0 ? `+ $${formatCopaymentAmount(orderProduct.totalCoins)}` : ''}
                        </p>
                    </div>
                </div>
              
                <div className="flex items-center justify-between w-full">
                    <p className="text-xs font-medium leading-4 text-grayscale-400 text-left">Fecha estimada de entrega: <br/> {formatOrderDate(order.estimatedDeliveredDate)}</p>
                    <div className="hidden lg:block">
                        <ShippingStatusChip status={shipping.shippingStatus} />
                    </div>
                </div>
                <p className="text-sm font-semibold whitespace-nowrap w-full lg:hidden  text-left text-blue-500">
                    {formatMiles(orderProduct.totalPoints)} Millas {orderProduct.totalCoins > 0 ? `+ $${formatCopaymentAmount(orderProduct.totalCoins)}` : ''}
                </p>
                <div className="lg:hidden">
                    <ShippingStatusChip status={shipping.shippingStatus} />
                </div>
            </div>
            <div className="hidden lg:flex items-center">
                <div className="w-6 h-6 text-helper-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8.58997 16.59L13.17 12L8.58997 7.41L9.99997 6L16 12L9.99997 18L8.58997 16.59Z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </button>
    )
}

export default OrderProductCard