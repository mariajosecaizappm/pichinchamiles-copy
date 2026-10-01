"use client"

import { Banner } from "@/domain/entity/Banner/banner"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetOffersBannerUseCase from "@/domain/interactors/Offers/GetOffersBannerUseCase"
import container from "@/presentation/config/inversify.config"
import useSession from "@/presentation/hooks/useSession"
import HomeBannerCarouselSkeleton from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton"
import { useQuery } from "@tanstack/react-query"
import OffersBanner from "./OffersBanner"

type Props = {
    type: "products" | "activities"
}

const OffersBannerContainer = ({ type }: Props) => {
    const { isLogged } = useSession()

    const getOffersContentUseCase = container.get<GetOffersBannerUseCase>(
        UseCaseTypes.GetOffersBannerUseCase,
    )

    const { data, isLoading, error } = useQuery({
        queryKey: ["top-banner", type, isLogged],
        queryFn: async () => {
            return getOffersContentUseCase.getTopBanner(isLogged, type);
        },
    })

    if (isLoading || error) {
        return <HomeBannerCarouselSkeleton className="h-40 sm:h-77.5" />;
    }

    if(data?.pagination.total === 0) {
        return null;
    }

    const banner = data?.data.at(0) ?? {} as Banner;

    return (
        <OffersBanner banner={banner} />
    )
}

export default OffersBannerContainer