import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import { PaymentStatus } from "@/domain/entity/Payment/payment";

export type ChangedBasketItems = {
    changedPriceProducts: BasketItem[];
    changedStockProducts: BasketItem[];
    disabledProducts: BasketItem[];
};

export type ShoppingCartStatusModalType = "redemption" | "payment";

export type OpenShoppingCartStatusModalParams = {
    status: PaymentStatus;
    amount: number;
    type: ShoppingCartStatusModalType;
    reference: string;
    consumptions?: string;
};
