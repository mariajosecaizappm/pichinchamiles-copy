import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import AuthPrivacy from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthPrivacy/AuthPrivacy"

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

describe("AuthPrivacy", () => {
    beforeEach(() => {
        mocks.setMember(null)
    })

    describe("when otp is not blocked", () => {
        it("should render privacy and terms links", () => {
            render(
                <AuthModalContext.Provider
                    value={{
                        auth: null,
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
                    <AuthPrivacy />
                </AuthModalContext.Provider>,
            )

            expect(
                screen.getByRole("link", {name: "Enlace a política de privacidad de Google"}),
            ).toHaveAttribute(
                "href",
                "https://policies.google.com/privacy?hl=es-419",
            )
            expect(
                screen.getByRole("link", {name: "Enlace a términos de servicio de Google"}),
            ).toHaveAttribute("href", "https://policies.google.com/terms?hl=es")
        })
    })

    describe("when otp is blocked", () => {
        it("should render nothing", () => {
            const {container} = render(
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
                    <AuthPrivacy />
                </AuthModalContext.Provider>,
            )

            expect(container.firstChild).toBeNull()
        })
    })

    describe("when auth flow is RESET_PASSWORD and member exists", () => {
        it("should render nothing", () => {
            mocks.setMember({identificationNumber: "123"})
            const {container} = render(
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
                    <AuthPrivacy />
                </AuthModalContext.Provider>,
            )

            expect(container.firstChild).toBeNull()
        })
    })
})
