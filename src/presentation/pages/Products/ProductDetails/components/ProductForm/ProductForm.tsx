"use client"

import { ProductVariation } from "@/domain/entity/Product/product"
import Form from "@/presentation/components/Form/context/Form"
import { FC } from "react"
import PaymentAlerts from "../PaymentAlerts"
import { defaultProductFormValues, ProductFormValues } from "./ProductFormConfig"
import ProductFormLogic from "./ProductFormLogic"
import AddToCart from "./components/AddToCart"
import PaymentOptions from "./components/PaymentOptions"
import ProductCustomization from "./components/ProductCustomization/ProductCustomization"

type Props = {
    productVariation: ProductVariation
    className?: string
    onSubmit: (values: ProductFormValues) => Promise<void>,
    isLoading: boolean,
}

const ProductForm: FC<Props> = ({ productVariation, className, onSubmit, isLoading }) => {


    return (
        <div className={`w-full ${className}`}>
            <Form
                initialValues={defaultProductFormValues}
                onSubmit={onSubmit}
            >
                <ProductFormLogic />
                <div className="space-y-5">
                    <ProductCustomization features={productVariation.product.features} />
                    <PaymentOptions basePointsPrice={productVariation.product.minPointsPrice} />
                    <PaymentAlerts />
                    <div className="w-full lg:w-min lg:min-w-50 lg:py-2">
                        <AddToCart isLoading={isLoading} />
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default ProductForm
