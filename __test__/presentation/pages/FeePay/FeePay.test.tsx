import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import FeePay from "@/presentation/pages/FeePay/FeePay"

const mocks = vi.hoisted(() => ({
    receivedFormProps: [] as any[],
    receivedStatusProps: [] as any[],
}))

vi.mock("@/presentation/pages/FeePay/components/FeePaymentStatus", () => ({
    default: ({reference}: any) => {
        mocks.receivedStatusProps.push({reference})
        return <div data-testid="fee-payment-status" data-reference={reference}>status</div>
    }
}))

vi.mock("@/presentation/pages/FeePay/components/FeePaymentForm", () => ({
    default: ({reference, placeToPayUrl}: any) => {
        mocks.receivedFormProps.push({reference, placeToPayUrl})
        return (
            <div
                data-testid="fee-payment-form"
                data-reference={reference}
                data-place-to-pay-url={placeToPayUrl}
            >
                form
            </div>
        )
    }
}))

vi.mock("next/image", () => ({
    default: ({src, alt, width, height}: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            data-testid={`next-image-${alt?.replace(/\s+/g, "-") || "no-alt"}`}
            src={typeof src === "object" ? src.src : src}
            alt={alt}
            width={width}
            height={height}
        />
    )
}))

describe("FeePay", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.receivedFormProps.length = 0
        mocks.receivedStatusProps.length = 0
    })

    it("renders status component with correct reference", () => {
        render(<FeePay reference="FEE123" placeToPayUrl="https://example.com" />)

        const status = screen.getByTestId("fee-payment-status")
        expect(status.getAttribute("data-reference")).toBe("FEE123")
    })

    it("renders form component with correct reference and placeToPayUrl", () => {
        render(<FeePay reference="FEE456" placeToPayUrl="https://pay.example.com/abc" />)

        const form = screen.getByTestId("fee-payment-form")
        expect(form.getAttribute("data-reference")).toBe("FEE456")
        expect(form.getAttribute("data-place-to-pay-url")).toBe("https://pay.example.com/abc")
    })

    it("renders the heading text", () => {
        render(<FeePay reference="FEE123" placeToPayUrl="https://example.com" />)

        expect(screen.getByText("Estás por completar tu canje")).toBeInTheDocument()
    })

    it("renders the description paragraph", () => {
        render(<FeePay reference="FEE123" placeToPayUrl="https://example.com" />)

        expect(screen.getByText(/Por favor, lee detenidamente y acepta/)).toBeInTheDocument()
    })

    it("renders the PlaceToPay logo image", () => {
        render(<FeePay reference="FEE123" placeToPayUrl="https://example.com" />)

        const logo = screen.getByAltText("place to pay logo")
        expect(logo).toBeInTheDocument()
    })

    it("renders all payment method logos", () => {
        render(<FeePay reference="FEE123" placeToPayUrl="https://example.com" />)

        expect(screen.getByAltText("diners logo")).toBeInTheDocument()
        expect(screen.getByAltText("mastercard logo")).toBeInTheDocument()
        expect(screen.getByAltText("discover logo")).toBeInTheDocument()
        expect(screen.getByAltText("visa logo")).toBeInTheDocument()
        expect(screen.getByAltText("Titanium logo")).toBeInTheDocument()
    })
})
