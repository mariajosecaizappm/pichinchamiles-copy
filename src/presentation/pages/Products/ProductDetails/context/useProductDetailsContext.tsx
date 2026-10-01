import { useContext } from "react"
import { ProductDetailsContext } from "./ProductDetailsContext"

export const useProductDetailsContext = () => {
    const context = useContext(ProductDetailsContext)
    if (!context) {
        throw new Error("useProductDetailsContext must be used within a ProductDetailsProvider")
    }
    return context
}