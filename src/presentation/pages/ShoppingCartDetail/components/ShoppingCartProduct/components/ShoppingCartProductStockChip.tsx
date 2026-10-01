type ShoppingCartProductStockChipProps = {
    stock: number;
};

const ShoppingCartProductStockChip = ({ stock }: ShoppingCartProductStockChipProps) => (
    <span className="inline-flex h-8 min-w-[65px] items-center justify-center rounded-full border border-darkGrayishBlue-400 bg-darkGrayishBlue-100 px-2 text-sm font-medium leading-5 text-grayscale-500">
        {stock > 0 ? `${stock} en stock` : "No disponible"}
    </span>
);

export default ShoppingCartProductStockChip;
