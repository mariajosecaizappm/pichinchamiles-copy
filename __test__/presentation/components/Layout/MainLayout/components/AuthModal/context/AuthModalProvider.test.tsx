import React, {useContext} from "react"
import {render, screen, fireEvent, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import AuthModalProvider from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalProvider"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const getAuthMember = vi.fn()
    const initSession = vi.fn()
    let member: any = null
    return {containerGet, getAuthMember, initSession, getMember: () => member, setMember: (m: any) => {member = m}}
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        initSession: mocks.initSession,
        member: mocks.getMember(),
    }),
}))

vi.mock("react-redux", () => ({
    useSelector: vi.fn(() => undefined),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
    usePathname: () => "/",
}))

const Consumer = () => {
    const {
        auth,
        identification,
        blockedUntil,
        mfaRequest,
        otp,
        setAuth,
        onBlock,
        onUnblock,
        onContinueBlock,
        clearAuth,
        setMfaRequest,
        onLoadAuthMember,
        setOtp,
        currentStep,
        backStep,
    } = useContext(AuthModalContext)

    return (
        <div>
            <div data-testid="auth-flow">{auth?.flow ?? "null"}</div>
            <div data-testid="identification">{identification}</div>
            <div data-testid="is-blocked">{String(Boolean(blockedUntil))}</div>
            <div data-testid="mfa-code">{mfaRequest?.mfaCode ?? "null"}</div>
            <div data-testid="otp-token">{otp?.mfaToken ?? "null"}</div>
            <div data-testid="current-step">{currentStep}</div>
            <button
                type="button"
                onClick={() => setAuth({flow: AuthFlow.LOGIN}, "123")}
            >
                set-with-id
            </button>
            <button
                type="button"
                onClick={() => setAuth({flow: AuthFlow.RESET_PASSWORD, otp: {
                    cellPhone: null,
                    durationOtpCodeMinutes: 0,
                    email: null,
                    mfaToken: "mfa",
                }})}
            >
                set-without-id
            </button>
            <button
                type="button"
                onClick={() => setAuth({flow: AuthFlow.ACTIVATE_ACCOUNT, otp: {
                    cellPhone: null,
                    durationOtpCodeMinutes: 0,
                    email: null,
                    mfaToken: "mfa",
                }})}
            >
                set-activate-flow
            </button>
            <button
                type="button"
                onClick={() => onBlock(new Date("2020-01-01T00:00:00.000Z"))}
            >
                set-blocked
            </button>
            <button
                type="button"
                onClick={() => onUnblock()}
            >
                unset-blocked
            </button>
            <button
                type="button"
                onClick={() => onContinueBlock()}
            >
                continue-block
            </button>
            <button
                type="button"
                onClick={() => setMfaRequest({mfaToken: "mfa", mfaCode: "123456"})}
            >
                set-mfa
            </button>
            <button
                type="button"
                onClick={() => onLoadAuthMember()}
            >
                load-member
            </button>
            <button
                type="button"
                onClick={() =>
                    setOtp({
                        cellPhone: null,
                        durationOtpCodeMinutes: 5,
                        email: null,
                        mfaToken: "otp-mfa",
                    })
                }
            >
                set-otp
            </button>
            <button
                type="button"
                onClick={() => clearAuth()}
            >
                clear-auth
            </button>
            <button
                type="button"
                onClick={() => backStep()}
            >
                back-step
            </button>
        </div>
    )
}

