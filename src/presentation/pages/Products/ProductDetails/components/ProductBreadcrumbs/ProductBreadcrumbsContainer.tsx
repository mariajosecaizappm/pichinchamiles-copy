// ProductBreadcrumbsContainer.tsx
import { ProductCategory } from "@/domain/entity/Product/product";
import { CategoryGroup } from "@/domain/entity/Category/structure/category";
import Categorization from "@/domain/entity/Category/models/Categorization";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import getCategorization from "../../../lib/getCategorization";

type Props = {
    categories: ProductCategory[];
    productName: string;
}


const resolveOrderedChain = (categories: ProductCategory[], categorization: Categorization): CategoryGroup[] => {
    const taxonomyCategories = categories
        .map(category => categorization.getCategoryGroupBySlug(category.slug))
        .filter(Boolean) as CategoryGroup[];
        
    if (!taxonomyCategories.length) {
        return [];
    }

    const getDepth = (slug: string): number => {
        let depth = 0;
        let current = slug;

        while (categorization.getParentSlug(current)) {
            depth++;
            current = categorization.getParentSlug(current)!;
        }

        return depth;
    };
    const deepestCategory = taxonomyCategories.reduce((deepest, current) => {
        return getDepth(current.slug) > getDepth(deepest.slug)
            ? current
            : deepest;
    }, taxonomyCategories[0]);

    const chain: CategoryGroup[] = [];

    let current: CategoryGroup | null = deepestCategory;

    while (current) {
        chain.unshift(current);

        const parentSlug = categorization.getParentSlug(current.slug);

        current = parentSlug
            ? categorization.getCategoryGroupBySlug(parentSlug)
            : null;
    }

    return chain;


}

const ProductBreadcrumbsContainer = async ({ categories, productName }: Props) => {
    const categorization = await getCategorization();
    const orderedCategories = resolveOrderedChain(categories, categorization);

    return (
        <ProductBreadcrumbs categories={orderedCategories} productName={productName} />
    );
};

export default ProductBreadcrumbsContainer;