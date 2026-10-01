import { createContext } from "react";

export type ProductsOfferContext = {
    brandIds: string[];
    setBrandIds: (brandIds: string[]) => void;
}

export const ProductsOfferContext = createContext<ProductsOfferContext | null>(null)
