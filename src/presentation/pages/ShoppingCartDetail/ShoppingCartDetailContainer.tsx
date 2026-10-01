"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetPaymentStatusUseCase from "@/domain/interactors/Payment/GetPaymentStatusUseCase";
import useSession from "@/presentation/hooks/useSession";
import ShoppingCartDetail from "./ShoppingCartDetail";
import CheckoutProvider from "@/presentation/pages/ShoppingCartDetail/context/CheckoutProvider";
import CheckoutPaymentStatus from "@/presentation/pages/ShoppingCartDetail/components/CheckoutPaymentStatus";

const getPaymentStatusUseCase = container.get<GetPaymentStatusUseCase>(UseCaseTypes.GetPaymentStatusUseCase);

const ShoppingCartDetailContainer = () => {
    const router = useRouter();
    const { basket, updateBasket, isLogged, isValidatingSession } = useSession();
    const [hasLoadedBasket, setHasLoadedBasket] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState("");

    const hasSession = useMemo(
        () => isLogged && !isValidatingSession,
        [isLogged, isValidatingSession]
    );

    useEffect(() => {
        if (!isValidatingSession && !isLogged) {
            router.replace("/");
        }
    }, [isLogged, isValidatingSession, router]);

    useEffect(() => {
        if (!hasSession) return;

        let cancelled = false;

        const loadBasket = async () => {
            try {
                const shoppingCartValues = await getPaymentStatusUseCase.getShoppingCartValues();
                if (!cancelled) {
                    updateBasket(shoppingCartValues.basket);
                    setPendingTransaction(shoppingCartValues.pendingTransaction);
                }
            } finally {
                if (!cancelled) {
                    setHasLoadedBasket(true);
                }
            }
        };

        void loadBasket();

        return () => {
            cancelled = true;
        };
    }, [hasSession, updateBasket]);

    if (!hasSession || !hasLoadedBasket) {
        return (
            <main className="mx-auto w-full max-w-[1366px] px-[47px] py-6">
                <div className="h-[220px] animate-pulse rounded-lg border border-grayscale-100 bg-darkGrayishBlue-100" />
            </main>
        );
    }

    return (
        <CheckoutProvider>
            <ShoppingCartDetail
                basket={basket ?? { buyerId: "", items: [] }}
                pendingReference={pendingTransaction}
            />
            <CheckoutPaymentStatus/>
        </CheckoutProvider>
    );
};

export default ShoppingCartDetailContainer;
