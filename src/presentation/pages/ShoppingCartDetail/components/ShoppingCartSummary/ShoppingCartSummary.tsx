"use client";

import Button from "@/presentation/components/Form/components/Button/Button";
import Alert from "@/presentation/components/Alert/Alert";
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities";
import ShoppingCartCopaymentAccordion from "../ShoppingCartCopaymentAccordion";
import PendingPaymentAlert from "../PendingPaymentAlert";
import { Checkbox } from "@/presentation/components/Form/components/Checkbox";
import Link from "next/link";
import links from "@/presentation/config/links";
import CheckoutCopaymentBrands from "@/presentation/pages/ShoppingCartDetail/components/CheckoutCopaymentBrands";

type ShoppingCartSummaryProps = {
    pointsAmountTotal: number;
    itemsLabel: string;
    showMinPointsAlert: boolean;
    missingMiles: number;
    hasCopayment: boolean;
    copaymentSubtotal: number;
    copaymentTaxes: number;
    copaymentTotal: number;
    pendingReference: string;
    acceptedTermsAndConditions: boolean;
    acceptedLopd: boolean;
    onChangeAcceptedTermsAndConditions: (checked: boolean) => void;
    onChangeAcceptedLopd: (checked: boolean) => void;
    onContinue: () => void;
    onBack: () => void;
    continueDisabled: boolean;
    backDisabled: boolean;
    isVerifying: boolean;
    backLabel: string;
    step: number
};

const ShoppingCartSummary = ({
    pointsAmountTotal,
    itemsLabel,
    showMinPointsAlert,
    missingMiles,
    hasCopayment,
    copaymentSubtotal,
    copaymentTaxes,
    copaymentTotal,
    pendingReference,
    acceptedTermsAndConditions,
    acceptedLopd,
    onChangeAcceptedTermsAndConditions,
    onChangeAcceptedLopd,
    onContinue,
    onBack,
    continueDisabled,
    backDisabled,
    isVerifying,
    backLabel,
    step
}: ShoppingCartSummaryProps) => {
    return (
        <aside className="flex w-full flex-col gap-4 px-0 py-4 xl:px-5">
            <h2 className="text-[32px] font-semibold leading-[38px] text-blue-500">
                Resumen de compra
            </h2>

            {hasCopayment && (
                <ShoppingCartCopaymentAccordion
                    subtotal={copaymentSubtotal}
                    taxes={copaymentTaxes}
                    total={copaymentTotal}
                />
            )}

            <div className="rounded-sm bg-blue-500 p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                    <span className="text-[22px] font-semibold leading-7">Total</span>
                    <span className="text-right text-[22px] font-semibold leading-7">
                        {formatMiles(pointsAmountTotal)} millas
                    </span>
                </div>
                <div className="mt-1 flex items-start justify-between gap-4">
                    <span className="text-base font-medium leading-6">{itemsLabel}</span>
                    <span className="text-right text-base font-medium leading-6">
                        {hasCopayment
                            ? `+ $${formatCopaymentAmount(copaymentTotal)}`
                            : ""}
                    </span>
                </div>
            </div>

            {showMinPointsAlert && (
                <Alert variant="warning">
                    Te faltan {formatMiles(missingMiles)} millas para completar tu compra.
                </Alert>
            )}
            {hasCopayment && <PendingPaymentAlert pendingReference={pendingReference} />}

            {hasCopayment && step === 4
                && (
                    <div className="flex flex-col gap-1">
                        <Checkbox
                            id="acceptedTermsAndConditions"
                            name="acceptedTermsAndConditions"
                            label={<>Sí acepto los <Link href={links.termsAndConditions} className="underline text-information-500 font-bold" target="_blank">terminos y condiciones</Link></>}
                            checked={acceptedTermsAndConditions}
                            onChange={(e) => onChangeAcceptedTermsAndConditions(e.target.checked)}
                        />
                        <Checkbox
                            id="acceptedLopd"
                            name="acceptedLopd"
                            label={<>Sí autorizo el <Link href={links.lopdDocument} className="underline text-information-500 font-bold" target="_blank">tratamiento de datos personales</Link></>}
                            checked={acceptedLopd}
                            onChange={(e) => onChangeAcceptedLopd(e.target.checked)}
                        />
                    </div>
                )
            }

            <div className="flex flex-col gap-4">
                <Button
                    color="primary"
                    className="h-12"
                    onPress={onContinue}
                    isDisabled={continueDisabled}
                    isLoading={isVerifying}
                >
                    Continuar
                </Button>
                <Button
                    color="secondary"
                    className="h-12 border-blue-500 bg-white"
                    onPress={onBack}
                    isDisabled={backDisabled}
                >
                    {backLabel}
                </Button>
                {hasCopayment && step === 4 && <CheckoutCopaymentBrands/>}
            </div>
        </aside>
    );
};

export default ShoppingCartSummary;
