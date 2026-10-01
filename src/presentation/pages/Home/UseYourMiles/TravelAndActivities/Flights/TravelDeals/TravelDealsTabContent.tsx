"use client"

import { ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign";
import { SectionBanner } from "@/presentation/components/Banner/SectionBanner";
import { getCampaignHref } from "@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import { useScrollMenuSlideTracker } from "@/presentation/hooks/useScrollMenuSlideTracker";
import CardsSliderWrapper from "../../components/CardsSliderWrapper/CardsSliderWrapper";
import ExperienceItemCard from "../../components/ExperienceItemCard";
import { getCampaignExperienceCardImage } from "./helpers";

type Props = {
    offer: ExperienceCampaignBanner;
    showBanner?: boolean;
}

const TravelDealTabContent = ({ offer, showBanner = true }: Props) => {
    const {isDesktop} = useIsDesktop()
    const { canScrollLeft, canScrollRight, handleUpdate } = useScrollMenuSlideTracker();
    const campaignHref = getCampaignHref(offer);
    return (
        <div className='flex gap-3 flex-col md:flex-row md:px-6'>
            <div className="px-6 md:px-0">
                {showBanner && offer.banner && <SectionBanner
                    title={offer.banner.title}
                    subtitle={offer.banner.subtitle}
                    buttonText={offer.banner.linkText}
                    linkButton={campaignHref}
                    backgroundImage={offer.banner.image}
                    className='lg:w-103 w-full h-40 sm:h-56 md:min-h-full'
                    buttonClassName={"border-white text-white"}
                    typeButton={"bordered"}
                />}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
                <CardsSliderWrapper
                    className="px-6 lg:overflow-x-auto md:px-0"
                    items={offer.experiences} 
                    showLeftArrow={isDesktop && canScrollLeft}
                    showRightArrow={isDesktop && canScrollRight}
                    arrowClassName="mx-2"
                    onScroll={handleUpdate}
                    renderItem={(item) => <ExperienceItemCard
                        href={item.url}
                        asset={{
                            desktopUrl: getCampaignExperienceCardImage(item?.image.desktopUrl),
                            mobileUrl: getCampaignExperienceCardImage(item?.image.mobileUrl)
                        }}
                        title={item?.name}
                        address={item?.address}
                        points={Number(item?.pointsAmount)}
                    />} 
                />
            </div>
        </div>
    );
};

export default TravelDealTabContent