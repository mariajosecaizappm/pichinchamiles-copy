import React from 'react';
import ProductOffers from "@/presentation/pages/Offers/Products/ProductOffers";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetProductOffersUseCase from "@/domain/interactors/Offers/GetProductOffersUseCase";
import OffersSkeleton from "@/presentation/pages/Offers/components/skeletons/OffersSkeleton";

const ProductsOffersContainer = async () => {
    try{
        const getProductOffersUseCase = container.get<GetProductOffersUseCase>(UseCaseTypes.GetProductOffersUseCase);
        const {productOffers, banners} = await getProductOffersUseCase.getProductOffers();

        return (
            <ProductOffers
                offers={productOffers}
                banners={banners}
            />
        )
    }catch{
        return <OffersSkeleton/>
    }
};

export default ProductsOffersContainer;