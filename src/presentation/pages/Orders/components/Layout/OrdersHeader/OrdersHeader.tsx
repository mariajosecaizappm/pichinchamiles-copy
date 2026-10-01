const OrdersHeader = () => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-[22px] leading-7 font-slab text-blue-500">
                Mis pedidos
            </h1>
            <p className="font-slab leading-5">
                Cada pedido puede incluir uno o más productos canjeados con tus millas.
            </p>
        </div>
    )
}

export default OrdersHeader