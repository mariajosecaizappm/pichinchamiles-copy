import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import AuthModalTitle from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthModalTitle/AuthModalTitle"

const mocks = vi.hoisted(() => {
    let member: any = null
    return {
        getMember: () => member,
        setMember: (next: any) => {
            member = next
        },
    }
})

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        member: mocks.getMember(),
    }),
}))

describe("AuthModalTitle", () => {
    beforeEach(() => {
        mocks.setMember(null)
    })

    describe("when otp is not blocked", () => {
        it("should show the welcome title", () => {
            render(<AuthModalTitle />)

            expect(
                screen.getByRole("heading", {
                    level: 3,
                    name: "¡Te damos la bienvenida a Pichincha Miles!",
                }),
            ).toBeInTheDocument()
        })
    })

    describe("when otp is blocked", () => {
        it("should render nothing", () => {
            render(
                <AuthModalContext.Provider
                    value={{
                        auth: null,
                        identification: "",
                        blockedUntil: new Date("2020-01-01T00:00:00.000Z"),
                        mfaRequest: null,
                        setAuth: () => {},
                        clearAuth: () => {},
                        setMfaRequest: () => {},
                        onLoadAuthMember: async () => {},
                        otp: null,
                        setOtp: () => {},
                        onBlock: () => {},
                        onUnblock: () => {},
                        onContinueBlock: () => {},
currentStep: 1,
backStep: vi.fn()
}}
                >
                    <AuthModalTitle />
                </AuthModalContext.Provider>,
            )

            expect(
                screen.queryByRole("heading", {
                    level: 3,
                    name: "¡Te damos la bienvenida a Pichincha Miles!",
                }),
            ).not.toBeInTheDocument()
            expect(screen.queryByTestId("textOtpWelcome")).not.toBeInTheDocument()
        })
    })

    describe("when auth flow is RESET_PASSWORD and member exists", () => {
        it("should render nothing", () => {
            mocks.setMember({identificationNumber: "123"})
            render(
                <AuthModalContext.Provider
                    value={{
                        auth: {flow: AuthFlow.RESET_PASSWORD, otp: {} as any},
                        identification: "",
                        blockedUntil: null,
                        mfaRequest: null,
                        setAuth: () => {},
                        clearAuth: () => {},
                        setMfaRequest: () => {},
                        onLoadAuthMember: async () => {},
                        otp: null,
                        setOtp: () => {},
                        onBlock: () => {},
                        onUnblock: () => {},
                        onContinueBlock: () => {},
currentStep: 1,
backStep: vi.fn()
}}
                >
                    <AuthModalTitle />
                </AuthModalContext.Provider>,
            )

            expect(
                screen.queryByRole("heading", {
                    level: 3,
                    name: "¡Te damos la bienvenida a Pichincha Miles!",
                }),
            ).not.toBeInTheDocument()
            expect(screen.queryByTestId("textOtpWelcome")).not.toBeInTheDocument()
        })
    })
})
