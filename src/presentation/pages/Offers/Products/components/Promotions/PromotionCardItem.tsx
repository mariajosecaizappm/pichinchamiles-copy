"use client"

import { Banner } from "@/domain/entity/Banner/banner"
import AppLink from "@/presentation/components/AppLink"
import AssetImage from "@/presentation/components/AssetImage"
import { truncateText } from "@/presentation/helpers/text"

const TITLE_MAX_LENGTH = 35
const DESCRIPTION_MAX_LENGTH = 104

type Props = {
    banner: Banner
}

const PromotionCardItem = ({ banner }: Props) => {
    const title = truncateText(banner.title, TITLE_MAX_LENGTH)
    const description = truncateText(banner.description, DESCRIPTION_MAX_LENGTH)

    return (
        <AppLink href={banner.link}>
            <div className="border relative border-darkGrayishBlue-500 h-full rounded-lg flex flex-col overflow-hidden bg-white">
                <AssetImage
                    asset={banner.image}
                    alt={banner.title}
                    width={500}
                    height={310}
                    breakpoint={640}
                    className="object-cover w-full h-38.75"
                />
                <div className="py-4 px-5 space-y-1">
                    <h3 className="text-blue-500 text-[22px] leading-8">{title}</h3>
                    <p className="text-sm leading-5">{description}</p>
                </div>
            </div>
        </AppLink>
    )
}

export default PromotionCardItem
