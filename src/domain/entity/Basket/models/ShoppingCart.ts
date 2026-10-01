import { AddedBasketItem, Basket, BasketItem, BasketProduct } from "@/domain/entity/Basket/structure/basket";
import { PaymentMethod } from "@/domain/entity/Payment/payment";

export default class ShoppingCart {
    private readonly basket: Basket

    constructor(basket: Basket | null) {
        this.basket = basket ? JSON.parse(JSON.stringify(basket)) : {
            buyerId: "",
            items: []
        };
    }

    isAddedProduct(variationId: string, paymentMethod: PaymentMethod): boolean {
        return this.basket
            ? this.basket.items.some(
                item => item.variationId === variationId && item.paymentMethod === paymentMethod
            )
            : false;
    }

    static updateBasketItem(newBasketItem: AddedBasketItem, basket: Basket): Basket {
        return {
            ...basket,
            items: basket.items.map(basketItem => {
                const newPaymentMethod = newBasketItem.coinsTotal
                    ? PaymentMethod.COPAYMENT
                    : PaymentMethod.POINTS;

                if (
                    basketItem.variationId !== newBasketItem.variation.id ||
                    newPaymentMethod !== basketItem.paymentMethod
                ) {
                    return basketItem;
                }

                const { points, coin } = basketItem.paymentTypes;
                const { coinsTotal, pointsTotal, quantity } = newBasketItem;

                const paymentTypes: BasketItem['paymentTypes'] = { points };

                if (basketItem.paymentMethod === PaymentMethod.POINTS) {
                    paymentTypes.points = {
                        currencyId: points.currencyId,
                        amount: points.amount + pointsTotal,
                    };
                }

                if (coin && coinsTotal) {
                    paymentTypes.coin = {
                        currencyId: coin.currencyId,
                        amount: parseFloat((coin.amount + coinsTotal).toFixed(2)),
                    };
                    paymentTypes.points = {
                        currencyId: points.currencyId,
                        amount: points.amount + pointsTotal,
                    };
                }

                return {
                    ...basketItem,
                    paymentTypes,
                    quantity: basketItem.quantity + quantity,
                };
            }),
        };
    }

    public addProduct(basketProduct: BasketProduct): Basket {
        const existingItem = this.basket?.items.find((item) =>
            item.variationId === basketProduct.variation.id
            && item.paymentMethod === basketProduct.paymentType
        );

        if (existingItem) {
            existingItem.quantity += basketProduct.quantity;
            existingItem.paymentTypes.points.amount += basketProduct.points;

            if (existingItem.paymentTypes.coin) {
                existingItem.paymentTypes.coin.amount += basketProduct.coins;
            } else if (basketProduct.coins > 0) {
                existingItem.paymentTypes.coin = {
                    currencyId: basketProduct.coinsCurrencyId,
                    amount: basketProduct.coins
                };
            }
        } else {
            const newItem: BasketItem = {
                id: this.generateId(),
                storeId: basketProduct.product.store.id,
                supplierId: basketProduct.product.supplierId,
                productId: basketProduct.product.id,
                variationId: basketProduct.variation.id,
                categoryId: basketProduct.product.categories[0]?.id || "",
                quantity: basketProduct.quantity,
                brandName: basketProduct.product.brand.name,
                categoryName: basketProduct.product.categories[0]?.name || "",
                queryId: basketProduct.product.searchEngine.queryID || "",
                paymentMethod: basketProduct.paymentType as PaymentMethod,
                comments: "",
                productType: basketProduct.product.productType,
                description: basketProduct.product.description,
                slug: basketProduct.product.slug,
                isAvailability: true,
                variationInfo: {
                    productName: basketProduct.product.name,
                    productSlug: basketProduct.product.slug,
                    stock: basketProduct.variation.stock,
                    price: basketProduct.variation.price,
                    pointsPrice: basketProduct.variation.pointsPrice,
                    taxes: basketProduct.variation.taxes,
                    copayment: basketProduct.variation.copayment,
                    assets: basketProduct.variation.assets.map(({ id, ...asset }) => asset),
                    features: basketProduct.variation.features
                },
                paymentTypes: {
                    points: {
                        currencyId: basketProduct.pointsCurrencyId,
                        amount: basketProduct.points
                    },
                    coin: basketProduct.coins > 0 ? {
                        currencyId: basketProduct.coinsCurrencyId,
                        amount: basketProduct.coins
                    } : undefined
                }
            };
            this.basket.items.push(newItem);
        }

        return this.basket;
    }

    private generateId(): string {
        return crypto.randomUUID()
    }
}
