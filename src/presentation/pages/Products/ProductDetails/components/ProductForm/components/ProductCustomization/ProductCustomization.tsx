
"use client"

import { ProductFeature } from "@/domain/entity/Product/product";
import ProductQuantity from "../../../ProductQuantity/ProductQuantity";
import ProductVariantSelector from "../../../ProductVariants/ProductVariantSelector";
import { useProductDetailsContext } from "../../../../context/useProductDetailsContext";
import Alert from "@/presentation/components/Alert";
import { useEffect, useState } from "react";

type Props = {
    features: ProductFeature[]
}

const ProductCustomization = ({ features }: Props) => {
    const { variation, isLoading } = useProductDetailsContext()
    const [lastChangedFeature, setLastChangedFeature] = useState<string | null>(null)

    useEffect(() => {
        if (variation) setLastChangedFeature(null)
    }, [variation])

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                {features.map((feature) => (
                    <ProductVariantSelector key={feature.id} feature={feature} isInvalid={!variation && lastChangedFeature === feature.name} onChanged={() => setLastChangedFeature(feature.name)}/>
                ))}
            </div>
            {
                !isLoading && !variation ? (
                    <Alert variant="warning" className="items-center">Esta selección no se encuentra disponible.</Alert>
                ) : null
            }
            <div className="w-1/2 lg:w-min pr-1 lg:pr-0">
                <ProductQuantity countClassName="lg:min-w-15" max={10} />
            </div>
        </div>
    );
};

export default ProductCustomization;