import OrdersWrapper from "@/presentation/pages/Orders/OrdersWrapper"

const OrdersLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <OrdersWrapper>
            {children}
        </OrdersWrapper>
    )
}

export default OrdersLayout