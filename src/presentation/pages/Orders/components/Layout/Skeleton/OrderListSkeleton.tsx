"use client"

import OrderItemSkeleton from "./OrderItemSkeleton"

const OrderListSkeleton = () => {
    return (
        <div className="space-y-3 flex-1">
            <OrderItemSkeleton />
            <OrderItemSkeleton />
            <OrderItemSkeleton />
            <OrderItemSkeleton />
        </div>
    )
}

export default OrderListSkeleton