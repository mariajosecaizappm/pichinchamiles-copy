"use client";

import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import { formatMiles } from "@/presentation/helpers/quantities";
import ShoppingCartQuantityField from "../ShoppingCartQuantityField";
import ShoppingCartCopaymentCounter from "../ShoppingCartCopaymentCounter";
import ShoppingCartProductFeatureLine from "./components/ShoppingCartProductFeatureLine";
import ShoppingCartProductImage from "./components/ShoppingCartProductImage";
import ShoppingCartProductStockChip from "./components/ShoppingCartProductStockChip";

type ShoppingCartProductProps = {
    item: BasketItem;
    isLoading: boolean;
    maxQuantity: number;
    onRemoveItem: (basketItemId: string) => Promise<void>;
    onChangeQuantity: (basketItemId: string, quantity: number) => Promise<void>;
    onUpdateBasketItem: (basketItem: BasketItem) => Promise<void>;
};

const ShoppingCartProduct = ({
    item,
    isLoading,
    maxQuantity,
    onRemoveItem,
    onChangeQuantity,
    onUpdateBasketItem,
}: ShoppingCartProductProps) => {
    const stock = item.variationInfo.stock;
    const hasCopayment = Boolean(item.variationInfo.copayment && item.paymentTypes.coin);
    const copayment = item.variationInfo.copayment;
    const milesLabel = `${formatMiles(item.paymentTypes?.points?.amount ?? 0)} millas`;
    const catalogMilesLabel = `${formatMiles(item.variationInfo.pointsPrice * item.quantity)} millas`;

    return (
        <article className="flex w-full flex-col gap-3 rounded-lg border border-grayscale-300 p-3 lg:p-4 lg:flex-row lg:items-start lg:gap-3">
            <ShoppingCartProductImage item={item} />

            <div className="flex w-full flex-col gap-5  lg:min-w-0 lg:flex-1 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                <div className="flex flex-col gap-1 lg:w-[337px] lg:gap-3 pb-5 lg:pb-0 border-b border-darkGrayishBlue-300 lg:border-b-0">
                    <h3 className="text-base font-medium leading-6 text-blue-500">
                        {item.variationInfo.productName}
                    </h3>
                    <p className="text-sm font-medium leading-5 text-grayscale-400">{item.brandName}</p>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-0">
                            {(item.variationInfo.features ?? []).map(feature => (
                                <ShoppingCartProductFeatureLine
                                    key={`${feature.name}-${feature.option}`}
                                    feature={feature}
                                />
                            ))}
                        </div>
                        <div className="shrink-0 lg:hidden">
                            <ShoppingCartProductStockChip stock={stock} />
                        </div>
                    </div>
                    {hasCopayment && copayment && (
                        <div className="flex w-full flex-col gap-2 lg:gap-4 sm:flex-row">
                            <ShoppingCartCopaymentCounter
                                type={CurrencyType.POINTS}
                                copayment={copayment}
                                basketItem={item}
                                disabled={isLoading}
                                onUpdateBasketItem={onUpdateBasketItem}
                            />
                            <ShoppingCartCopaymentCounter
                                type={CurrencyType.COINS}
                                copayment={copayment}
                                basketItem={item}
                                disabled={isLoading}
                                onUpdateBasketItem={onUpdateBasketItem}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full lg:hidden">
                    <div className="flex w-full items-center justify-between gap-6">
                        <ShoppingCartQuantityField
                            value={item.quantity}
                            max={maxQuantity}
                            disabled={isLoading}
                            onRemove={() => onRemoveItem(item.id)}
                            onDecrease={() => onChangeQuantity(item.id, item.quantity - 1)}
                            onIncrease={() => onChangeQuantity(item.id, item.quantity + 1)}
                        />
                        <p className="text-xl font-semibold leading-6 text-blue-500">
                            {hasCopayment ? catalogMilesLabel : milesLabel}
                        </p>
                    </div>
                </div>

                <div className="hidden shrink-0 flex-col items-end gap-3 lg:flex">
                    <p className="w-full text-right text-xl font-semibold leading-6 text-blue-500">
                        {hasCopayment ? catalogMilesLabel : milesLabel}
                    </p>
                    <ShoppingCartProductStockChip stock={stock} />
                    <ShoppingCartQuantityField
                        value={item.quantity}
                        max={maxQuantity}
                        disabled={isLoading}
                        onRemove={() => onRemoveItem(item.id)}
                        onDecrease={() => onChangeQuantity(item.id, item.quantity - 1)}
                        onIncrease={() => onChangeQuantity(item.id, item.quantity + 1)}
                    />
                </div>


            </div>
        </article>
    );
};

export default ShoppingCartProduct;
