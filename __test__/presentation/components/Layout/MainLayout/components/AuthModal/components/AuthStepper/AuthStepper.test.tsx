import React from "react"
import {render} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext"
import {AuthFlow} from "@/domain/entity/Auth/auth"
import AuthStepper from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthStepper/AuthStepper"

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

const renderWithContext = (value: any) => {
    return render(
        <AuthModalContext.Provider
            value={{
                auth: null,
                identification: "",
                blockedUntil: null,
                mfaRequest: null,
                otp: null,
                setAuth: () => {},
                clearAuth: () => {},
                setMfaRequest: () => {},
                onLoadAuthMember: async () => {},
                setOtp: () => {},
                onBlock: () => {},
                onUnblock: () => {},
                onContinueBlock: () => {},
                currentStep: 1,
                backStep: () => {},
                ...value,
            }}
        >
            <AuthStepper />
        </AuthModalContext.Provider>,
    )
}

describe("AuthStepper", () => {
    beforeEach(() => {
        mocks.setMember(null)
        vi.clearAllMocks()
    })

    describe("when currentStep is provided", () => {
        it("should mark step 1 as current", () => {
            const {container} = renderWithContext({currentStep: 1})

            const dots = container.querySelectorAll("div[aria-current]")
            expect(dots).toHaveLength(1)
            expect(dots[0]).toHaveAttribute("aria-current", "step")
        })

        it("should mark step 2 as current", () => {
            const {container} = renderWithContext({currentStep: 2})

            const allDots = Array.from(container.querySelectorAll("div.h-2.w-2.rounded-full"))
            expect(allDots).toHaveLength(4)

            const current = container.querySelector('div[aria-current="step"]')
            expect(current).not.toBeNull()
            expect(allDots[1]).toBe(current)
        })

        it("should mark step 3 as current", () => {
            const {container} = renderWithContext({currentStep: 3})

            const allDots = Array.from(container.querySelectorAll("div.h-2.w-2.rounded-full"))
            expect(allDots).toHaveLength(4)

            const current = container.querySelector('div[aria-current="step"]')
            expect(current).not.toBeNull()
            expect(allDots[2]).toBe(current)
        })

        it("should mark step 4 as current", () => {
            const {container} = renderWithContext({currentStep: 4})

            const allDots = Array.from(container.querySelectorAll("div.h-2.w-2.rounded-full"))
            expect(allDots).toHaveLength(4)

            const current = container.querySelector('div[aria-current="step"]')
            expect(current).not.toBeNull()
            expect(allDots[3]).toBe(current)
        })
    })

    describe("when otp is blocked", () => {
        it("should render nothing", () => {
            const {container} = renderWithContext({
                blockedUntil: new Date("2020-01-01T00:00:00.000Z"),
                currentStep: 1
            })

            expect(container.firstChild).toBeNull()
        })
    })

    describe("when auth flow is RESET_PASSWORD and member exists", () => {
        it("should render nothing", () => {
            mocks.setMember({identificationNumber: "123"})

            const {container} = renderWithContext({
                auth: {flow: AuthFlow.RESET_PASSWORD},
                mfaRequest: null,
                currentStep: 1
            })

            expect(container.firstChild).toBeNull()
        })
    })

    describe("when auth flow is RESET_PASSWORD or LOGIN", () => {
        it("should render 3 steps for RESET_PASSWORD", () => {
            const {container} = renderWithContext({
                auth: {flow: AuthFlow.RESET_PASSWORD},
                currentStep: 1
            })
            const allDots = Array.from(container.querySelectorAll("div.h-2.w-2.rounded-full"))
            expect(allDots).toHaveLength(3)
        })

        it("should render 3 steps for LOGIN", () => {
            const {container} = renderWithContext({
                auth: {flow: AuthFlow.LOGIN},
                currentStep: 1
            })
            const allDots = Array.from(container.querySelectorAll("div.h-2.w-2.rounded-full"))
            expect(allDots).toHaveLength(3)
        })
    })
})
