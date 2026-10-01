"use client"

import { useMemo } from "react";
import { Banner } from "@/domain/entity/Banner/banner";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import useSession from "@/presentation/hooks/useSession";
import CardsSliderWrapper from "../../components/CardsSliderWrapper/CardsSliderWrapper";
import ExperienceItemCard from "../../components/ExperienceItemCard";
import { getFeaturedBannerCardFields } from "./utils";

interface FeaturedItemsProps {
    items: Banner[];
    title: string;
}

const FeaturedItems = ({ items, title }: FeaturedItemsProps) => {
    const { isLogged } = useSession()

    const filteredItems = useMemo(() => {
        const position = isLogged ? MarketingPositions.HOME_UV_AUTH_RECOMMENDED_ITEMS : MarketingPositions.HOME_UV_GUEST_RECOMMENDED_ITEMS
        return items.filter((item) => item.positions.includes(position))
    }, [items, isLogged])

    if (filteredItems.length === 0) {
        return null
    }

    return (
        <div className="pb-6 w-full max-w-330 mx-auto">
            <div
                className="p-6 pb-3 md:pb-6"
            >
                <h2
                    className="text-[22px] font-slab leading-7 font-normal text-blue-500"
                >
                    {title}
                </h2>
            </div>
            <CardsSliderWrapper
                className="px-6 lg:overflow-x-auto 2xl:overflow-x-hidden lg:gap-13 lg:px-18"
                items={filteredItems}
                renderItem={(item) => {
                    const { address, points } = getFeaturedBannerCardFields(item);

                    return (
                        <ExperienceItemCard
                            href={item?.link}
                            asset={item?.image}
                            title={item?.title}
                            address={address}
                            points={points}
                            tag={item?.subtitle}
                        />
                    );
                }}
            />
        </div>

    );
};

export default FeaturedItems;
