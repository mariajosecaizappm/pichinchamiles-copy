"use client"

import { useMemo } from "react";
import { Banner } from "@/domain/entity/Banner/banner";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import useSession from "@/presentation/hooks/useSession";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MarketingBanners from "../../../Products/Banners/MarketingBanners";


const BodyBanners = ({
    banners
}: {
    banners: Banner[]
}) => {
    const { isLogged } = useSession()

    const filteredBanners = useMemo(() => {
        const position = isLogged ? MarketingPositions.HOME_UV_AUTH_BODY_BANNERS : MarketingPositions.HOME_UV_GUEST_BODY_BANNERS
        return banners.filter((banner) => banner.positions.includes(position))
    }, [banners, isLogged])

    if (filteredBanners.length === 0) {
        return null
    }

    return (
        <div className="p-6 w-full max-w-330 mx-auto">
            <MarketingBanners banners={filteredBanners} />
        </div>
    )
};

export default BodyBanners;