import IconArrow from "@/presentation/components/icons/IconArrow"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import { useScrollMenuSlideTracker } from "@/presentation/hooks/useScrollMenuSlideTracker"
import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper"
import Link from "next/link"
import React from "react"

type Props<T> = {
    items: T[]
    renderItem: (item: T) => React.ReactElement
    renderMobileItem: (item: T, index: number) => React.ReactElement
    campaignHref: string
}

const MOBILE_VISIBLE_COUNT = 2

const ItemsCarousel = <T,>({
    items,
    renderItem,
    renderMobileItem,
    campaignHref
}: Props<T>) => {
    const { isDesktop } = useIsDesktop()
    const { canScrollLeft, canScrollRight, handleUpdate } = useScrollMenuSlideTracker()
    const mobileItems = items.slice(0, MOBILE_VISIBLE_COUNT)
    const hasMore = items.length > MOBILE_VISIBLE_COUNT
    return (
        <div className="flex-1 min-w-0 overflow-hidden">
            <div className="hidden lg:block">
                <CardsSliderWrapper
                    className="lg:overflow-x-auto"
                    items={items}
                    showLeftArrow={isDesktop && canScrollLeft}
                    showRightArrow={isDesktop && canScrollRight}
                    arrowClassName="mx-2"
                    onScroll={handleUpdate}
                    renderItem={renderItem}
                />
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
                {mobileItems.map((item, index) => renderMobileItem(item, index))}

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

export default ItemsCarousel