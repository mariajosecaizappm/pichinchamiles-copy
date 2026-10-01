import { unstable_cache } from "next/cache";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { Banner } from "@/domain/entity/Banner/banner";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetHomeContentUseCase from "@/domain/interactors/Home/GetHomeContentUseCase";
import container from "@/presentation/config/inversify.config";
import BannerCarouselShell from "@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerCarouselShell";
import HomeBannerSlide from "@/presentation/pages/Home/components/HomeBannerCarousel/components/HomeBannerSlide";
import HomeBannerCarouselSkeleton from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton";

const IMAGE_HEIGHT = 600;
const IMAGE_BREAKPOINT = 640;

const getCachedBanners = unstable_cache(
    async () => {
        const getHomeContentUseCase = container.get<GetHomeContentUseCase>(
            UseCaseTypes.GetHomeContentUseCase,
        );
        return getHomeContentUseCase.getBanners();
    },
    ["home-main-banners"],
    { revalidate: 60, tags: ["home-main-banners"] },
);

export const preloadHeroImage = (banner: Banner) => {
    if (typeof window !== "undefined") {
        return;
    }

    const common = {
        alt: banner.title,
        width: 1920,
        height: IMAGE_HEIGHT,
        loading: "eager" as const,
        fetchPriority: "high" as const,
        sizes: "100vw",
        decoding: "async" as const,
    };

    const { props: { src: desktopSrc, srcSet: desktopSrcSet } } = getImageProps({
        ...common,
        src: banner.image.desktopUrl,
    });

    const { props: { src: mobileSrc, srcSet: mobileSrcSet } } = getImageProps({
        ...common,
        src: banner.image.mobileUrl || banner.image.desktopUrl,
    });

    if (typeof mobileSrcSet === "string") {
        preload(mobileSrc, {
            as: "image",
            imageSrcSet: mobileSrcSet,
            imageSizes: common.sizes,
            media: `(max-width: ${IMAGE_BREAKPOINT}px)`,
            fetchPriority: "high",
        });
    }

    if (typeof desktopSrcSet === "string") {
        preload(desktopSrc, {
            as: "image",
            imageSrcSet: desktopSrcSet,
            imageSizes: common.sizes,
            media: `(min-width: ${IMAGE_BREAKPOINT + 0.1}px)`,
            fetchPriority: "high",
        });
    }
};

const HomeBannerCarouselContainer = async () => {
    try {
        const banners = await getCachedBanners();

        if (banners.data.length === 1) {
            return (
                <HomeBannerSlide
                    banner={banners.data[0]}
                    priority
                    fetchPriority="high"
                    skipPreload
                    TitleComponent="h1"
                />
            );
        }

        return (
            <BannerCarouselShell>
                {banners.data.map((banner, index) => (
                    <article
                        key={banner.id}
                        aria-label={`Diapositiva ${index + 1} de ${banners.data.length}: ${banner.title}`}
                        aria-roledescription="diapositiva"
                    >
                        <HomeBannerSlide
                            banner={banner}
                            priority={index === 0}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            skipPreload
                            TitleComponent={index === 0 ? "h1" : "h2"}
                        />
                    </article>
                ))}
            </BannerCarouselShell>
        );
    } catch {
        return <HomeBannerCarouselSkeleton />;
    }
};

export default HomeBannerCarouselContainer;
