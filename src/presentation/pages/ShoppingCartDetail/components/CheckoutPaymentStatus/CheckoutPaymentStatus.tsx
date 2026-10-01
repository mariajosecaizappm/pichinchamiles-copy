"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetPaymentStatusUseCase from "@/domain/interactors/Payment/GetPaymentStatusUseCase";
import useShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartStatusModal";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import {PaymentStatus} from "@/domain/entity/Payment/payment";

const CheckoutPaymentStatus = () => {
    const searchParams = useSearchParams();
    const { openShoppingCartStatusModal } = useShoppingCartStatusModal();
    const { track } = useAnalytics()
    const lastHandledReferenceRef = useRef<string | null>(null);
    const getPaymentStatusUseCase = useMemo(
        () => container.get<GetPaymentStatusUseCase>(UseCaseTypes.GetPaymentStatusUseCase),
        []
    );

    const reference = searchParams.get("reference");
    const { data: paymentDetail, isLoading } = useQuery({
        queryKey: ["payment-status", reference],
        queryFn: () => getPaymentStatusUseCase.getPaymentDetail(reference as string),
        enabled: !!reference,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!reference || !paymentDetail || lastHandledReferenceRef.current === reference) {
            return;
        }

        lastHandledReferenceRef.current = reference;
        openShoppingCartStatusModal({
            status: paymentDetail.status,
            amount: paymentDetail.totalAmount,
            type: "payment",
            reference: paymentDetail.reference,
        });

        if(paymentDetail.status !== PaymentStatus.REJECTED){
            track(EventName.VIEWED_REDEEM_STATUS, {reference: reference});
        }
    }, [openShoppingCartStatusModal, paymentDetail, reference]);

    if (!reference || !isLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(74,74,80,0.8)]">
            <Spinner
                size="lg"
                variant="simple"
                aria-label="Consultando estado del pago"
                classNames={{
                    wrapper: "text-white",
                }}
            />
        </div>
    );
};

export default CheckoutPaymentStatus;
