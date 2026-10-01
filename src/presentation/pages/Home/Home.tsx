import { Suspense } from "react";
import ExchangeSteps from "./components/ExchangeSteps";
import HomeBannerCarouselPreloader from "./components/HomeBannerCarousel/components/HomeBannerCarouselPreloader";
import HomeFaqs from "./components/HomeFaqs";
import HomeFaqsSkeleton from "./components/HomeFaqs/HomeFaqsSkeleton";
import HomeRedemptionsCategories from "./components/HomeRedemptionCategories";
import HomeRedemptionCategoriesSkeleton from "./components/HomeRedemptionCategories/components/HomeRedemptionCategoriesSkeleton";
import HowPMEWorks from "./components/HowPMEWorks";
import HomeFeaturedRewards from "./components/HomeFeaturedRewards";
import HomeFeaturedRewardsSkeleton from "./components/HomeFeaturedRewards/componenets/HomeFeaturedRewardsSkeleton";
import HomeDeferred from "./components/HomeDeferred";

const Home = () => {
    return (
        <main className="flex flex-col h-full w-full min-h-screen">
            <Suspense fallback={null}>
                <HomeDeferred />
            </Suspense>
            <HomeBannerCarouselPreloader />
            <HowPMEWorks />
            <Suspense fallback={<HomeRedemptionCategoriesSkeleton />}>
                <HomeRedemptionsCategories />
            </Suspense>
            <Suspense fallback={<HomeFeaturedRewardsSkeleton />}>
                <HomeFeaturedRewards />
            </Suspense>
            <ExchangeSteps />
            <Suspense fallback={<HomeFaqsSkeleton />}>
                <HomeFaqs />
            </Suspense>
        </main>
    );
};



export default Home;