import { Category } from "@/domain/entity/Category/structure/category";
import getCategorization from "@/presentation/pages/Products/lib/getCategorization";
import ProductCategories from "./ProductCategories";
import ProductCategoriesSkeleton from "./ProductCategoriesSkeleton";

type Props = {
    className?: string;
    wrapperClassName?: string;
}

const ProductCategoriesContainer = async ({
    className,
    wrapperClassName,
}: Props) => {
    try {
        const categorization = await getCategorization();

        return (
            <ProductCategories
                categories={categorization.categoryGroups as Category[]}
                className={className}
                wrapperClassName={wrapperClassName}
            />
        );
    } catch {
        return <ProductCategoriesSkeleton />
    }

};

export default ProductCategoriesContainer;