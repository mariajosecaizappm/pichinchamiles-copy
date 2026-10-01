import { ProductCategory } from "@/domain/entity/Product/product";
import links from "@/presentation/config/links";

export const getCategoryHref = (categories: ProductCategory[], index: number): string => {
    const base = `${links.productsList}/categoria`;
    if(!categories || categories.length === 0) return links.productsList;
    if (index === 0) return `${base}/${categories[0]?.slug}`;
    if (index === 1) return `${base}/${categories[0]?.slug}/${categories[1]?.slug}`;
    return `${base}/${categories[0]?.slug}/${categories[1]?.slug}?subcategory=${categories[index]?.id}`;
}