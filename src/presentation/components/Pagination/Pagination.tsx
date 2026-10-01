"use client"

import { Pagination } from "@heroui/pagination"
import type { PaginationProps } from "@heroui/pagination"
import { cn } from "@heroui/theme"

export type MilesPaginationProps = Omit<PaginationProps, "classNames"> & {
    classNames?: PaginationProps["classNames"]
}

const defaultClassNames = (): NonNullable<PaginationProps["classNames"]> => ({
    base: "mx-auto w-full max-w-[564px] gap-0 bg-transparent w-full py-3",
    wrapper: "flex flex-row flex-wrap items-center justify-between gap-1 w-full max-w-auto",
    prev: cn(
        "flex min-h-8 min-w-8 cursor-pointer items-center justify-center border-none bg-transparent shadow-none",
        "text-information-500 [&_svg]:size-5 [&_svg]:min-h-5 [&_svg]:min-w-5 [&_svg]:text-information-500",
    ),
    next: cn(
        "flex min-h-8 min-w-8 cursor-pointer items-center justify-center border-none bg-transparent shadow-none",
        "text-information-500 [&_svg]:size-5 [&_svg]:min-h-5 [&_svg]:min-w-5 [&_svg]:text-information-500",
    ),
    item: cn(
        "flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-[8px] border-2 border-transparent",
        "bg-transparent text-base font-medium text-grayscale-500 shadow-none",
        "data-[active=true]:border-information-500 data-[active=true]:bg-darkGrayishBlue-100 data-[active=true]:font-semibold data-[active=true]:!text-grayscale-500",
    ),
    ellipsis: "text-grayscale-500 font-medium",
    forwardIcon: "hidden",
    chevronNext: "text-information-500 [&_svg]:size-5 [&_svg]:min-h-5 [&_svg]:min-w-5",
})

const MilesPagination = ({
    classNames,
    className,
    showControls = true,
    disableAnimation = true,
    disableCursorAnimation = true,
    variant = "light",
    onChange,
    ...rest
}: MilesPaginationProps) => {
    const merged = defaultClassNames()

    const handleChange = (page: number) => {
        window.scrollTo(0, 0)
        onChange?.(page)
    }

    return (
        <Pagination
            showControls={showControls}
            disableAnimation={disableAnimation}
            disableCursorAnimation={disableCursorAnimation}
            variant={variant}
            className={className}
            onChange={handleChange}
            classNames={{
                ...merged,
                ...classNames,
                base: cn(merged.base, classNames?.base),
                wrapper: cn(merged.wrapper, classNames?.wrapper),
                prev: cn(merged.prev, classNames?.prev),
                next: cn(merged.next, classNames?.next),
                item: cn(merged.item, classNames?.item),
                ellipsis: cn(merged.ellipsis, classNames?.ellipsis),
                forwardIcon: cn(merged.forwardIcon, classNames?.forwardIcon),
                chevronNext: cn(merged.chevronNext, classNames?.chevronNext),
                cursor: cn(classNames?.cursor),
            }}
            {...rest}
        />
    )
}

export default MilesPagination
