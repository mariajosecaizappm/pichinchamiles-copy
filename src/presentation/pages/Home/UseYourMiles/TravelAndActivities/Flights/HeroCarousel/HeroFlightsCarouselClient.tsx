"use client"

import { useMemo } from "react";
import { Banner } from "@/domain/entity/Banner/banner";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import useSession from "@/presentation/hooks/useSession";
import BannerCarousel from "@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerCarousel";
import HeroBannerItem from "../../../Products/HeroCarousel/HeroBannerItem";

type Props = {
    banners: Banner[];
}

const HeroFlightsCarouselClient = ({ banners }: Props) => {
    const { isLogged } = useSession()

    const filteredBanners = useMemo(() => {
        const position = isLogged ? MarketingPositions.HOME_UV_AUTH_BANNER_TOP : MarketingPositions.HOME_UV_GUEST_BANNER_TOP
        return banners.filter((banner) => banner.positions.includes(position))
    }, [banners, isLogged])

    if (filteredBanners.length === 0) {
        return null;
    }

    return <BannerCarousel
        banners={filteredBanners}
        renderBanner={(banner) => <HeroBannerItem banner={banner} />}
    />
};

export default HeroFlightsCarouselClient;
