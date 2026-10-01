"use client"

import IconArrow from "@/presentation/components/icons/IconArrow"
import { useScrollMenuSlideTracker } from "@/presentation/hooks/useScrollMenuSlideTracker"
import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper"
import { cn } from "@heroui/react"
import Link from "next/link"
import { ReactElement, ReactNode } from "react"

const MOBILE_VISIBLE_COUNT = 2

type Props<T> = {
    items: T[]
    campaignHref: string
    isDesktop: boolean
    renderItem: (item: T) => ReactElement
    renderMobileItem: (item: T, index: number) => ReactNode
    getItemKey: (item: T, index: number) => string
    wrapperClassName?: string
    sliderClassName?: string
}

const CampaignResponsiveSlider = <T,>({
    items,
    campaignHref,
    isDesktop,
    renderItem,
    renderMobileItem,
    getItemKey,
    wrapperClassName,
    sliderClassName,
}: Props<T>) => {
    const { canScrollLeft, canScrollRight, handleUpdate } = useScrollMenuSlideTracker()

    if (items.length === 0) return null

    const mobileItems = items.slice(0, MOBILE_VISIBLE_COUNT)
    const hasMore = items.length > MOBILE_VISIBLE_COUNT

    return (
        <div className={cn("flex-1 min-w-0 overflow-hidden", wrapperClassName)}>
            <div className="hidden lg:block">
                <CardsSliderWrapper
                    className={cn("lg:overflow-x-auto", sliderClassName)}
                    items={items}
                    showLeftArrow={isDesktop && canScrollLeft}
                    showRightArrow={isDesktop && canScrollRight}
                    arrowClassName="mx-2"
                    onScroll={handleUpdate}
                    renderItem={renderItem}
                />
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
                {mobileItems.map((item, index) => (
                    <div key={getItemKey(item, index)}>
                        {renderMobileItem(item, index)}
                    </div>
                ))}

                {hasMore && (
                    <Link
                        href={campaignHref}
                        className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-information-500 cursor-pointer"
                    >
                        <span>Ver más</span>
                        <IconArrow />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default CampaignResponsiveSlider
