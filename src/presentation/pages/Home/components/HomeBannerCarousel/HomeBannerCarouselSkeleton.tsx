"use client"
import { cn } from "@heroui/react"

type Props = {
    className?: string
}

const HomeBannerCarouselSkeleton = ({className}: Props) => {
    return (
        <div aria-hidden="true" className={cn("w-full h-[600px] bg-content3", className)} />
    )
}

export default HomeBannerCarouselSkeleton