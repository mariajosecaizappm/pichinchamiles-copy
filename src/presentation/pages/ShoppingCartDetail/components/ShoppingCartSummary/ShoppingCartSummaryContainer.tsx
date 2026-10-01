"use client";

import {RefObject, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {PaymentStatus} from "@/domain/entity/Payment/payment";
import {FormRef} from "@/presentation/components/Form/context/Form";
import useSession from "@/presentation/hooks/useSession";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";
import useShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartStatusModal";
import {ShoppingCartBasketState} from "../../hooks/useShoppingCartBasket";
import ShoppingCartSummary from "./ShoppingCartSummary";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ProductRedemptionUseCase from "@/domain/interactors/Order/ProductRedemptionUseCase";
import useOtp from "@/presentation/hooks/useOtp";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import {MemberType} from "@/domain/entity/Member/member";
import {ProductOrderProcessed} from "@/domain/entity/Order/order";
import links from "@/presentation/config/links";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

declare global {
    interface Window {
        P?: {
        init: (url: string, handler?: unknown) => void
        on: (event: "response", callback: () => void) => unknown
        }
    }
}

type ShoppingCartSummaryContainerProps = {
    basketState: ShoppingCartBasketState;
    pendingReference: string;
    billingFormRef: RefObject<FormRef | null>;
};

const ShoppingCartSummaryContainer = ({basketState, pendingReference, billingFormRef}: ShoppingCartSummaryContainerProps) => {
    const productRedemptionUseCase = container.get<ProductRedemptionUseCase>(UseCaseTypes.ProductRedemptionUseCase);
    const router = useRouter();
    const { balance, basket, member, clearBasket, updateBalance } = useSession();
    const { openShoppingCartStatusModal } = useShoppingCartStatusModal();
    const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] = useState(false);
    const [acceptedLopd, setAcceptedLopd] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const { track } = useAnalytics();
    const {
        step,
        onNextStep,
        onPrevStep,
        resetCheckout,
        shippingAddress,
        billingAddress,
        sessionId,
        orders
    } = useCheckout();
    const {
        items,
        pointsAmountTotal,
        copaymentSubtotal,
        copaymentTaxes,
        copaymentTotal,
        hasCopayment,
        hasDisabledProducts,
        isLoading,
        isVerifying,
        verifyShoppingCart,
    } = basketState;

    const showMinPointsAlert = pointsAmountTotal > balance;
    const missingMiles = Math.max(0, pointsAmountTotal - balance);
    const itemsQuantity = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    );
    const itemsLabel = itemsQuantity === 1 ? "1 item" : `${itemsQuantity} items`;
    const processedOrderRef = useRef<ProductOrderProcessed | null>(null);

    const resetOrderFlowState = () => {
        processedOrderRef.current = null;
    };

    const clearCheckoutAfterOrderProcessed = () => {
        setAcceptedTermsAndConditions(false);
        setAcceptedLopd(false);
        resetCheckout();
        clearBasket();
    };

    const openRedemptionSuccessModal = async (order: ProductOrderProcessed) => {
        openShoppingCartStatusModal({
            status: PaymentStatus.SUCCESS,
            type: "redemption",
            reference: order.paymentGatewayReference,
            amount: pointsAmountTotal,
            consumptions: (orders?.pagination.total ?? 0).toString()
        });
        track(EventName.VIEWED_REDEEM_STATUS, { reference: "" })
        clearCheckoutAfterOrderProcessed();
    };

    const handlePlaceToPayRedirection = (orderProcessed: ProductOrderProcessed) => {
        const goToShoppingCart = () => {
            router.push(`${links.checkout}?reference=${orderProcessed.paymentGatewayReference}`);
            clearCheckoutAfterOrderProcessed();
        };

        if (!window.P) {
            return;
        }

        window.P.init(orderProcessed.placeToPayUrl,
            window.P.on('response', () => goToShoppingCart())
        );

        const closeButtonIFrame = document.getElementById("close-frame");
        closeButtonIFrame?.addEventListener("click", () => goToShoppingCart());
    };

    const processOrder = async (mfaRequest?: MfaRequest) => {
        if (!shippingAddress || !billingAddress || !basket || !member) {
            return null;
        }

        setIsSubmittingOrder(true);

        try {
            const processedOrder = await productRedemptionUseCase.productRedemption({
                mfaRequest,
                shippingAddress,
                billingAddress,
                basket,
                customer: {
                    firstName: member.memberType === MemberType.CORPORATE ? member.firstNameAdministrator : member.firstName,
                    lastName: member.memberType === MemberType.CORPORATE ? member.firstLastNameAdministrator : member.firstLastName,
                    companyName: member.memberType === MemberType.CORPORATE ? member.companyName : "",
                    email: member.enrollmentEmail,
                    identificationNumber: member.identificationNumber,
                    phone: member.cellPhone,
                    secondPhone: member.cellPhone,
                    identificationType: member.identificationType,
                    city: member.city,
                }
            }, sessionId);
            updateBalance(processedOrder.balanceAfterOperation);
            processedOrderRef.current = processedOrder;
            track(EventName.PURCHASED_PRODUCT, {products: basket.items, reference: processedOrder.paymentGatewayReference});
        } catch {
            openShoppingCartStatusModal({
                status: PaymentStatus.REJECTED,
                type: "redemption",
                amount: pointsAmountTotal,
                reference: ""
            });
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const handleOrderFlowContinue = async () => {
        if(processedOrderRef.current === null){
            await processOrder();
        }
        const processedOrder = processedOrderRef.current;
        if(processedOrder){
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            processedOrder.placeToPayUrl
                ? handlePlaceToPayRedirection(processedOrder)
                : openRedemptionSuccessModal(processedOrder);
        }
    };

    const { withOtp } = useOtp<void>({
        title: "Código de seguridad",
        onRequestOtp: async () => {
            setIsSubmittingOrder(true);
            const otp = await productRedemptionUseCase.getProductOrderOtp()
            setIsSubmittingOrder(false);
            return otp;
        },
        onSubmitOtp: async (mfaRequest) => {
            await processOrder(mfaRequest);
        },
        onContinue: handleOrderFlowContinue,
    });

    const handleContinue = async () => {
        if(step === 1) track(EventName.GO_TO_CHECKOUT_SHIPPING);
        if(step === 2) track(EventName.GO_TO_CHECKOUT_BILLING);
        if(step === 3) track(EventName.GO_TO_CHECKOUT_CONFIRMATION);
        if(step === 4) track(EventName.REDEEM_PRODUCT);

        const isValid = await verifyShoppingCart();
        if (!isValid) return;

        if (step === 3) {
            billingFormRef.current?.submitForm();
        } else if (step === 4) {
            resetOrderFlowState();
            await withOtp();
        } else {
            onNextStep();
        }
    };

    const handleBack = () => {
        if (step === 1) {
            router.push(links.productsList);
            return;
        }
        onPrevStep();
    };

    const isStep2ContinueDisabled = step === 2 && shippingAddress === null;
    const isBusy = isLoading || isVerifying || isSubmittingOrder;
    const backLabel = step === 1 ? "Regresar al catálogo" : "Regresar";
    const continueDisabled =
        isBusy ||
        showMinPointsAlert ||
        hasDisabledProducts ||
        isStep2ContinueDisabled ||
        isSubmittingOrder ||
        (!(acceptedTermsAndConditions && acceptedLopd) && hasCopayment && step === 4);

    return (
        <ShoppingCartSummary
            pointsAmountTotal={pointsAmountTotal}
            itemsLabel={itemsLabel}
            showMinPointsAlert={showMinPointsAlert}
            missingMiles={missingMiles}
            hasCopayment={hasCopayment}
            copaymentSubtotal={copaymentSubtotal}
            copaymentTaxes={copaymentTaxes}
            copaymentTotal={copaymentTotal}
            pendingReference={pendingReference}
            acceptedTermsAndConditions={acceptedTermsAndConditions}
            acceptedLopd={acceptedLopd}
            onChangeAcceptedTermsAndConditions={setAcceptedTermsAndConditions}
            onChangeAcceptedLopd={setAcceptedLopd}
            onContinue={handleContinue}
            onBack={handleBack}
            continueDisabled={continueDisabled}
            backDisabled={isBusy}
            isVerifying={isVerifying || isSubmittingOrder}
            backLabel={backLabel}
            step={step}
        />
    );
};

export default ShoppingCartSummaryContainer;
