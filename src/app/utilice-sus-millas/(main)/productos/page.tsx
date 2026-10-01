import type { Metadata } from "next"
import HomeProducts from "@/presentation/pages/Home/UseYourMiles/Products"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.productos

const HomeProductsPage = () => {
    return (
        <HomeProducts />
    );
}

export default HomeProductsPage;