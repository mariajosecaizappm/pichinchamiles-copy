import { describe, it, expect } from "vitest"
import { useContext } from "react"
import { render } from "@testing-library/react"
import { ProductsContext } from "@/presentation/pages/Products/context/ProductsContext"

describe("ProductsContext", () => {
    it("should provide null as default value without throwing", () => {
        let contextValue: ProductsContext | null | undefined

        const TestComponent = () => {
            contextValue = useContext(ProductsContext)
            return null
        }

        render(<TestComponent />)

        expect(contextValue).toBeNull()
    })
})
