import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import type { Banner } from "@/domain/entity/Banner/banner";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetHomeContentUseCase from "@/domain/interactors/Home/GetHomeContentUseCase";
import container from "@/presentation/config/inversify.config";
import HomeBannerCarouselContainer, {
    preloadHeroImage,
} from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselContainer";
import HomeBannerCarouselSkeleton from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton";
import HomeBanner from "./HomeBanner";

const getCachedMainBanner = unstable_cache(
    async (): Promise<Banner | null> => {
        const getHomeContentUseCase = container.get<GetHomeContentUseCase>(
            UseCaseTypes.GetHomeContentUseCase,
        );
        return getHomeContentUseCase.getMainBanner();
    },
    ["home-main-banner-first"],
    { revalidate: 60, tags: ["home-main-banner-first"] },
);

const HomeBannerCarouselPreloader = async () => {
    let banner: Banner | null = null;
    try {
        banner = await getCachedMainBanner();
        if (banner) {
            preloadHeroImage(banner);
        }
    } catch {
        // Preloading is best-effort; do not block the page shell on failure.
    }

    return (
        <Suspense
            fallback={
                banner ? (
                    <HomeBanner banner={banner} isMainBanner skipPreload />
                ) : (
                    <HomeBannerCarouselSkeleton className="h-150 sm:h-120" />
                )
            }
        >
            <HomeBannerCarouselContainer />
        </Suspense>
    );
};

export default HomeBannerCarouselPreloader;
