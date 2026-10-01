"use client"

import { LeftArrow } from "@/presentation/components/ScrollMenu/LeftArrow"
import { RightArrow } from "@/presentation/components/ScrollMenu/RightArrow"
import { cn } from "@heroui/react"
import { publicApiType, ScrollMenu } from "react-horizontal-scrolling-menu"

type Props<T> = {
    items: T[],
    className?: string,
    renderItem: (item: T) => React.ReactElement,
    showLeftArrow?: boolean,
    arrowClassName?: string,
    showRightArrow?: boolean,
    onScroll?: (api: publicApiType) => void
    itemClassName?: string
}

const CardsSliderWrapper = <T,>({ items, className, renderItem, showLeftArrow, arrowClassName, showRightArrow, onScroll, itemClassName }: Props<T>) => {
    return (
        <ScrollMenu
            LeftArrow={showLeftArrow ? <LeftArrow className={arrowClassName} /> : undefined}
            RightArrow={showRightArrow ? <RightArrow className={arrowClassName} /> : undefined}
            data-testid="cards-slider-wrapper"
            wrapperClassName="relative"
            scrollContainerClassName={cn("flex gap-4 items-stretch overflow-x-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden", className)}
            itemClassName={cn('shrink-0 w-full max-w-62.5', itemClassName)}
            onScroll={onScroll}
            onInit={onScroll}
            onUpdate={onScroll}
        >
            {items.map((item, index) => {
                const itemId = `cards-slider-item-${index}`
                return (
                    <div className="h-full" key={itemId} itemID={itemId}>
                        {renderItem(item)}
                    </div>
                )
            })}
        </ScrollMenu>
    )
}

export default CardsSliderWrapper