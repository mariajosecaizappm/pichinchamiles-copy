"use client"

import HeroBannersCarouselSkeleton from "../../Products/HeroCarousel/HeroBannersCarouselSkeleton"
import BodyBannersSkeleton from "../Flights/BodyBanners/BodyBannersSkeleton"
import FeaturedItemsSkeleton from "../Flights/Featured/FeaturedItemsSkeleton"
import TravelDealsSkeleton from "../Flights/TravelDeals/TravelDealsSkeleton"

const UltraViajesSkeleton = () => {
    return (
        <>
            <HeroBannersCarouselSkeleton />
            <FeaturedItemsSkeleton />
            <TravelDealsSkeleton />
            <BodyBannersSkeleton />
        </>
    )
}

export default UltraViajesSkeleton