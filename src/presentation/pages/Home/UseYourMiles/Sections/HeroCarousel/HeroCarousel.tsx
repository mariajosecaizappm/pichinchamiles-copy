"use client";

import { Banner } from "@/domain/entity/Banner/banner";
import BannerCarousel from "../../../components/HomeBannerCarousel/components/BannerCarousel";
import HomeBanner from "../../../components/HomeBannerCarousel/components/HomeBanner";

interface Props {
  banners: Banner[];
}

const HeroCarousel = ({ banners }: Props) => {
    return (
        <BannerCarousel
            banners={banners}
            renderBanner={(banner) => <HomeBanner banner={banner}
                titleContainerClassName="md:w-1/2" />}
        />
    );
};

export default HeroCarousel;
