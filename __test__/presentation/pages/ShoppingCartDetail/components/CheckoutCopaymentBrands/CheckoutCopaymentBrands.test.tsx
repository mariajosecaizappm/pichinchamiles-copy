import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CheckoutCopaymentBrands from "@/presentation/pages/ShoppingCartDetail/components/CheckoutCopaymentBrands/CheckoutCopaymentBrands"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: {
            src: options.src,
            srcSet: options.src,
            alt: options.alt || "",
            width: options.width,
            height: options.height,
        },
    }),
    // eslint-disable-next-line @next/next/no-img-element
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

describe("CheckoutCopaymentBrands", () => {
    it("when it renders should show placetopay and supported card brands", () => {
        render(<CheckoutCopaymentBrands />)

        expect(screen.getByAltText("place to pay logo")).toBeInTheDocument()
        expect(screen.getByAltText("diners logo")).toBeInTheDocument()
        expect(screen.getByAltText("mastercard logo")).toBeInTheDocument()
        expect(screen.getByAltText("discover logo")).toBeInTheDocument()
        expect(screen.getByAltText("visa logo")).toBeInTheDocument()
        expect(screen.getByAltText("Titanium logo")).toBeInTheDocument()
    })
})
