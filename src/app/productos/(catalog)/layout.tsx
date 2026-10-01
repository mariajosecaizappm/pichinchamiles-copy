import ProductCategories from "@/presentation/pages/Home/UseYourMiles/Products/Categories"
import ProductCategoriesSkeleton from "@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton"
import Subcategories from "@/presentation/pages/Products/components/Categories/Subcategories"
import ProductsSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsSkeleton"
import ProductsBootstrap from "@/presentation/pages/Products/ProductsBootstrap"
import { Suspense } from "react"

export default function ProductsLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Suspense
            fallback={
                <ProductsSkeleton />
            }
        >
            <ProductsBootstrap>
                <div className="contents lg:block lg:w-full lg:sticky lg:top-[73px] lg:z-20 lg:bg-white lg:py-2">
                    <div className="mx-auto w-full max-w-330 md:px-4 lg:px-6">
                        <Suspense fallback={<ProductCategoriesSkeleton />}>
                            <ProductCategories
                                className="mx-auto w-full lg:max-w-[calc(100%-80px)]"
                                wrapperClassName="w-full"
                            />
                        </Suspense>
                    </div>
                    <Subcategories />
                </div>
                <main className="pb-6">{children}</main>
            </ProductsBootstrap>
        </Suspense>
    )
}
