import React from "react"
import {render, screen, fireEvent, within, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {closeAuthModal} from "@/presentation/redux/features/authModalSlice"

const mocks = vi.hoisted(() => {
    const dispatch = vi.fn()
    const backStep = vi.fn()
    const clearAuth = vi.fn()
    let isOpen = true
    let currentStep = 1
    
    // We create the mock context object here inside hoisted so we can use it below
    const AuthModalContextMock = require("react").createContext({
        currentStep: 1,
        backStep: vi.fn(),
        clearAuth: vi.fn()
    })

    return {
        dispatch,
        backStep,
        clearAuth,
        setIsOpen: (v: boolean) => {
            isOpen = v
        },
        setCurrentStep: (v: number) => {
            currentStep = v
        },
        getState: () => ({authModal: {isOpen}}),
        getCurrentStep: () => currentStep,
        AuthModalContextMock,
    }
})

vi.mock("react-redux", () => ({
    useDispatch: () => mocks.dispatch,
    useSelector: (selector: any) => selector(mocks.getState()),
}))

vi.mock("@/presentation/components/Modal", async () => {
    const React = await import("react")
    return {
        default: ({isOpen, onClose, children, headerButton}: any) => {
            if (!isOpen) return null
            return (
                <div data-testid="mock-modal">
                    {headerButton && <div data-testid="mock-header-btn">{headerButton}</div>}
                    <button
                        type="button"
                        data-testid="mock-close"
                        onClick={() => onClose?.()}
                    >
                        close
                    </button>
                    {children}
                </div>
            )
        },
    }
})

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext",
    () => {
        return {
            default: mocks.AuthModalContextMock
        }
    }
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalProvider",
    () => ({
        default: ({children}: any) => {
            return (
                <mocks.AuthModalContextMock.Provider value={{
                    currentStep: mocks.getCurrentStep(),
                    backStep: mocks.backStep,
                    clearAuth: mocks.clearAuth
                }}>
                    <div data-testid="mock-auth-provider">{children}</div>
                </mocks.AuthModalContextMock.Provider>
            )
        },
    }),
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthModalTitle",
    () => ({ default: () => <div data-testid="mock-title" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm",
    () => ({ default: () => <div data-testid="mock-identification" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthStepper",
    () => ({ default: () => <div data-testid="mock-stepper" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthPrivacy",
    () => ({ default: () => <div data-testid="mock-privacy" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow",
    () => ({ default: () => <div data-testid="mock-activation-flow" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow",
    () => ({ default: () => <div data-testid="mock-login-flow" /> })
)

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow",
    () => ({ default: () => <div data-testid="mock-reset-password-flow" /> })
)

import AuthModal from "@/presentation/components/Layout/MainLayout/components/AuthModal/AuthModal"

describe("AuthModal", () => {
    beforeEach(() => {
        mocks.dispatch.mockReset()
        mocks.setIsOpen(true)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when modal is open", () => {
        it("should render modal content and formsAlert container", () => {
            render(<AuthModal />)

            expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            expect(screen.getByTestId("mock-auth-provider")).toBeInTheDocument()
            expect(document.getElementById("formsAlert")).toBeInTheDocument()

            expect(screen.getByTestId("mock-title")).toBeInTheDocument()
            expect(screen.getByTestId("mock-identification")).toBeInTheDocument()
            expect(
                screen.getByTestId("mock-activation-flow"),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-login-flow")).toBeInTheDocument()
            expect(
                screen.getByTestId("mock-reset-password-flow"),
            ).toBeInTheDocument()
            expect(screen.getByTestId("mock-stepper")).toBeInTheDocument()
            expect(screen.getByTestId("mock-privacy")).toBeInTheDocument()
        })

        it("should not render back button if currentStep is 1", () => {
            mocks.setCurrentStep(1)
            render(<AuthModal />)
            expect(screen.queryByTestId("backStepModal")).not.toBeInTheDocument()
        })

        it("should render back button and trigger backStep if currentStep is between 2 and 3", () => {
            mocks.setCurrentStep(2)
            render(<AuthModal />)
            
            const headerBtnContainer = screen.getByTestId("mock-header-btn")
            expect(headerBtnContainer).toBeInTheDocument()
            
            const backBtn = within(headerBtnContainer).getByTestId("backStepModal")
            fireEvent.click(backBtn)
            expect(mocks.backStep).toHaveBeenCalled()
        })

        it("should dispatch closeAuthModal when close is triggered", () => {
            render(<AuthModal />)

            fireEvent.click(screen.getByTestId("mock-close"))

            expect(mocks.dispatch).toHaveBeenCalledWith(closeAuthModal())
        })
    })

    describe("when modal is closed", () => {
        it("should not render modal inner content and call clearAuth after delay", async () => {
            vi.useFakeTimers()
            mocks.setIsOpen(false)
            render(<AuthModal />)

            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
            expect(screen.getByTestId("mock-auth-provider")).toBeInTheDocument()

            vi.runAllTimers()
            
            expect(mocks.clearAuth).toHaveBeenCalled()
            
            vi.useRealTimers()
        })
    })
})
