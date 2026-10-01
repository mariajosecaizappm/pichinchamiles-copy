import { List } from "@/domain/entity/List/list"
import { Order } from "@/domain/entity/Order/order"
import OrderCardItem from "./components/OrderCardItem"
import PendingOrderCardItem from "./components/OrderCardItem/PendingOrderCardItem"

type Props = {
    orders: List<Order>
    isLoadingMore: boolean
    onLoadMore: () => void
    onSelectOrder: (order: Order) => void
    isPendingOrder: boolean
}

const Orders = ({ orders, isLoadingMore, onLoadMore, onSelectOrder, isPendingOrder }: Props) => {
    return (
        <div className="space-y-4 flex-1">
            <div className="space-y-3 md:max-h-[570px] overflow-y-auto">
                {
                    isPendingOrder && <PendingOrderCardItem />

                }
                {
                    orders.data.map((order) => (
                        <OrderCardItem key={order.orderNumber} order={order} onSelectOrder={onSelectOrder} />
                    ))
                }
                {orders.pagination.page < orders.pagination.totalPages && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="text-information-700 hover:underline text-xs cursor-pointer underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isLoadingMore}
                            aria-busy={isLoadingMore}
                            onClick={onLoadMore}
                        >
                            {isLoadingMore ? "Cargando registros..." : "Cargar más registros"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders