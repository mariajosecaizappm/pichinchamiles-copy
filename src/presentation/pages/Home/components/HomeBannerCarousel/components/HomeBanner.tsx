import { Banner } from "@/domain/entity/Banner/banner";
import HomeBannerSlide from "./HomeBannerSlide";

type Props = {
    banner: Banner;
    titleClassName?: string;
    titleContainerClassName?: string;
    isMainBanner?: boolean;
    skipPreload?: boolean;
}

const HomeBanner = ({ banner, titleClassName, titleContainerClassName, isMainBanner, skipPreload }: Props) => {
    const TitleComponent = isMainBanner ? "h1" : "h2";
    return (
        <HomeBannerSlide
            banner={banner}
            TitleComponent={TitleComponent}
            priority={isMainBanner}
            fetchPriority={isMainBanner ? "high" : "auto"}
            skipPreload={skipPreload}
            titleClassName={titleClassName}
            titleContainerClassName={titleContainerClassName}
        />
    );
};

export default HomeBanner;