describe("AuthModalProvider", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.getAuthMember.mockReset()
        mocks.initSession.mockReset()
        mocks.setMember(null)

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.LoadAuthMemberUseCase) {
                return {getAuthMember: mocks.getAuthMember}
            }
            return {}
        })
    })

    describe("when rendered", () => {
        it("should render children and expose default context values", () => {
            render(
                <AuthModalProvider>
                    <div>child</div>
                    <Consumer />
                </AuthModalProvider>,
            )

            expect(screen.getByText("child")).toBeInTheDocument()
            expect(screen.getByTestId("auth-flow")).toHaveTextContent("null")
            expect(screen.getByTestId("identification")).toHaveTextContent("")
            expect(screen.getByTestId("is-blocked")).toHaveTextContent("false")
            expect(screen.getByTestId("mfa-code")).toHaveTextContent("null")
            expect(screen.getByTestId("otp-token")).toHaveTextContent("null")
        })
    })

    describe("when setAuth is called with identification", () => {
        it("should update auth and identification", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-with-id"}))

            expect(screen.getByTestId("auth-flow")).toHaveTextContent(
                AuthFlow.LOGIN,
            )
            expect(screen.getByTestId("identification")).toHaveTextContent("123")
        })
    })

    describe("when setAuth is called without identification", () => {
        it("should update auth but keep the previous identification", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-with-id"}))
            expect(screen.getByTestId("identification")).toHaveTextContent("123")

            fireEvent.click(
                screen.getByRole("button", {name: "set-without-id"}),
            )

            expect(screen.getByTestId("auth-flow")).toHaveTextContent(
                AuthFlow.RESET_PASSWORD,
            )
            expect(screen.getByTestId("identification")).toHaveTextContent("123")
        })
    })

    describe("when currentStep is evaluated for RESET_PASSWORD flow", () => {
        it("should return step 4 if member is present", () => {
            mocks.setMember({id: "123", name: "John"})
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-without-id"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("4")
        })

        it("should return step 3 if mfaRequest is present and no member", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-without-id"}))
            fireEvent.click(screen.getByRole("button", {name: "set-mfa"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("3")
        })

        it("should return step 2 if no mfaRequest and no member", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-without-id"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
        })
    })

    describe("when handleBackStep is called", () => {
        it("should handle back step for LOGIN flow", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            // Step 1: go to login flow
            fireEvent.click(screen.getByRole("button", {name: "set-with-id"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go to step 3 (otp)
            fireEvent.click(screen.getByRole("button", {name: "set-otp"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("3")
            
            // Go back from step 3 -> step 2
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go back from step 2 -> clear
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("auth-flow")).toHaveTextContent("null")
        })

        it("should handle back step for ACTIVATE_ACCOUNT flow", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            // Step 1: go to activate flow
            fireEvent.click(screen.getByRole("button", {name: "set-activate-flow"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go to step 3 (mfa)
            fireEvent.click(screen.getByRole("button", {name: "set-mfa"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("3")
            
            // Go back from step 3 -> step 2
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go back from step 2 -> clear
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("auth-flow")).toHaveTextContent("null")
        })

        it("should handle back step for RESET_PASSWORD flow", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            // Step 1: go to reset flow
            fireEvent.click(screen.getByRole("button", {name: "set-without-id"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go to step 3 (mfa)
            fireEvent.click(screen.getByRole("button", {name: "set-mfa"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("3")
            
            // Go back from step 3 -> step 2
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("current-step")).toHaveTextContent("2")
            
            // Go back from step 2 -> back to login
            fireEvent.click(screen.getByRole("button", {name: "back-step"}))
            expect(screen.getByTestId("auth-flow")).toHaveTextContent(AuthFlow.LOGIN)
        })
    })
    describe("when onBlock is called", () => {
        it("should update blockedUntil", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            expect(screen.getByTestId("is-blocked")).toHaveTextContent("false")
            fireEvent.click(screen.getByRole("button", {name: "set-blocked"}))
            expect(screen.getByTestId("is-blocked")).toHaveTextContent("true")
            fireEvent.click(screen.getByRole("button", {name: "unset-blocked"}))
            expect(screen.getByTestId("is-blocked")).toHaveTextContent("false")
            fireEvent.click(
                screen.getByRole("button", {name: "set-with-id"}),
            )
            fireEvent.click(
                screen.getByRole("button", {name: "continue-block"}),
            )
            expect(screen.getByTestId("is-blocked")).toHaveTextContent("false")
            expect(screen.getByTestId("auth-flow")).toHaveTextContent("null")
            expect(screen.getByTestId("identification")).toHaveTextContent("")
        })
    })

    describe("when setMfaRequest is called", () => {
        it("should update mfaRequest", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            expect(screen.getByTestId("mfa-code")).toHaveTextContent("null")
            fireEvent.click(screen.getByRole("button", {name: "set-mfa"}))
            expect(screen.getByTestId("mfa-code")).toHaveTextContent("123456")
        })
    })

    describe("when setOtp is called", () => {
        it("should update otp", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            expect(screen.getByTestId("otp-token")).toHaveTextContent("null")
            fireEvent.click(screen.getByRole("button", {name: "set-otp"}))
            expect(screen.getByTestId("otp-token")).toHaveTextContent("otp-mfa")
        })
    })

    describe("when clearAuth is called", () => {
        it("should reset auth and identification", () => {
            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "set-with-id"}))
            expect(screen.getByTestId("auth-flow")).toHaveTextContent(
                AuthFlow.LOGIN,
            )
            expect(screen.getByTestId("identification")).toHaveTextContent("123")

            fireEvent.click(screen.getByRole("button", {name: "clear-auth"}))
            expect(screen.getByTestId("auth-flow")).toHaveTextContent("null")
            expect(screen.getByTestId("identification")).toHaveTextContent("")
        })
    })

    describe("when onLoadAuthMember is called", () => {
        it("should load auth member, init session and scroll to top", async () => {
            const authMember = {member: {identificationNumber: "123"}, balance: 10, currency: null, basket: null} as any
            mocks.getAuthMember.mockResolvedValue(authMember)
            const scrollTo = vi.fn()
            vi.stubGlobal("scrollTo", scrollTo)

            render(
                <AuthModalProvider>
                    <Consumer />
                </AuthModalProvider>,
            )

            fireEvent.click(screen.getByRole("button", {name: "load-member"}))

            await waitFor(() => {
                expect(mocks.getAuthMember).toHaveBeenCalledTimes(1)
                expect(mocks.initSession).toHaveBeenCalledWith(authMember)
                expect(scrollTo).toHaveBeenCalledWith(0, 0)
            })
        })
    })
})
