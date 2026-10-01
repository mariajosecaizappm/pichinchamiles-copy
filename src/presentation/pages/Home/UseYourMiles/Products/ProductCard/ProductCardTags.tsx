import type { ProductTag } from "@/domain/entity/Product/product"
import clsx from "clsx"
import ProductCardTag from "./ProductCardTag"

type Props = {
    tags: ProductTag[]
    isProductsPage: boolean
}

const ProductCardTags = ({ tags, isProductsPage }: Props) => {
    if (!tags.length) {
        return null
    }

    return (
        <div
            className={clsx(
                "absolute z-10 flex flex-wrap justify-end gap-2",
                isProductsPage ? "right-2 top-2 lg:right-4 lg:top-4" : "right-4 top-4",
            )}
            aria-hidden="true"
        >
            {tags.map((tagItem) => (
                <ProductCardTag
                    key={tagItem.tag}
                    tag={tagItem.tag}
                    backgroundColor={tagItem.backgroundColor}
                    textColor={tagItem.textColor}
                />
            ))}
        </div>
    )
}

export default ProductCardTags
