import { useState } from "react";
import { publicApiType } from "react-horizontal-scrolling-menu";

export const useScrollMenuSlideTracker = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const handleUpdate = (api: publicApiType) => {
        const scrollContainer = api.scrollContainer?.current;
        if (scrollContainer) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
            const maxScrollLeft = scrollWidth - clientWidth;

            setCanScrollLeft(scrollLeft > 1);
            setCanScrollRight(scrollLeft < maxScrollLeft - 1);
        } else {
            setCanScrollLeft(!api.isFirstItemVisible);
            setCanScrollRight(!api.isLastItemVisible);
        }

        const visibleItems = api.items.getVisible();
        if (visibleItems.length > 0) {
            const firstVisible = visibleItems[0];
            if (firstVisible) {
                const index = Number(firstVisible[1].index);
                if (!Number.isNaN(index)) {
                    setCurrentSlide(index);
                }
            }
        }
    };

    return { currentSlide, canScrollLeft, canScrollRight, handleUpdate };
};
