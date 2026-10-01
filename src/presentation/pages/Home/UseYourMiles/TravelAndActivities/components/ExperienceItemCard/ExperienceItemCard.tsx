"use client"

import { Asset } from "@/domain/entity/Asset/asset"
import AppLink from "@/presentation/components/AppLink"
import { cn } from "@heroui/react"
import ExperienceCardContent, { CardContentProps } from "./ExperienceCardContent"
import ExperienceCardImage from "./ExperienceCardImage"
import ExperienceCardTag from "./ExperienceCardTag"

type Orientation = "vertical" | "horizontal"

type Props = {
    href: string
    asset: Asset
    title: string
    points: number
    address?: string
    className?: string
    classNameImage?: string
    tag?: string
    orientation?: Orientation
}

const ExperienceItemCard = ({
    href,
    asset,
    title,
    points,
    address,
    className,
    classNameImage,
    tag,
    orientation = "vertical",
}: Props) => {
    const isHorizontal = orientation === "horizontal"
    const contentProps: CardContentProps = {
        title,
        address,
        points,
        isHorizontal,
    }

    return (
        <AppLink href={href} className={cn("block", isHorizontal ? "w-full" : "h-full")}>
            <div
                className={cn(
                    "border relative border-darkGrayishBlue-500 w-full rounded-lg flex overflow-hidden bg-white",
                    isHorizontal ? "flex-row" : "h-full max-w-62.5 flex-col justify-between lg:h-[311px]",
                    className,
                )}
            >
                {tag && !isHorizontal && (
                    <div className="absolute right-4 top-4 flex gap-2 flex-wrap justify-end">
                        <ExperienceCardTag tag={tag} />
                    </div>
                )}

                <ExperienceCardImage
                    asset={asset}
                    title={title}
                    tag={tag}
                    isHorizontal={isHorizontal}
                    classNameImage={classNameImage}
                />

                <ExperienceCardContent {...contentProps} />
            </div>
        </AppLink>
    )
}

export default ExperienceItemCard
