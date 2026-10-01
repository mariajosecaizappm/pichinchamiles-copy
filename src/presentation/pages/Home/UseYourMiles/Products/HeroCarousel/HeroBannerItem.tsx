import { Banner } from "@/domain/entity/Banner/banner";
import BannerSlide from "@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerSlide";

type Props = {
    banner: Banner
}

const HeroBannerItem = ({ banner }: Props) => (
    <BannerSlide
        banner={banner}
        containerClassName="relative h-112.5 md:h-77.5"
        imageHeight={620}
        imageBreakpoint={768}
        priority={true}
        fetchPriority="high"
        overlayInnerClassName="absolute inset-0 p-6 md:flex justify-start items-center"
        textWrapperClassName="flex flex-col gap-4 z-10 py-5 relative md:text-start w-full max-w-[978px] mx-auto"
        titleContainerClassName="lg:2/3"
        mobileGradient="linear-gradient(180deg, rgba(15, 38, 92, 0.65) 23.58%, rgba(255, 251, 229, 0.00) 53.26%)"
        mobileGradientClassName="absolute inset-0 top-0 left-0 md:opacity-0"
        desktopGradientClassName="absolute inset-0 top-0 left-0 hidden md:block"
    />
);

export default HeroBannerItem;