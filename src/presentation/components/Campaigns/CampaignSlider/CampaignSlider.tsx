"use client"

import { CampaignBanner } from "@/domain/entity/Campaign/campaign"
import { SectionBanner } from "@/presentation/components/Banner/SectionBanner"
import { truncateText } from "@/presentation/helpers/text"
import { getCampaignHref, isExperienceOffer } from "./CampaignSliderConfig"
import ItemsCarousel from "./ItemsCarousel"

const TITLE_MAX_LENGTH = 35

type Props<T> = {
    offer: CampaignBanner
    renderItem: (item: T) => React.ReactElement
    renderMobileItem: (item: T, index: number) => React.ReactElement
}

const CampaignSlider = <T,>({ offer, renderItem, renderMobileItem, }: Props<T>) => {
    const campaignHref = getCampaignHref(offer)
    const items = isExperienceOffer(offer) ? offer.experiences : offer.products
    const title = truncateText(offer.banner.title, TITLE_MAX_LENGTH)
    return (
        <article className="flex flex-col gap-3">
            <div className="flex gap-3 flex-col lg:flex-row">
                <SectionBanner
                    title={title}
                    subtitle={offer.banner.subtitle}
                    buttonText={offer.banner.linkText}
                    linkButton={campaignHref}
                    backgroundImage={offer.banner.image}
                    className="lg:max-w-[412px] w-full h-40 lg:h-auto"
                    buttonClassName="border-white text-white"
                    typeButton="bordered"
                />
                <ItemsCarousel<T>
                    items={items as T[]}
                    campaignHref={campaignHref}
                    renderItem={renderItem}
                    renderMobileItem={renderMobileItem}
                />
            </div>
        </article>
    )
}

export default CampaignSlider
