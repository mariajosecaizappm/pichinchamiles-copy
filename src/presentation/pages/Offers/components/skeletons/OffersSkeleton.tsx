import HomeBannerCarouselSkeleton from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton"
import OffersNavbarSkeleton from "./OffersNavbarSkeleton"
import PromotionCardsSkeleton from "../../Products/components/Promotions/PromotionCardsSkeleton"
import OfferCampaignSkeleton from "./OfferCampaignSkeleton"

const OffersSkeleton = () => {
    return (
        <div>
            <HomeBannerCarouselSkeleton className="h-40 sm:h-77.5" />
            <OffersNavbarSkeleton />
            <PromotionCardsSkeleton />
            <div className="lg:bg-neutral-50">
                <div className="body-container py-4 overflow-hidden">
                    <OfferCampaignSkeleton />
                </div>
            </div>
            <div className="body-container py-4 overflow-hidden">
                <OfferCampaignSkeleton />
            </div>
        </div>
    )
}

export default OffersSkeleton