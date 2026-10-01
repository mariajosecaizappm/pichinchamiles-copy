import { Order, OrderLine, ShippingDetail } from "@/domain/entity/Order/order"
import Icon from "@/presentation/components/icons/Icon"
import Modal from "@/presentation/components/Modal"
import OrderProductDetailsCard from "../OrderProductDetailsCard"
import OrderTracking from "../OrderTracking"

type OrderProductModalProps = {
    order: Order
    selectedShipping: ShippingDetail | undefined
    product: OrderLine | undefined
    isOpen: boolean
    onClose: () => void
}

const OrderProductModal = ({ order, selectedShipping, product, isOpen, onClose }: OrderProductModalProps) => {
    return (
        <Modal
            headerButton={
                <div className="flex h-full items-center p-1 pb-0.5 gap-2">
                    <button
                        className="p-4"
                        data-testid="backStepModal"
                        type="button"
                        onClick={onClose}
                        aria-label="Regresar"
                    >
                        <Icon name="icon-back" />
                    </button>
                    <div className="flex-1 text-center">
                        <p className="font-sans text-blue-500 font-semibold leading-6">Detalle de pedido</p>
                    </div>
                    <div className="w-14"></div>
                </div>
            }
            hideCloseButton={true}
            classNames={{
                wrapper: "md:!p-0",
                base: "md:!rounded-none md:h-[100%]! md:max-h-[100%]! md:max-w-full! md:w-full!",
                header: "p-0",
                body: "p-0"
            }}
            isOpen={isOpen}
            onClose={onClose}>
            <div>
                <div className="p-6">
                    <OrderProductDetailsCard product={product} order={order} selectedShipping={selectedShipping} />
                </div>
                <div className="p-6 flex flex-col space-y-2">
                    {
                        selectedShipping && (
                            <OrderTracking selectedShipping={selectedShipping} />
                        )
                    }
                </div>
            </div>
        </Modal>
    )
}

export default OrderProductModal