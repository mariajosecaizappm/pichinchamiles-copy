"use client";

import { Basket } from "@/domain/entity/Basket/structure/basket";
import EmptyShoppingCart from "./components/EmptyShoppingCart";
import ShoppingCartSummary from "./components/ShoppingCartSummary";
import ShoppingCartStepper from "./components/ShoppingCartStepper";
import ShoppingCartProductModal from "./components/ShoppingCartProductModal/ShoppingCartProductModal";
import { useShoppingCartBasket } from "./hooks/useShoppingCartBasket";
import CheckoutConfirmation from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";
import CheckoutShipping from "@/presentation/pages/ShoppingCartDetail/components/CheckoutShipping";
import CheckoutBilling from "@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling";
import CheckoutProducts from "@/presentation/pages/ShoppingCartDetail/components/CheckoutProducts";

type ShoppingCartDetailProps = {
    basket: Basket;
    pendingReference: string;
};

const ShoppingCartDetail = ({ basket, pendingReference }: ShoppingCartDetailProps) => {
    const { step, billingFormRef } = useCheckout();
    const normalizedBasket: Basket = {
        ...basket,
        items: basket.items ?? [],
    };
    const hasItems = normalizedBasket.items.length > 0;
    const basketState = useShoppingCartBasket(normalizedBasket);

    if (!hasItems) {
        return (
            <main className="mx-auto w-full max-w-[1366px] px-6 pb-7 pt-6 lg:px-[47px]">
                <EmptyShoppingCart />
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1366px] px-6 pb-7 pt-6 lg:px-[47px]">
            <div className="flex flex-col gap-4 lg:gap-6">
                <ShoppingCartStepper currentStep={step} />

                <ShoppingCartProductModal basketState={basketState} />
                <div className="flex w-full flex-col rounded-lg bg-white xl:grid xl:grid-cols-[minmax(0,756fr)_minmax(0,516fr)]">
                    <section className="flex min-w-0 w-full flex-col gap-4 pt-4">
                        {step === 1 && (
                            <CheckoutProducts basketState={basketState}/>
                        )}
                        <CheckoutShipping />
                        <CheckoutBilling/>
                        <CheckoutConfirmation />
                    </section>

                    <div className="min-w-0 w-full">
                        <ShoppingCartSummary
                            basketState={basketState}
                            pendingReference={pendingReference}
                            billingFormRef={billingFormRef}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ShoppingCartDetail;
