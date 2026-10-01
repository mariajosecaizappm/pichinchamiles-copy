import React from 'react';
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetActivityOffersUseCase from "@/domain/interactors/Offers/GetActivityOffersUseCase";
import ActivityOffers from "@/presentation/pages/Offers/Activities/ActivityOffers";
import OffersSkeleton from "@/presentation/pages/Offers/components/skeletons/OffersSkeleton";

const ActivityOffersContainer = async () => {
    try{
        const getActivityOffersUseCase = container.get<GetActivityOffersUseCase>(UseCaseTypes.GetActivityOffersUseCase);
        const {offers, banners} = await getActivityOffersUseCase.getActivityOffers();

        return <ActivityOffers offers={offers} banners={banners}/>
    }catch{
        return <OffersSkeleton />
    }
};

export default ActivityOffersContainer;