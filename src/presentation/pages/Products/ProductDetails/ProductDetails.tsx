import { Product, ProductVariation } from "@/domain/entity/Product/product";
import DocumentTitle from "@/presentation/components/Layout/DocumentTitle";
import { Divider } from "@heroui/react";
import { Suspense } from "react";
import DescriptionAccordion from "./components/DescriptionAccordion";
import OrderNotice from "./components/OrderNotice";
import ProductBreadcrumbs from "./components/ProductBreadcrumbs";
import ProductBreadcrumbsSkeleton from "./components/ProductBreadcrumbs/ProductBreadcrumbsSkeleton";
import ProductGallery from "./components/ProductGallery";
import ProductMeta from "./components/ProductMeta";
import ProductPrice from "./components/ProductPrice/ProductPrice";
import ProductSearchToolbar from "./components/ProductSearchToolbar/ProductSearchToolbar";
import RelatedProducts from "./components/RelatedProducts";
import ProductDetailsProvider from "./context/ProductDetailsProvider";
import ProductForm from "./components/ProductForm";

type Props = {
    productVariation: ProductVariation;
    relatedProducts?: Product[];
}

const ProductDetails = ({ productVariation, relatedProducts = [] }: Props) => {
    const { product } = productVariation;
    return (
        <ProductDetailsProvider productVariation={productVariation}>
            <DocumentTitle title={product.name} />
            <div className="py-3 lg:py-6">
                <div className="body-container">
                    <ProductSearchToolbar />
                </div>
                <div className="lg:body-container py-3">
                    <div className="mb-4 max-lg:body-container">
                        <Suspense fallback={
                            <ProductBreadcrumbsSkeleton />
                        }>
                            <ProductBreadcrumbs categories={product.categories} productName={product.name} />
                        </Suspense>
                    </div>

                    {/* Layout: single column on mobile, two columns on desktop */}
                    <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
                        {/* Left col: gallery + description (desktop only wrapper) */}
                        <div className="lg:w-1/2 lg:shrink-0 lg:flex lg:flex-col lg:gap-6">
                            <ProductGallery productName={product.name} />
                            {/* Description: visible only on desktop here */}
                            <div className="hidden lg:block">
                                <DescriptionAccordion description={product.description} contentClassName="[&>div]:text-grayscale-400 [&_a]:text-information-500" />
                            </div>
                        </div>

                        <div className="space-y-5 pt-3 lg:self-start max-lg:body-container">
                            <div className="space-y-4 lg:flex-1 ">
                                <h1 className="text-[22px] font-semibold leading-7 text-blue-500 lg:text-[32px] lg:leading-[38px]">{product.name}</h1>
                                <ProductMeta brand={product.brand} />
                                <ProductPrice basePrice={product.minPointsPrice} previousPrice={product.unitPointsPriceWithoutDiscount} />
                                <div className="py-2 lg:hidden">
                                    <Divider className="bg-darkGrayishBlue-300" />
                                </div>
                            </div>
                            <ProductForm productVariation={productVariation} className="pt-2" />
                            <div className="lg:hidden pt-4">
                                <div className="border-b border-darkGrayishBlue-300 px-4">
                                    <DescriptionAccordion description={product.description} contentClassName="[&>div]:text-grayscale-400 [&_a]:text-information-500" />
                                </div>
                            </div>
                            <OrderNotice />
                        </div>
                    </div>
                </div>
                <div className="lg:body-container">
                    <RelatedProducts products={relatedProducts} />
                </div>
            </div>
        </ProductDetailsProvider>
    );
};

export default ProductDetails;