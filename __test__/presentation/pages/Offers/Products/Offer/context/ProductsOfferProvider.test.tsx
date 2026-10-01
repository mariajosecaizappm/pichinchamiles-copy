import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useContext } from "react"
import { ProductsOfferContext } from "@/presentation/pages/Offers/Products/Offer/context/ProductsOfferContext"
import ProductsOfferProvider from "@/presentation/pages/Offers/Products/Offer/context/ProductsOfferProvider"

const TestConsumer = () => {
    const context = useContext(ProductsOfferContext)
    const { brandIds, setBrandIds } = context!

    return (
        <div>
            <span data-testid="brand-ids">{JSON.stringify(brandIds)}</span>
            <button data-testid="add-brand" onClick={() => setBrandIds(["b1"])}>
                add brand
            </button>
        </div>
    )
}

describe("ProductsOfferProvider", () => {
    it("provides default empty brand ids", () => {
        render(
            <ProductsOfferProvider>
                <TestConsumer />
            </ProductsOfferProvider>
        )

        expect(screen.getByTestId("brand-ids")).toHaveTextContent("[]")
    })

    it("updates brand ids through setBrandIds", () => {
        render(
            <ProductsOfferProvider>
                <TestConsumer />
            </ProductsOfferProvider>
        )

        fireEvent.click(screen.getByTestId("add-brand"))

        expect(screen.getByTestId("brand-ids")).toHaveTextContent(JSON.stringify(["b1"]))
    })
})
