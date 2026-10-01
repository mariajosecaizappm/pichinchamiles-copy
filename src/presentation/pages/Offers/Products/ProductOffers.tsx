import OffersNavbar from "@/presentation/pages/Offers/components/navbar/OffersNavbar/OffersNavbar"
import ProductOffersCampaings from "./components/Campaigns"
import {ProductOffer} from "@/domain/entity/Offer/offer";
import {Banner} from "@/domain/entity/Banner/banner";
import {FC} from "react";
import ProductOfferBanner from "@/presentation/pages/Offers/Products/components/ProductOfferBanner";
import ProductOfferPromotionBanners from "@/presentation/pages/Offers/Products/components/ProductOfferPromotionBanners";

type ProductOffersProps = {
    offers: ProductOffer[]
    banners: Banner[]
}

const ProductOffers: FC<ProductOffersProps> = ({offers, banners}) => {
    return (
        <div>
            <ProductOfferBanner banners={banners}/>
            <OffersNavbar />
            <ProductOfferPromotionBanners banners={banners}/>
            <ProductOffersCampaings offers={offers}/>
        </div>
    )
}

export default ProductOffers