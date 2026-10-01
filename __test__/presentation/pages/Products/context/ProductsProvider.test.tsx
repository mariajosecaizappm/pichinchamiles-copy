import { describe, it, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { useContext, useEffect, useState } from "react"
import ProductsProvider from "@/presentation/pages/Products/context/ProductsProvider"
import { ProductsContext } from "@/presentation/pages/Products/context/ProductsContext"
import { Category } from "@/domain/entity/Category/structure/category"

describe("ProductsProvider", () => {
    const mockCategories: Category[] = [
        { id: "1", name: "Electronics", slug: "electronics", parent: null },
        { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
    ]

    it("should render children", () => {
        render(
            <ProductsProvider categories={mockCategories}>
                <div>Test Child</div>
            </ProductsProvider>
        )

        expect(screen.getByText("Test Child")).toBeInTheDocument()
    })

    it("should provide a categorization instance built from categories prop", () => {
        let contextValue: ProductsContext | undefined

        const TestChild = () => {
            contextValue = useContext(ProductsContext)
            return null
        }

        render(
            <ProductsProvider categories={mockCategories}>
                <TestChild />
            </ProductsProvider>
        )

        expect(contextValue?.categorization).toBeDefined()
        expect(contextValue?.categorization?.categories).toEqual(mockCategories)
    })

    it("should memoize value when categories prop reference stays the same", async () => {
        const capturedValues: ProductsContext[] = []

        const TestChild = () => {
            const value = useContext(ProductsContext)
            useEffect(() => {
                capturedValues.push(value)
            })
            return null
        }

        const Wrapper = () => {
            const [count, setCount] = useState(0)
            return (
                <>
                    <ProductsProvider categories={mockCategories}>
                        <TestChild />
                    </ProductsProvider>
                    <button onClick={() => setCount(count + 1)}>Rerender</button>
                </>
            )
        }

        const { getByText } = render(<Wrapper />)

        // Wait for initial render
        await waitFor(() => {
            expect(capturedValues).toHaveLength(1)
        })

        // Trigger rerender
        getByText("Rerender").click()

        // Wait for rerender
        await waitFor(() => {
            expect(capturedValues).toHaveLength(2)
        })

        // Value should be memoized (same reference)
        expect(capturedValues[0]).toBe(capturedValues[1])
    })

    it("should create new categorization when categories prop changes", () => {
        const capturedValues: ProductsContext[] = []

        const TestChild = () => {
            const value = useContext(ProductsContext)
            useEffect(() => {
                capturedValues.push(value)
            })
            return null
        }

        const newCategories: Category[] = [
            { id: "3", name: "Home", slug: "home", parent: null },
        ]

        const { rerender } = render(
            <ProductsProvider categories={mockCategories}>
                <TestChild />
            </ProductsProvider>
        )

        expect(capturedValues).toHaveLength(1)

        rerender(
            <ProductsProvider categories={newCategories}>
                <TestChild />
            </ProductsProvider>
        )

        expect(capturedValues).toHaveLength(2)
        expect(capturedValues[0]).not.toBe(capturedValues[1])
        expect(capturedValues[1]?.categorization?.categories).toEqual(newCategories)
    })
})
