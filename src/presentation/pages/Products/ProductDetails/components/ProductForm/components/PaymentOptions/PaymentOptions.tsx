"use client"

import React, { useContext } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import Alert from "@/presentation/components/Alert";
import { Radio } from "@/presentation/components/Form/components/Radio";
import { RadioGroup } from "@heroui/react";
import CopaymentSection from "./CopaymentSection";
import { GET_PAYMENT_OPTIONS } from "./PaymentOptionsConfig";
import PaymentOptionsSkeleton from "./PaymentOptionsSkeleton";
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext";
import { COPAYMENT_PERCENTAGE } from "../../ProductFormConfig";

type Props = {
    basePointsPrice: number;
}


const PaymentOptions = ({ basePointsPrice = 0 }: Props) => {
    const { values, setFieldValue } = useContext(FormContext)
    const { pointsPrice, variation, isLoading } = useProductDetailsContext()
    const quantity = (values.quantity as number) || 1
    const paymentMethod = values.paymentType as PaymentMethod
    const price = (pointsPrice || basePointsPrice) * quantity
    const hasCopayment = !!variation?.copayment

    if (isLoading) {
        return (
            <PaymentOptionsSkeleton />
        )
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2 w-full">
                <p className="text-blue-500 font-semibold">¿Cómo quieres realizar el canje?</p>

                <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setFieldValue("paymentType", value as PaymentMethod)}
                    classNames={{
                        wrapper: "gap-0 w-full",
                    }}
                >
                    {GET_PAYMENT_OPTIONS(price, hasCopayment).map((option) => (
                        <Radio
                            key={option.value}
                            value={option.value}
                            classNames={{
                                base: "w-full max-w-full rounded-lg data-[selected=true]:border-information-500 data-[selected=true]:bg-darkGrayishBlue-100 rounded-sm",
                                labelWrapper: "w-full",
                                label: "font-medium group-data-[selected=true]:font-semibold"
                            }}
                        >
                            {option.label}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
            {
                paymentMethod === PaymentMethod.COPAYMENT && variation?.copayment ? (
                    <>
                        <CopaymentSection
                            productUnitPoinsPrice={pointsPrice || basePointsPrice}
                            productUnitPrice={variation.price}
                            copayment={variation.copayment}
                        />

                        <Alert
                            title="Información"
                            variant="info"
                            icon="ic:round-info"
                            contentClassName="flex-1"
                        >
                            <p>
                                El valor mínimo a pagar con millas es del <span className="font-bold">{COPAYMENT_PERCENTAGE}% del valor del producto.</span>
                            </p>
                        </Alert>
                    </>
                ) : null
            }
        </div>
    );
};

export default PaymentOptions;