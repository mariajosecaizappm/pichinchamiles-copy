import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import FeePayContainer from "@/presentation/pages/FeePay/FeePayContainer"
import links from "@/presentation/config/links"

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    searchParams: new Map<string, string>(),
    receivedFeePayProps: [] as any[],
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
    useSearchParams: () => ({
        entries: () => mocks.searchParams.entries(),
    }),
}))

vi.mock("@/presentation/pages/FeePay/FeePay", () => ({
    default: ({reference, placeToPayUrl}: any) => {
        mocks.receivedFeePayProps.push({reference, placeToPayUrl})
        return (
            <div
                data-testid="fee-pay-component"
                data-reference={reference}
                data-place-to-pay-url={placeToPayUrl}
            >
                fee-pay
            </div>
        )
    }
}))

describe("FeePayContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.push.mockReset()
        mocks.receivedFeePayProps.length = 0
        mocks.searchParams.clear()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("passes reference from searchParams to FeePay component", () => {
        mocks.searchParams.set("reference", "FEE123")

        render(<FeePayContainer />)

        const feePay = screen.getByTestId("fee-pay-component")
        expect(feePay.getAttribute("data-reference")).toBe("FEE123")
    })

    it("decodes placeToPayUrl from double base64 encoded 'q' parameter", () => {
        const rawUrl = "https://placetopay.com/session/abc123"
        const firstEncode = Buffer.from(rawUrl).toString("base64")
        const secondEncode = Buffer.from(firstEncode).toString("base64")
        mocks.searchParams.set("reference", "FEE123")
        mocks.searchParams.set("q", secondEncode)

        render(<FeePayContainer />)

        const feePay = screen.getByTestId("fee-pay-component")
        expect(feePay.getAttribute("data-place-to-pay-url")).toBe(rawUrl)
    })

    it("handles null bytes after decoding placeToPayUrl", () => {
        const rawUrl = "https://placetopay.com/session/clean"
        const withNulls = rawUrl + "\0\0"
        const firstEncode = Buffer.from(withNulls).toString("base64")
        const secondEncode = Buffer.from(firstEncode).toString("base64")
        mocks.searchParams.set("reference", "FEE456")
        mocks.searchParams.set("q", secondEncode)

        render(<FeePayContainer />)

        const feePay = screen.getByTestId("fee-pay-component")
        expect(feePay.getAttribute("data-place-to-pay-url")).toBe(rawUrl)
    })

    it("passes empty string as placeToPayUrl when q parameter is not provided", () => {
        mocks.searchParams.set("reference", "FEE789")

        render(<FeePayContainer />)

        const feePay = screen.getByTestId("fee-pay-component")
        expect(feePay.getAttribute("data-place-to-pay-url")).toBe("")
    })

    it("passes empty string as placeToPayUrl when decoding throws", () => {
        const originalFrom = Buffer.from
        const spy = vi.spyOn(Buffer, "from")
        let callCount = 0
        spy.mockImplementation((...args: Parameters<typeof Buffer.from>) => {
            callCount++
            if (callCount === 2) {
                throw new Error("Invalid base64")
            }
            return originalFrom.apply(Buffer, args as any)
        })

        mocks.searchParams.set("reference", "FEE000")
        mocks.searchParams.set("q", "some-encoded-value")

        try {
            render(<FeePayContainer />)

            const feePay = screen.getByTestId("fee-pay-component")
            expect(feePay.getAttribute("data-place-to-pay-url")).toBe("")
        } finally {
            spy.mockRestore()
        }
    })

    it("redirects to home when expirationDateTime is in the past", () => {
        const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        mocks.searchParams.set("reference", "FEE123")
        mocks.searchParams.set("expirationDateTime", pastDate)

        render(<FeePayContainer />)
        vi.runAllTimers()

        expect(mocks.push).toHaveBeenCalledWith(links.home)
    })

    it("does NOT redirect when expirationDateTime is in the future", () => {
        const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
        mocks.searchParams.set("reference", "FEE123")
        mocks.searchParams.set("expirationDateTime", futureDate)

        render(<FeePayContainer />)
        vi.runAllTimers()

        expect(mocks.push).not.toHaveBeenCalled()
    })

    it("does NOT redirect when expirationDateTime is not provided", () => {
        mocks.searchParams.set("reference", "FEE123")

        render(<FeePayContainer />)
        vi.runAllTimers()

        expect(mocks.push).not.toHaveBeenCalled()
    })
})
