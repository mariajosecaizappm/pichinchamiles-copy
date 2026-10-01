"use client"

import AssetImage from "@/presentation/components/AssetImage"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import {Asset} from "@/domain/entity/Asset/asset";

type Props = {
    image: Asset
    title: string
    subtitle?: string
}

const ProductOfferBanner = ({ image, title, subtitle }: Props) => {
    const { isDesktop } = useIsDesktop(778)
    return (
        <div className="body-container w-full py-2">
            <div
                className="relative h-40 md:h-50 rounded-lg overflow-hidden"
            >
                <AssetImage
                    asset={image}
                    alt={title}
                    width={isDesktop ? 1272 : 624}
                    height={isDesktop ? 620 : 320}
                    breakpoint={778}
                    priority={true}
                    fetchPriority="high"
                    sizes="100vw"
                    className="w-full h-full object-cover"
                />
                <div
                    style={{
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.40) 52.88%, rgba(255, 252, 252, 0.00) 100%)`
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="flex flex-col gap-1 text-center text-white w-full max-w-244.5">
                        <h2 className="typo-banner-title">{title}</h2>
                        {subtitle && <p className="typo-banner-subtitle">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductOfferBanner 