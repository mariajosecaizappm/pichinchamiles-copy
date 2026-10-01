import ProductsProvider from "./context/ProductsProvider";
import getCategorization from "./lib/getCategorization";
import ProductsSkeleton from "./components/skeletons/ProductsSkeleton";

type Props = {
    children: React.ReactNode;
}

const ProductsBootstrap = async ({ children }: Props) => {
    try {
        const categorization = await getCategorization();

        return (
            <ProductsProvider categories={categorization.categories}>
                {children}
            </ProductsProvider>
        )
    } catch {
        return <ProductsSkeleton />
    }
}

export default ProductsBootstrap