"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetOffersPromoBannersUseCase from "@/domain/interactors/Offers/GetOffersPromoBannersUseCase"
import container from "@/presentation/config/inversify.config"
import useSession from "@/presentation/hooks/useSession"
import { useQuery } from "@tanstack/react-query"
import PromotionBanners from "./PromotionCards"
import PromotionCardsSkeleton from "./PromotionCardsSkeleton"

type Props = {
    type: "products" | "activities"
}

const PromotionBannersContainer = ({ type }: Props) => {
    const { isLogged } = useSession()

    const getOffersContentUseCase = container.get<GetOffersPromoBannersUseCase>(
        UseCaseTypes.GetOffersPromoBannersUseCase,
    )

    const { data, isLoading, error } = useQuery({
        queryKey: ["promotional-banners", type, isLogged],
        queryFn: async () => {
            return getOffersContentUseCase.getPromotionBanners(isLogged, type);
        },
    })

    if (isLoading || error) {
        return <PromotionCardsSkeleton />;
    }

    if(data?.pagination.total === 0) {
        return null;
    }

    return (
        <PromotionBanners banners={data?.data ?? []}/>
    )
}

export default PromotionBannersContainer