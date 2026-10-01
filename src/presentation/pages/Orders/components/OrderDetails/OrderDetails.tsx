"use client"

import { Order, OrderLine, ShippingDetail } from "@/domain/entity/Order/order"
import StickyNavWrapper from "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper"
import { BackToOrdersButton, OrderDetailsHeader, OrderProductDetailsCard, OrderProductModal, OrderProductsList, OrderTracking } from "./"

type Props = {
    order: Order
    onPressBack: () => void
    isDesktop: boolean
    selectedShippingKey: string | undefined
    setSelectedShippingKey: (shippingKey: string | undefined) => void
    product: OrderLine | undefined
    selectedShipping: ShippingDetail | undefined
}

const OrderDetails = ({ order, onPressBack, isDesktop, selectedShippingKey, setSelectedShippingKey, product, selectedShipping }: Props) => {
    return (
        <>
            <div className="py-4 lg:py-6">
                <div className="">
                    <div className="space-y-4 body-container lg:pb-4">
                        <BackToOrdersButton onPressBack={onPressBack} />
                        <h2 className="text-[22px] leading-7 font-slab text-blue-500">Detalle del pedido</h2>
                    </div>
                    <div className="flex gap-4 lg:body-container">
                        <div className="lg:p-4 lg:rounded-lg lg:bg-darkGrayishBlue-50 h-min flex-1">
                            <StickyNavWrapper className="max-lg:sticky top-23 z-50 max-lg:py-4 bg-white max-lg:body-container">
                                <OrderDetailsHeader order={order} />
                            </StickyNavWrapper>
                            <div className="md:mt-4 max-lg:body-container">
                                <OrderProductsList
                                    order={order}
                                    setSelectedShippingKey={setSelectedShippingKey}
                                    isSelected={(shippingKey) => shippingKey === selectedShippingKey}
                                />
                            </div>
                        </div>
                        <div className="flex-1 hidden lg:flex flex-col gap-6">
                            <OrderProductDetailsCard
                                product={product}
                                order={order}
                                selectedShipping={selectedShipping}
                            />
                            {selectedShipping && <OrderTracking selectedShipping={selectedShipping} />}
                        </div>
                    </div>
                </div>
            </div>
            {
                !isDesktop && (
                    <OrderProductModal
                        order={order}
                        selectedShipping={selectedShipping}
                        product={product}
                        isOpen={selectedShippingKey !== undefined}
                        onClose={() => setSelectedShippingKey(undefined)}
                    />
                )
            }
        </>
    )
}

export default OrderDetails
