"use client";

import { Banner } from "@/domain/entity/Banner/banner";
import BannerCarousel from "./components/BannerCarousel";
import HomeBanner from "./components/HomeBanner";

interface Props {
  banners: Banner[];
}

const HomeBannerCarousel = ({ banners }: Props) => {
    if (banners.length === 0) {
        return null;
    }

    return (
        <BannerCarousel
            banners={banners}
            renderBanner={(banner, isMainBanner) => <HomeBanner banner={banner} isMainBanner={isMainBanner} />}
        />
    );
};

export default HomeBannerCarousel;
