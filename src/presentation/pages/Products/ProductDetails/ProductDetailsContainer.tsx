import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetProductDetailsUseCase from "@/domain/interactors/Products/GetProductDetailsUseCase";
import GetRelatedProductsUseCase from "@/domain/interactors/Products/GetRelatedProductsUseCase";
import container from "@/presentation/config/inversify.config";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

type Props = {
    slug: string;
}

const ProductDetailsContainer = async ({ slug }: Props) => {

    const getProductDetailUseCase = container.get<GetProductDetailsUseCase>(UseCaseTypes.GetProductDetailsUseCase);
    const getRelatedProductsUseCase = container.get<GetRelatedProductsUseCase>(UseCaseTypes.GetRelatedProductsUseCase);

    const productVariation = await getProductDetailUseCase.getProductDetails(slug);

    if (!productVariation.product) {
        notFound()
    }

    const categoryId = productVariation.product.categories[0]?.id;
    const relatedProducts = categoryId
        ? await getRelatedProductsUseCase.getRelatedProducts(productVariation.product.id, categoryId)
        : [];

    return (
        <ProductDetails productVariation={productVariation} relatedProducts={relatedProducts} />
    );
};

export default ProductDetailsContainer;