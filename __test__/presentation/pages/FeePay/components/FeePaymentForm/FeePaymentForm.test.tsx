import React from "react"
import {render, screen, fireEvent, waitFor, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import FeePaymentForm from "@/presentation/pages/FeePay/components/FeePaymentForm/FeePaymentForm"
import links from "@/presentation/config/links"

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    feeCheckboxOnChange: new Map<string, (checked: boolean) => void>(),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
}))

type FeeCheckboxCall = {
    name: string
    hasError: boolean
    checked: boolean
}
const feeCheckboxRenders: FeeCheckboxCall[] = []

vi.mock("@/presentation/pages/FeePay/components/FeePaymentForm/FeeCheckbox", () => ({
    default: ({name, hasError, checked, onChange, label}: any) => {
        feeCheckboxRenders.push({name, hasError, checked})
        mocks.feeCheckboxOnChange.set(name, onChange)
        return (
            <div
                data-testid={`fee-checkbox-${name}`}
                data-has-error={String(hasError)}
                data-checked={String(checked)}
            >
                {label}
                <button
                    type="button"
                    data-testid={`toggle-${name}`}
                    onClick={() => onChange?.(!checked)}
                />
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({color, type, onPress, disabled, isDisabled, children}: any) => {
        const isDisabledVal = isDisabled !== undefined ? isDisabled : disabled
        return (
            <button
                data-testid="fee-pay-button"
                type={type}
                disabled={isDisabledVal}
                onClick={onPress}
            >
                {children}
            </button>
        )
    },
}))

const acceptCheckbox = (name: string, value = true) => {
    const onChange = mocks.feeCheckboxOnChange.get(name)
    if (onChange) {
        act(() => {
            onChange(value)
        })
    }
}

const getLastRenderFor = (name: string): FeeCheckboxCall | undefined => {
    for (let i = feeCheckboxRenders.length - 1; i >= 0; i--) {
        if (feeCheckboxRenders[i].name === name) return feeCheckboxRenders[i]
    }
    return undefined
}

describe("FeePaymentForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.push.mockReset()
        mocks.feeCheckboxOnChange.clear()
        feeCheckboxRenders.length = 0
        // @ts-ignore
        delete window['P']
    })

    it("renders terms and conditions link inside FeeCheckbox label", () => {
        render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

        expect(screen.getByText("términos y condiciones")).toBeInTheDocument()
    })

    it("renders privacy policy link inside FeeCheckbox label", () => {
        render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

        expect(screen.getByText("políticas de protección de datos")).toBeInTheDocument()
    })

    it("renders pay button with correct label", () => {
        render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

        expect(screen.getByTestId("fee-pay-button")).toHaveTextContent("Pagar fee y completar canje")
    })

    it("disables pay button when placeToPayUrl is empty", () => {
        render(<FeePaymentForm reference="REF123" placeToPayUrl="" />)

        const button = screen.getByTestId("fee-pay-button") as HTMLButtonElement
        expect(button.disabled).toBe(true)
    })

    it("enables pay button when placeToPayUrl is provided", () => {
        render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

        const button = screen.getByTestId("fee-pay-button") as HTMLButtonElement
        expect(button.disabled).toBe(false)
    })

    describe("checkbox error orchestration", () => {
        it("passes hasError=false to both checkboxes initially", () => {
            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

            expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(false)
            expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(false)
        })

        it("passes hasError=true to both checkboxes after submit without accepting any", async () => {
            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(true)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(true)
            })
        })

        it("passes hasError=true only to privacy checkbox when only terms are accepted on submit", async () => {
            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

            acceptCheckbox("acceptedTermsAndConditions", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(false)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(true)
            })
        })

        it("passes hasError=true only to terms checkbox when only privacy is accepted on submit", async () => {
            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

            acceptCheckbox("acceptedPrivacyPolicy", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(true)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(false)
            })
        })

        it("clears hasError on both checkboxes after user corrects a failed submission", async () => {
            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com" />)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })
            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(true)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(true)
            })

            acceptCheckbox("acceptedTermsAndConditions", true)
            acceptCheckbox("acceptedPrivacyPolicy", true)

            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(false)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(false)
            })
        })
    })

    describe("PlaceToPay + navigation flow", () => {
        it("initializes PlaceToPay when both checkboxes are accepted and button is clicked", async () => {
            const initMock = vi.fn()
            const onMock = vi.fn().mockReturnValue("response-handler")
            // @ts-ignore
            window['P'] = {
                init: initMock,
                on: onMock,
            }

            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com/pay" />)

            acceptCheckbox("acceptedTermsAndConditions", true)
            acceptCheckbox("acceptedPrivacyPolicy", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(initMock).toHaveBeenCalledWith("https://example.com/pay", "response-handler")
            })
            expect(onMock).toHaveBeenCalledWith("response", expect.any(Function))
        })

        it("does not initialize PlaceToPay nor navigate when only one checkbox is accepted", async () => {
            const initMock = vi.fn()
            // @ts-ignore
            window['P'] = {
                init: initMock,
                on: vi.fn(),
            }

            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com/pay" />)

            acceptCheckbox("acceptedTermsAndConditions", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(true)
            })
            expect(initMock).not.toHaveBeenCalled()
            expect(mocks.push).not.toHaveBeenCalled()
        })

        it("does not initialize PlaceToPay when placeToPayUrl is empty even with checkboxes accepted", async () => {
            const initMock = vi.fn()
            // @ts-ignore
            window['P'] = {
                init: initMock,
                on: vi.fn(),
            }

            render(<FeePaymentForm reference="REF123" placeToPayUrl="" />)

            acceptCheckbox("acceptedTermsAndConditions", true)
            acceptCheckbox("acceptedPrivacyPolicy", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect((screen.getByTestId("fee-pay-button") as HTMLButtonElement).disabled).toBe(true)
            })
            expect(initMock).not.toHaveBeenCalled()
            expect(mocks.push).not.toHaveBeenCalled()
        })

        it("navigates to feePay with reference when PlaceToPay responds", async () => {
            let responseCallback: () => void = () => {}
            const onMock = vi.fn().mockImplementation((_event: string, cb: () => void) => {
                responseCallback = cb
                return "response-handler"
            })
            const initMock = vi.fn().mockImplementation((_url: string, _handler: string) => {
                responseCallback()
            })
            // @ts-ignore
            window['P'] = {
                init: initMock,
                on: onMock,
            }

            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com/pay" />)

            acceptCheckbox("acceptedTermsAndConditions", true)
            acceptCheckbox("acceptedPrivacyPolicy", true)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(mocks.push).toHaveBeenCalledWith(`${links.feePay}?reference=REF123`)
            })
        })

        it("resets errors and proceeds with payment after correction on second submission", async () => {
            const initMock = vi.fn()
            const onMock = vi.fn().mockReturnValue("response-handler")
            // @ts-ignore
            window['P'] = {
                init: initMock,
                on: onMock,
            }

            render(<FeePaymentForm reference="REF123" placeToPayUrl="https://example.com/pay" />)

            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })
            await waitFor(() => {
                expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(true)
                expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(true)
            })
            expect(initMock).not.toHaveBeenCalled()

            acceptCheckbox("acceptedTermsAndConditions", true)
            acceptCheckbox("acceptedPrivacyPolicy", true)
            act(() => {
                fireEvent.click(screen.getByTestId("fee-pay-button"))
            })

            await waitFor(() => {
                expect(initMock).toHaveBeenCalledWith("https://example.com/pay", "response-handler")
            })
            expect(getLastRenderFor("acceptedTermsAndConditions")?.hasError).toBe(false)
            expect(getLastRenderFor("acceptedPrivacyPolicy")?.hasError).toBe(false)
        })
    })
})
