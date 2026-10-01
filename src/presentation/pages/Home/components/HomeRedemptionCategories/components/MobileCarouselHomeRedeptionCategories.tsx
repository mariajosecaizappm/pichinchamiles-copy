"use client"

import { Banner } from "@/domain/entity/Banner/banner";
import { getScrollSnapSlideIndex } from "@/presentation/helpers/carousel";
import { useState, UIEvent } from "react";
import HomeRedemptionCategoryItemCard from "./HomeRedemptionCategoryItemCard";

const MobileCarouselHomeRedeptionCategories = ({ redemptionCategories }: { redemptionCategories: Banner[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const index = getScrollSnapSlideIndex(target);
        if (index !== currentSlide) {
            setCurrentSlide(index);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div
                data-testid="carousel"
                onScroll={handleScroll}
                className="flex gap-4 items-stretch overflow-x-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden px-4 snap-x snap-mandatory"
            >
                {
                    redemptionCategories.map((redemptionCategory) => (
                        <div
                            key={redemptionCategory.title}
                            className="h-full shrink-0 w-[calc(100%-2rem)] max-w-75 snap-center"
                        >
                            <HomeRedemptionCategoryItemCard redemptionCategory={redemptionCategory} />
                        </div>
                    ))
                }
            </div>

            <p className="text-sm text-center font-medium" aria-live="polite" aria-atomic="true">
                {currentSlide + 1} de {redemptionCategories.length}
            </p>
        </div>
    );
};

export default MobileCarouselHomeRedeptionCategories
