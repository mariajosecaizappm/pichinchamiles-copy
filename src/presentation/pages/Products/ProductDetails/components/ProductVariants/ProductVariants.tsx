"use client"

import { ProductFeature } from "@/domain/entity/Product/product";
import ProductVariantSelector from "./ProductVariantSelector";

type Props = {
    features: ProductFeature[]
}

const ProductVariants = ({ features }: Props) => {
    return (
        <div className="py-3 space-y-5">
            <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                    <ProductVariantSelector key={feature.id} feature={feature} />
                ))}
            </div>
        </div>
    );
};

export default ProductVariants;