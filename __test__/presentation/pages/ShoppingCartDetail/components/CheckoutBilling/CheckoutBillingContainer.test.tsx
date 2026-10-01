import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberType } from "@/domain/entity/Member/member"
import CheckoutBillingContainer from "@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling/CheckoutBillingContainer"

const mockUseCheckout = vi.fn()
const mockUseSession = vi.fn()

const mocks = vi.hoisted(() => ({
    lastCheckoutBillingProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useCheckout", () => ({
    default: () => mockUseCheckout(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling/CheckoutBilling", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastCheckoutBillingProps = props
        return <div data-testid="checkout-billing" />
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

const createCheckoutState = (overrides: Record<string, unknown> = {}) => ({
    step: 3,
    onNextStep: vi.fn(),
    onPrevStep: vi.fn(),
    shippingAddress: null,
    selectShippingAddress: vi.fn(),
    billingAddress,
    selectBillingAddress: vi.fn(),
    billingFormRef: createRef(),
    ...overrides,
})

describe("CheckoutBillingContainer", () => {
    it("when step is not 3 should render nothing", () => {
        mockUseCheckout.mockReturnValue(createCheckoutState({ step: 2 }))
        mockUseSession.mockReturnValue({
            member: { memberType: MemberType.PERSONAL },
        })

        const { container } = render(<CheckoutBillingContainer />)

        expect(container).toBeEmptyDOMElement()
    })

    it("when member is missing should render nothing", () => {
        mockUseCheckout.mockReturnValue(createCheckoutState())
        mockUseSession.mockReturnValue({ member: null })

        const { container } = render(<CheckoutBillingContainer />)

        expect(container).toBeEmptyDOMElement()
    })

    it("when billing address is missing should render nothing", () => {
        mockUseCheckout.mockReturnValue(createCheckoutState({ billingAddress: null }))
        mockUseSession.mockReturnValue({
            member: { memberType: MemberType.PERSONAL },
        })

        const { container } = render(<CheckoutBillingContainer />)

        expect(container).toBeEmptyDOMElement()
    })

    it("when checkout state is valid should render billing component with mapped props", () => {
        const checkoutState = createCheckoutState()
        mockUseCheckout.mockReturnValue(checkoutState)
        mockUseSession.mockReturnValue({
            member: { memberType: MemberType.PERSONAL },
        })

        render(<CheckoutBillingContainer />)

        expect(screen.getByTestId("checkout-billing")).toBeInTheDocument()
        expect(mocks.lastCheckoutBillingProps).toEqual(
            expect.objectContaining({
                billingAddress,
                memberType: MemberType.PERSONAL,
                billingFormRef: checkoutState.billingFormRef,
            })
        )
    })

    it("when billing form submits should update address, advance step and scroll to top", () => {
        const onNextStep = vi.fn()
        const selectBillingAddress = vi.fn()
        const scrollTo = vi.fn()

        mockUseCheckout.mockReturnValue(
            createCheckoutState({
                onNextStep,
                selectBillingAddress,
            })
        )
        mockUseSession.mockReturnValue({
            member: { memberType: MemberType.PERSONAL },
        })
        vi.stubGlobal("scrollTo", scrollTo)

        render(<CheckoutBillingContainer />)

        const updatedAddress = { ...billingAddress, street1: "Nueva calle" }
        ;(mocks.lastCheckoutBillingProps?.onSubmitBilling as (address: Address) => void)(
            updatedAddress
        )

        expect(selectBillingAddress).toHaveBeenCalledWith(updatedAddress)
        expect(onNextStep).toHaveBeenCalledTimes(1)
        expect(scrollTo).toHaveBeenCalledWith(0, 0)

        vi.unstubAllGlobals()
    })
})
