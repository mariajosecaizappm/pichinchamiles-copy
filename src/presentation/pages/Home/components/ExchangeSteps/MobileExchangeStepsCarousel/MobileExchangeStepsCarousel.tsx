"use client";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { EXCHANGE_STEPS } from "../ExchangeStepsConfig";
import ExchangeItemStep from "../ExchanteItemStep";
import RightArrow from "./RightArrow";
import LeftArrow from "./LeftArrow";

const MobileExchangeStepsCarousel = () => {
    return (
        <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            scrollContainerClassName="flex gap-4 items-stretch overflow-x-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
            wrapperClassName="relative"
            itemClassName="min-w-full"
        >
            {EXCHANGE_STEPS.map((step) => (
                <div className="px-16" key={step.title} itemID={step.title}>
                    <ExchangeItemStep step={step} />
                </div>
            ))}
        </ScrollMenu>
    );
};

export default MobileExchangeStepsCarousel;