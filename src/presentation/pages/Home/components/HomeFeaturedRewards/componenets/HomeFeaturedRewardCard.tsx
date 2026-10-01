"use client"

import { Banner } from "@/domain/entity/Banner/banner"
import AppLink from "@/presentation/components/AppLink"
import AssetImage from "@/presentation/components/AssetImage"

type Props = {
    reward: Banner
}

const HomeFeaturedRewardCard = ({ reward }: Props) => {
    return (
        <AppLink
            href={reward.link || "#"}
            aria-label={reward.title + '. ' + (reward.subtitle ? `Desde ${reward.subtitle} millas. ` : '') + 'También puedes pagar millas más tarjeta.'}
        >
            <div className="flex flex-col rounded-lg border border-darkGrayishBlue-500 overflow-hidden text-left h-full min-w-75">
                <div className="min-h-38.75">
                    <AssetImage
                        asset={reward.image}
                        alt={`Imagen de producto destacado: ${reward.title}`}
                        width={666}
                        height={155}
                        breakpoint={640}
                        className="object-cover w-full"
                    />
                </div>
                <div className="py-4 px-5 flex flex-col items-start self-stretch gap-1 h-38.75">
                    <p className="line-clamp-1 text-[22px] text-blue-500 leading-7" aria-label={`Producto: ${reward.title}`}>
                        {reward.title}
                    </p>
                    {
                        reward.subtitle && (() => {
                            const raw = reward.subtitle.replace(/[^0-9]/g, '')
                            if (!raw) return null
                            const num = Number(raw)
                            if (isNaN(num)) return null
                            const formatted = raw.length > 3
                                ? raw.slice(0, raw.length - 3) + '.' + raw.slice(-3)
                                : raw
                            return (
                                <div>
                                    <span className="font-medium text-xs">Desde</span>
                                    <p className="text-blue-500 text-[22px] font-semibold leading-7">
                                        {formatted} millas
                                    </p>
                                </div>
                            )
                        })()
                    }

                    <p className="text-xs font-medium">También puedes pagar millas + tarjeta</p>

                </div>
            </div>
        </AppLink>
    )
}

export default HomeFeaturedRewardCard
