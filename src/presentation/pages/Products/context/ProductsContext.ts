"use client"

import Categorization from "@/domain/entity/Category/models/Categorization"
import { createContext } from "react"

export type ProductsContext = {
  productCategories: string[];
  productBrands: string[];
  setProductCategories: (categories: string[]) => void;
  setProductBrands: (brands: string[]) => void;
  categorization: Categorization | null;
}

export const ProductsContext = createContext<ProductsContext | null>(null)