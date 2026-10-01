"use client"

import { EventName } from "@/presentation/analytics/types"
import useAnalytics from "@/presentation/hooks/useAnalytics"
import { useContext, useRef } from "react"
import { useScrollActiveItemIntoView } from "@/presentation/hooks/useScrollActiveItemIntoView"
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu"
import CategoryChip from "../SubcategoryChip"
import { CategoryWithCount } from "../types"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import ArrowButton from "./ArrowButton"
import { MOBILE_BREAKPOINT } from "@/presentation/config/breakpoint"


type Props = {
    categories: CategoryWithCount[],
    activeSubcategory: string,
    buildSubcategoryHref: (subcategorySlug: string) => string,
}

const Subcategories = ({
    categories,
    activeSubcategory,
    buildSubcategoryHref,
}: Props) => {
    const { track } = useAnalytics();
    const activeItemRef = useRef<HTMLDivElement>(null);
    const { isDesktop } = useIsDesktop(MOBILE_BREAKPOINT)

    useScrollActiveItemIntoView(activeItemRef, [activeSubcategory]);

    return (
        <div className="flex flex-col gap-2 w-full min-w-0">
            <div className="w-full  md:hidden body-container">
                <h3 className="font-semibold text-black">Categorías</h3>
            </div>
            <ScrollMenu
                LeftArrow={isDesktop ? LeftArrow : null}
                RightArrow={isDesktop ? RightArrow : null}
                wrapperClassName="overflow-hidden relative w-full lg:body-container"
                scrollContainerClassName="flex items-center gap-3 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden px-6 lg:px-12.5 lg:h-10"
            >
                {
                    categories?.map((category) => (
                        <div className="whitespace-nowrap shrink-0" key={category.id} ref={category.slug === activeSubcategory ? activeItemRef : undefined}>
                            <CategoryChip
                                data-active={activeSubcategory === category.slug ? "true" : "false"}
                                category={category}
                                count={category.count}
                                href={buildSubcategoryHref(category.slug)}
                                replace
                                scroll={false}
                                onPress={() => track(EventName.CLICKED_FILTERS, { type: "category", filter: category })}
                            />
                        </div>
                    ))
                }
            </ScrollMenu>
        </div>
    )
}

const LeftArrow = () => {
    const { scrollPrev, useIsVisible } = useContext(VisibilityContext);
    const isFirstItemVisible = useIsVisible("first", true);
    return (
        <div className="pr-2.5 absolute z-10 bg-white">
            <button
                disabled={isFirstItemVisible}
                onClick={() => scrollPrev()}
                className="bg-white cursor-pointer w-10 h-10 border border-darkGrayishBlue-400 rounded-full flex items-center justify-center  text-helper-500 hover:bg-darkGrayishBlue-200 active:bg-darkGrayishBlue-400 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.61 7.41L14.2 6L8.19995 12L14.2 18L15.61 16.59L11.03 12L15.61 7.41Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    )
}

const RightArrow = () => {
    const { scrollNext, useIsVisible } = useContext(VisibilityContext);
    const isLastItemVisible = useIsVisible("last", true);
    return (
        <div className="bg-white absolute z-10 pl-2.5 right-6 top-0">
            <ArrowButton
                disabled={isLastItemVisible}
                onClick={() => scrollNext()}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0201 6L8.61011 7.41L13.1901 12L8.61011 16.59L10.0201 18L16.0201 12L10.0201 6Z" fill="currentColor" />
                </svg>
            </ArrowButton>
        </div>
    )
}



export default Subcategories