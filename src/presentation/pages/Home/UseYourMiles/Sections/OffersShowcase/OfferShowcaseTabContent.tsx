import { CampaignBanner, CampaignExperience } from "@/domain/entity/Campaign/campaign";
import { SectionBanner } from "@/presentation/components/Banner/SectionBanner";
import { getCampaignHref, isExperienceOffer } from "@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig";
import CardsSliderWrapper from "../../TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import { useScrollMenuSlideTracker } from "@/presentation/hooks/useScrollMenuSlideTracker";
import ExperienceItemCard from "../../TravelAndActivities/components/ExperienceItemCard";
import { getCampaignExperienceCardImage } from "../../TravelAndActivities/Flights/TravelDeals/helpers";
import ProductCard from "../../Products/ProductCard/ProductCard";
import { Product } from "@/domain/entity/Product/product";

type Props = {
    campaign: CampaignBanner
    showBanner?: boolean
}

const OfferShowcaseTabContent = ({ campaign, showBanner = true }: Props) => {
    const campaignHref = getCampaignHref(campaign);
    const isExperience = isExperienceOffer(campaign);
    const { isDesktop } = useIsDesktop()
    const { canScrollLeft, canScrollRight, handleUpdate } = useScrollMenuSlideTracker();
    return <div className='flex gap-3 flex-col md:flex-row md:px-6'>
        {showBanner && campaign.banner && (
            <div className="px-6 md:px-0">
                <SectionBanner
                    title={campaign.banner.title}
                    subtitle={campaign.banner.subtitle}
                    buttonText={campaign.banner.linkText}
                    linkButton={campaignHref}
                    backgroundImage={campaign.banner.image}
                    className='md:w-[412px] w-full h-40 sm:h-56 md:min-h-full'
                    buttonClassName={"border-white text-white"}
                    typeButton={"bordered"}
                />
            </div>
        )}
        <div className="flex-1 min-w-0 overflow-hidden">
            <CardsSliderWrapper<CampaignExperience | Product>
                className="px-6 lg:overflow-x-auto md:px-0"
                items={isExperience ? campaign.experiences : campaign.products}
                showLeftArrow={isDesktop && canScrollLeft}
                showRightArrow={isDesktop && canScrollRight}
                arrowClassName="mx-2"
                onScroll={handleUpdate}
                renderItem={(item) => isExperience ? <ExperienceItemCard
                    href={(item as CampaignExperience).url}
                    asset={{
                        desktopUrl: getCampaignExperienceCardImage((item as CampaignExperience).image.desktopUrl),
                        mobileUrl: getCampaignExperienceCardImage((item as CampaignExperience).image.mobileUrl)
                    }}
                    title={(item as CampaignExperience).name}
                    address={(item as CampaignExperience).address}
                    points={Number((item as CampaignExperience).pointsAmount)}
                /> : <ProductCard
                    product={item as Product}
                />}
            />
        </div>
    </div>
};

export default OfferShowcaseTabContent;