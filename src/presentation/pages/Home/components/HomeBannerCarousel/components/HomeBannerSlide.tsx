import { Banner } from "@/domain/entity/Banner/banner";
import BannerSlideImage from "./BannerSlideImage";
import BannerSlideOverlay from "./BannerSlideOverlay";

type Props = {
    banner: Banner;
    containerClassName?: string;
    imageHeight?: number;
    imageBreakpoint?: number;
    priority?: boolean;
    fetchPriority?: "high" | "auto";
    skipPreload?: boolean;
    overlayInnerClassName?: string;
    textWrapperClassName?: string;
    TitleComponent?: "h1" | "h2";
    titleClassName?: string;
    titleContainerClassName?: string;
}

const HomeBannerSlide = ({
    banner,
    containerClassName = "relative h-150 sm:h-120",
    imageHeight = 600,
    imageBreakpoint = 640,
    priority,
    fetchPriority = "auto",
    skipPreload,
    overlayInnerClassName,
    textWrapperClassName,
    TitleComponent = "h2",
    titleClassName,
    titleContainerClassName,
}: Props) => {
    return (
        <div className={`home-banner-slide ${containerClassName}`}>
            <BannerSlideImage
                banner={banner}
                imageHeight={imageHeight}
                imageBreakpoint={imageBreakpoint}
                priority={priority}
                fetchPriority={fetchPriority}
                skipPreload={skipPreload}
            />
            <BannerSlideOverlay
                banner={banner}
                overlayInnerClassName={overlayInnerClassName}
                textWrapperClassName={textWrapperClassName}
                TitleComponent={TitleComponent}
                titleClassName={titleClassName}
                titleContainerClassName={titleContainerClassName}
            />
        </div>
    );
};

export default HomeBannerSlide;
