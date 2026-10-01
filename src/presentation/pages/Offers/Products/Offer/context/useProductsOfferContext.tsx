import { useContext } from "react"
import { ProductsOfferContext } from "./ProductsOfferContext"

const useProductsOfferContext = () => {
    const context = useContext(ProductsOfferContext)
    if (!context) {
        throw new Error("useProductsOfferContext must be used within a ProductsOfferProvider")
    }
    return context
}

export default useProductsOfferContext