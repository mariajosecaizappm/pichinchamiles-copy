import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberType } from "@/domain/entity/Member/member"
import CheckoutBilling from "@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling/CheckoutBilling"

const mocks = vi.hoisted(() => ({
    lastBillingFormContainerProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/forms/BillingForm/BillingFormContainer", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastBillingFormContainerProps = props
        return <div data-testid="billing-form" />
    },
}))

const billingAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "y Secundaria",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "123",
    reference: "Frente al parque",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "Juan",
    customerReceivingLastName: "Pérez",
    customerReceivingEmail: "juan@test.com",
    customerReceivingPhone: "0999999999",
    customerReceivingIdentificationNumber: "1234567890",
    customerReceivingIdentificationType: "CI",
    secondPhone: "0991234567",
    postalCode: "170101",
    default: true,
}

describe("CheckoutBilling", () => {
    it("when it renders should show billing content and form", () => {
        render(
            <CheckoutBilling
                billingAddress={billingAddress}
                memberType={MemberType.PERSONAL}
                billingFormRef={createRef()}
                onSubmitBilling={vi.fn()}
            />
        )

        expect(screen.getByText("Datos de facturación")).toBeInTheDocument()
        expect(
            screen.getByText(
                "Verifique que los datos de los productos elegidos tengan una facturación correcta."
            )
        ).toBeInTheDocument()
        expect(screen.getByTestId("billing-form")).toBeInTheDocument()
    })

    it("when member type is personal should pass full name and masked document", () => {
        render(
            <CheckoutBilling
                billingAddress={billingAddress}
                memberType={MemberType.PERSONAL}
                billingFormRef={createRef()}
                onSubmitBilling={vi.fn()}
            />
        )

        expect(mocks.lastBillingFormContainerProps?.fullName).toBe("Juan Pérez")
        expect(mocks.lastBillingFormContainerProps?.maskedDocument).toBe("*******890")
    })

    it("when member type is corporate should pass company name", () => {
        render(
            <CheckoutBilling
                billingAddress={{ ...billingAddress, companyName: "Empresa SA" }}
                memberType={MemberType.CORPORATE}
                billingFormRef={createRef()}
                onSubmitBilling={vi.fn()}
            />
        )

        expect(mocks.lastBillingFormContainerProps?.fullName).toBe("Empresa SA")
    })

    it("when company name is missing should pass an empty string", () => {
        render(
            <CheckoutBilling
                billingAddress={billingAddress}
                memberType={MemberType.CORPORATE}
                billingFormRef={createRef()}
                onSubmitBilling={vi.fn()}
            />
        )

        expect(mocks.lastBillingFormContainerProps?.fullName).toBe("")
    })
})
