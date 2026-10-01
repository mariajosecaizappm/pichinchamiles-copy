import HomeBannerCarouselSkeleton from "../HomeBannerCarousel/HomeBannerCarouselSkeleton";
import HomeFaqsSkeleton from "../HomeFaqs/HomeFaqsSkeleton";
import HomeFeaturedRewardsSkeleton from "../HomeFeaturedRewards/componenets/HomeFeaturedRewardsSkeleton";
import HomeRedemptionCategoriesSkeleton from "../HomeRedemptionCategories/components/HomeRedemptionCategoriesSkeleton";

const HomeSkeleton = () => {
    return (
        <div className="flex flex-col h-full w-full min-h-screen">
            <HomeBannerCarouselSkeleton />
            <HomeRedemptionCategoriesSkeleton />
            <HomeFeaturedRewardsSkeleton />
            <HomeFaqsSkeleton />
        </div>
    )
};

export default HomeSkeleton;