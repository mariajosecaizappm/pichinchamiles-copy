"use client"


import { ProductVariation } from "@/domain/entity/Product/product"
import { DiscountStatus, Variation, VariationFeature } from "@/domain/entity/Product/variation"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import AddProductToCartUseCase from "@/domain/interactors/Products/AddProductToCartUseCase"
import container from "@/presentation/config/inversify.config"
import useSession from "@/presentation/hooks/useSession"
import useSnackbar from "@/presentation/hooks/useSnackbar"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ProductFormValues } from "../components/ProductForm/ProductFormConfig"
import { ProductDetailsContext, ProductDetailsContextType } from "./ProductDetailsContext"
import { ErrorSnackbarIcon, ErrorSnackbarFooter, SuccessSnackbarFooter, SuccessSnackbarIcon, ErrorSnackbarContent, SuccessSnackbarContent } from "../components/ProductForm/components/Snackbar"
import links from "@/presentation/config/links";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";


type Props = {
    children: React.ReactNode
    productVariation: ProductVariation
}

const renderErrorSnackbarFooter = (close: () => void) => <ErrorSnackbarFooter close={close} />

const ProductDetailsProvider = ({ children, productVariation }: Props) => {

    const [variation, setVariation] = useState<Variation | null>(null)
    const [selectedFeatures, setSelectedFeatures] = useState<Array<{ name: string, option: string | null }>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [rootCategory, setRootCategory] = useState("")
    const addProductToCartUseCase = container.get<AddProductToCartUseCase>(UseCaseTypes.AddProductToCartUseCase)
    const { updateBasket, programCurrency } = useSession()
    const { addSnackbar } = useSnackbar()
    const router = useRouter()
    const { track } = useAnalytics()


    const displayErrorSnackbar = useCallback(() => {
        addSnackbar({
            icon: ErrorSnackbarIcon,
            content: <ErrorSnackbarContent />,
            footer: renderErrorSnackbarFooter,
        })
    }, [addSnackbar])

    const renderSuccessSnackbarFooter = useCallback((close: () => void) => (
        <SuccessSnackbarFooter
            close={close}
            onGoToCart={() => {
                track(EventName.GO_TO_CHECKOUT, {category: rootCategory})
                router.push(links.checkout)
            }}
        />
    ), [router, rootCategory, track])

    const onAddProduct = useCallback(async (values: Omit<ProductFormValues, 'features'>) => {
        try {
            if (variation && programCurrency) {
                const basket = await addProductToCartUseCase.addProduct({
                    product: productVariation.product,
                    variation,
                    coinsCurrencyId: programCurrency.coinsCurrencyId,
                    pointsCurrencyId: programCurrency.pointsCurrencyId,
                    quantity: values.quantity,
                    points: values.points,
                    coins: values.coins,
                    paymentType: values.paymentType,
                })
                updateBasket(basket)
                addSnackbar({
                    icon: SuccessSnackbarIcon,
                    content: <SuccessSnackbarContent />,
                    footer: renderSuccessSnackbarFooter,
                })
            } else {
                displayErrorSnackbar()
            }
        } catch {
            displayErrorSnackbar()
        }

    }, [addProductToCartUseCase, productVariation.product, variation, programCurrency, updateBasket, addSnackbar, displayErrorSnackbar, renderSuccessSnackbarFooter])

    const pointsPrice = useMemo((): number => {
        return variation?.pointsPrice ?? productVariation.product.minPointsPrice
    }, [variation, productVariation.product.minPointsPrice])

    const hasDiscount = useMemo((): boolean => {
        if (!variation) return false
        return variation.discountStatus === DiscountStatus.ACTIVE
            && Boolean(variation.discountValidTo && new Date(variation.discountValidTo) > new Date())
            && Boolean(variation.discountValue)
    }, [variation])

    const assets = useMemo(() => {
        const productAssets = variation && variation.assets.length > 0 ? variation.assets : productVariation.product.assets;
        const video = productAssets.find(asset => asset.type === "video");
        const images = productAssets.filter(asset => asset.type !== "video").sort((a, b) => {
            if (a.order < b.order) {
                return -1;
            }
            if (a.order > b.order) {
                return 1;
            }
            return 0;
        })
        return video ? [...images, video] : images
    }, [productVariation, variation]);

    const getTags = useCallback(() => {
        if (productVariation.variations.length > 0) {
            if (!variation) return null;

            const { tags, discountTag, discountTagBackgroundColor, discountTagTextColor } = variation;

            if (hasDiscount && discountTag && discountTagTextColor && discountTagBackgroundColor) {
                return [{
                    tag: discountTag,
                    backgroundColor: discountTagBackgroundColor,
                    textColor: discountTagTextColor
                }, ...tags]
            }

            return tags.length > 0 ? tags : null;
        }

        const productTags = productVariation.product.tags ?? [];
        return productTags.length > 0 ? productTags : null;
    }, [productVariation, variation, hasDiscount]);

    const tags = useMemo(() => {
        const sourceTags = getTags() ?? [];

        return sourceTags.filter((tag, index, self) =>
            index === self.findIndex(t => t.tag === tag.tag)
        );
    }, [getTags]);

    const minCopaymentPoints = useMemo(() => {
        if (!variation?.copayment) return 0;
        return variation.copayment.minimumPointsValue
    }, [variation]);

    const initializeVariation = useCallback(() => {
        if (productVariation.variations.length > 0 && !variation) {
            setVariation(productVariation.variations[0]);
        }
    }, [productVariation.variations, variation, setVariation]);

    useEffect(() => {
        initializeVariation();
        setIsLoading(false);
    }, [initializeVariation]);

    useEffect(() => {
        if (!variation) return
        setSelectedFeatures(variation.features.map(feature => ({ name: feature.name, option: feature.option })))
    }, [variation])


    const matchesSelectedFeatures = useCallback((variationFeatures: VariationFeature[]) => {
        return variationFeatures.every((vf) =>
            selectedFeatures.some((sf) => sf.name === vf.name && sf.option === vf.option)
        );
    }, [selectedFeatures]);

    useEffect(() => {
        if (selectedFeatures.length === 0) return;
        const matchedVariation = productVariation.variations.find((v) =>
            matchesSelectedFeatures(v.features)
        );
        if (matchedVariation && matchedVariation.id !== variation?.id) {
            setVariation(matchedVariation);
        } else if (!matchedVariation) {
            setVariation(null);
        }
    }, [selectedFeatures, productVariation.variations, variation, setVariation, matchesSelectedFeatures]);


    const hasVariants = productVariation.variations.length > 0

    const contextValue: ProductDetailsContextType = useMemo(() => ({
        tags,
        assets,
        variation,
        setVariation,
        selectedFeatures,
        setSelectedFeatures,
        isLoading,
        hasDiscount,
        hasVariants,
        pointsPrice,
        minCopaymentPoints,
        rootCategory,
        setRootCategory,
        addProductToCart: onAddProduct
    }), [
        tags,
        assets,
        variation,
        selectedFeatures,
        isLoading,
        hasDiscount,
        hasVariants,
        pointsPrice,
        minCopaymentPoints,
        rootCategory,
        onAddProduct
    ]);

    return (
        <ProductDetailsContext.Provider value={contextValue}>
            {children}
        </ProductDetailsContext.Provider>
    )
}

export default ProductDetailsProvider
