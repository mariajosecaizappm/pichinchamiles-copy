"use client"
import { useState, UIEvent } from "react";
import HomeFeaturedRewardCard from "./HomeFeaturedRewardCard";
import { Banner } from "@/domain/entity/Banner/banner";
import { getScrollSnapSlideIndex } from "@/presentation/helpers/carousel";

const MobileCarouselHomeFeaturedRewards = ({ rewards }: { rewards: Banner[] }) => {
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
                {rewards.map((reward) => (
                    <div
                        key={reward.id}
                        className="h-full shrink-0 w-[calc(100%-2rem)] max-w-75 snap-center"
                    >
                        <HomeFeaturedRewardCard reward={reward} />
                    </div>
                ))}
            </div>
            <p className="text-sm text-center font-medium" aria-live="polite" aria-atomic="true">
                {currentSlide + 1} de {rewards.length}
            </p>
        </div>
    )
}

export default MobileCarouselHomeFeaturedRewards
