import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const onCloseAuthModal = vi.fn()
    const getMemberSummary = vi.fn()
    const addressAccordionProps = vi.fn()
    const summaryItemProps = vi.fn()

    return {
        onCloseAuthModal,
        getMemberSummary,
        addressAccordionProps,
        summaryItemProps,
    }
})

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        onCloseAuthModal: mocks.onCloseAuthModal,
    }),
}))

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/getMemberSummary",
    () => ({
        default: mocks.getMemberSummary,
    }),
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/ActivationSummaryItem",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.summaryItemProps(props)
                return (
                    <div data-testid="mock-summary-item">
                        {props.label}:{props.value}
                    </div>
                )
            },
        }
    },
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/AddressAccordion",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.addressAccordionProps(props)
                return <div data-testid="mock-address-accordion" />
            },
        }
    },
)

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({children, onPress, ...rest}: any) => (
        <button type="button" onClick={() => onPress?.()} {...rest}>
            {children as React.ReactNode}
        </button>
    ),
}))

import ActivationSummary from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/ActivationSummary"

describe("ActivationSummary", () => {
    beforeEach(() => {
        mocks.onCloseAuthModal.mockReset()
        mocks.getMemberSummary.mockReset()
        mocks.addressAccordionProps.mockReset()
        mocks.summaryItemProps.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should render member summary items and address accordion", () => {
            const member = {} as any
            mocks.getMemberSummary.mockReturnValueOnce([
                {label: "Nombre", value: "Juan"},
                {label: "Correo", value: "juan@example.com"},
            ])

            render(<ActivationSummary member={member} />)

            expect(
                screen.getByText("Tus datos registrados son:"),
            ).toBeInTheDocument()

            expect(mocks.getMemberSummary).toHaveBeenCalledWith(member)
            expect(screen.getAllByTestId("mock-summary-item")).toHaveLength(2)
            expect(mocks.summaryItemProps).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({label: "Nombre", value: "Juan"}),
            )
            expect(mocks.summaryItemProps).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    label: "Correo",
                    value: "juan@example.com",
                }),
            )

            expect(screen.getByTestId("mock-address-accordion")).toBeInTheDocument()
            expect(mocks.addressAccordionProps).toHaveBeenCalledWith(
                expect.objectContaining({member}),
            )

            expect(
                screen.getByTestId("cotinueActivation"),
            ).toBeInTheDocument()
        })
    })

    describe("when continue is pressed", () => {
        it("should call onCloseAuthModal", () => {
            mocks.getMemberSummary.mockReturnValueOnce([])

            render(<ActivationSummary member={{} as any} />)

            fireEvent.click(screen.getByTestId("cotinueActivation"))

            expect(mocks.onCloseAuthModal).toHaveBeenCalledTimes(1)
        })
    })
})

