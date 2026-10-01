"use client"

import {ProductVariation} from "@/domain/entity/Product/product"
import useSession from "@/presentation/hooks/useSession"
import {openAuthModal} from "@/presentation/redux/features/authModalSlice"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {useProductDetailsContext} from "../../context/useProductDetailsContext"
import ProductForm from "./ProductForm"
import {ProductFormValues} from "./ProductFormConfig"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import {MountTracker} from "@/presentation/analytics/MountTracker";

type Props = {
    productVariation: ProductVariation
    className?: string
}

const ProductFormContainer = ({ productVariation, className }: Props) => {
    const { isLogged } = useSession()
    const { addProductToCart, rootCategory } = useProductDetailsContext()
    const { track } = useAnalytics();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (values: ProductFormValues) => {
        if (!isLogged) {
            dispatch(openAuthModal())
            return
        }

        const { quantity, points, coins, paymentType } = values

        setIsLoading(true)
        await addProductToCart({
            quantity: quantity,
            points: points,
            coins: coins,
            paymentType: paymentType,
        })
        track(EventName.ADDED_PRODUCT, {product: productVariation.product, category: rootCategory, pointsAmount: points});
        setIsLoading(false)
    }

    return (
        <>
            {rootCategory
                &&
                <MountTracker
                    name={EventName.VIEWED_PRODUCT}
                    payload={{category: rootCategory, product: productVariation.product}}
                />
            }
            <ProductForm
                productVariation={productVariation}
                className={className}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </>
    )
}

export default ProductFormContainer