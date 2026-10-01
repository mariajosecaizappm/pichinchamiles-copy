import { Banner } from "@/domain/entity/Banner/banner";
import AssetImage from "@/presentation/components/AssetImage";

const DEFAULT_MOBILE_GRADIENT =
    "linear-gradient(180deg, rgba(15, 38, 92, 0.43) 23.92%, rgba(255, 251, 229, 0.00) 40.66%, rgba(0, 0, 0, 0.34) 92.28%)";
const DEFAULT_DESKTOP_GRADIENT =
    "linear-gradient(270deg, rgba(255, 255, 255, 0.00) 29.81%, rgba(0, 0, 0, 0.20) 60%)";

type Props = {
    banner: Banner;
    imageHeight?: number;
    imageBreakpoint?: number;
    priority?: boolean;
    fetchPriority?: "high" | "auto";
    skipPreload?: boolean;
    mobileGradient?: string;
    mobileGradientClassName?: string;
    desktopGradient?: string;
    desktopGradientClassName?: string;
}

const BannerSlideImage = ({
    banner,
    imageHeight = 600,
    imageBreakpoint = 640,
    priority,
    fetchPriority = "auto",
    skipPreload,
    mobileGradient = DEFAULT_MOBILE_GRADIENT,
    mobileGradientClassName = "absolute inset-0 top-0 left-0 sm:hidden",
    desktopGradient = DEFAULT_DESKTOP_GRADIENT,
    desktopGradientClassName = "absolute inset-0 top-0 left-0 hidden sm:block",
}: Props) => {
    return (
        <>
            <AssetImage
                asset={banner.image}
                alt={banner.title}
                width={1920}
                height={imageHeight}
                breakpoint={imageBreakpoint}
                priority={priority}
                fetchPriority={fetchPriority}
                skipPreload={skipPreload}
                sizes="100vw"
                className="w-full h-full object-cover"
            />
            <div
                aria-hidden="true"
                style={{ background: mobileGradient }}
                className={mobileGradientClassName}
            />
            <div
                aria-hidden="true"
                style={{ background: desktopGradient }}
                className={desktopGradientClassName}
            />
        </>
    );
};

export default BannerSlideImage;
