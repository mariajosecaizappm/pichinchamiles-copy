"use client"

import { RefObject } from "react"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberType } from "@/domain/entity/Member/member"
import { FormRef } from "@/presentation/components/Form/context/Form"
import BillingFormContainer from "@/presentation/forms/BillingForm/BillingFormContainer"
import { LIMIT_MASKED_IDENTIFICATION, maskedData } from "@/presentation/helpers/member"

type ShoppingCartBillingProps = {
    billingAddress: Address
    memberType: MemberType
    billingFormRef: RefObject<FormRef | null>
    onSubmitBilling: (address: Address) => void
}

const CheckoutBilling = ({
    billingAddress,
    memberType,
    billingFormRef,
    onSubmitBilling,
}: ShoppingCartBillingProps) => {
    const fullName =
        memberType === MemberType.CORPORATE
            ? billingAddress.companyName ?? ""
            : `${billingAddress.customerReceivingFirstName} ${billingAddress.customerReceivingLastName}`.trim()

    const maskedDocument = maskedData(
        billingAddress.customerReceivingIdentificationNumber,
        0,
        LIMIT_MASKED_IDENTIFICATION,
    )

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-[28px] font-semibold leading-[34px] text-blue-500 md:text-[32px] md:leading-[38px]">
                    Datos de facturación
                </h1>
                <p className="mt-1 text-base font-semibold leading-6 text-grayscale-500 md:text-lg">
                    Verifique que los datos de los productos elegidos tengan una facturación correcta.
                </p>
            </div>

            <div className="rounded-lg border border-grayscale-300 bg-white p-4 md:p-6">
                <BillingFormContainer
                    ref={billingFormRef}
                    billingAddress={billingAddress}
                    fullName={fullName}
                    maskedDocument={maskedDocument}
                    onSubmit={onSubmitBilling}
                />
            </div>
        </div>
    )
}

export default CheckoutBilling
