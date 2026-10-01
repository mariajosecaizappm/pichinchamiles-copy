"use client";

import { Banner } from "@/domain/entity/Banner/banner";
import BannerCarousel from "../../../components/HomeBannerCarousel/components/BannerCarousel";
import HeroBannerItem from "./HeroBannerItem";
import useSession from "@/presentation/hooks/useSession";
import { useMemo } from "react";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";


type Props = {
    banners: Banner[];
}

const HeroProductsCarousel = ({ banners }: Props) => {
    const { isLogged } = useSession()

    const filteredBanners = useMemo(() => {
        const position = isLogged ? MarketingPositions.HOME_LOGGED_MAIN_SLIDER : MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER;
        return banners.filter(banner => banner.positions.includes(position));
    }, [banners, isLogged]);

    return <BannerCarousel
        banners={filteredBanners}
        renderBanner={(banner) => <HeroBannerItem banner={banner} />}
    />;
};

export default HeroProductsCarousel;