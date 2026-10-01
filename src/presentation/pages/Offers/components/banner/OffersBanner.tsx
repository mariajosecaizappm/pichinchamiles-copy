
"use client"

import { Banner } from "@/domain/entity/Banner/banner"
import AssetImage from "@/presentation/components/AssetImage"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"

type Props = {
    banner: Banner
}

const OffersBanner = ({ banner }: Props) => {
    const {isDesktop} = useIsDesktop(640)
    return (
        <div
            className="relative h-40 sm:h-77.5"
        >
            <AssetImage
                asset={banner.image}
                alt={banner.title}
                width={isDesktop ? 1366 : 360}
                height={isDesktop ? 310 : 160}
                breakpoint={639}
                priority={true}
                fetchPriority="high"
                sizes="100vw"
                className="w-full h-full object-cover"
            />
            <div
                style={{
                    background: `linear-gradient(180deg, rgba(255, 252, 252, 0.00) 0%, rgba(0, 0, 0, 0.40) 35.69%, rgba(58, 57, 57, 0.40) 66.9%, rgba(255, 252, 252, 0.00) 100%)`,
                }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="flex flex-col gap-1 text-center text-white w-full max-w-244.5 lg:text-left">
                    <h2 className="typo-banner-title">{banner.title}</h2>
                    {banner.subtitle && <p className="typo-banner-subtitle">{banner.subtitle}</p>}
                </div>
            </div>
        </div>
    )
}

export default OffersBanner 