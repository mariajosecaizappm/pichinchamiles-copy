import HomeBannerCarouselSkeleton from "../../components/HomeBannerCarousel/HomeBannerCarouselSkeleton";
import NewItemsForYouSkeleton from "../../components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYouSkeleton";
import OffersSkeleton from "../../components/HomeExploreProducts/components/Offers/OffersSkeleton";
import BodyBannersSkeleton from "../TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton";

const HomeProductsSkeleton = () => {
    return (
        <>
            <HomeBannerCarouselSkeleton className="h-112.5 md:h-77.5"/>
            <NewItemsForYouSkeleton />
            <OffersSkeleton />
            <BodyBannersSkeleton />
        </>
    );
};

export default HomeProductsSkeleton;