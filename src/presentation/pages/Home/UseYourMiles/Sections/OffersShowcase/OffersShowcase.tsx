import { CampaignBanner } from "@/domain/entity/Campaign/campaign";
import { getCampaignHref } from "@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig";
import Tabs from "@/presentation/components/Tabs/Tabs";
import Button from '@/presentation/pages/Home/components/Button';
import Link from "next/link";
import { useMemo, useState } from "react";
import OfferShowcaseTabContent from "./OfferShowcaseTabContent";

type OfferShowcaseProps = {
    title: string;
    campaigns: CampaignBanner[]
    showBanner?: boolean;
}

const OffersShowcase = ({ title, campaigns, showBanner = true }: OfferShowcaseProps) => {
    const [activeTabId, setActiveTabId] = useState(campaigns?.[0]?.campaign?.id)
    const activeCampaign = useMemo(() => campaigns?.find(campaign => campaign.campaign.id === activeTabId), [activeTabId, campaigns])
    const campaignHref = activeCampaign ? getCampaignHref(activeCampaign) : ""
    if (!campaigns || campaigns.length === 0) {
        return null
    }

    return (
        <div className="pb-6 w-full max-w-330 mx-auto flex flex-col gap-3">
            <div
                className="p-6 pb-3"
            >
                <div className="flex items-center justify-between">
                    <h2
                        className="text-[22px] font-slab leading-7 font-normal text-blue-500"
                    >
                        {title}
                    </h2>
                    {
                        campaignHref && (
                            <Button
                                as={Link}
                                href={campaignHref}
                                size={"sm"} variant="bordered" className={"bg-white"}>
                                Ver todo{" "}
                                <span className="flex items-center justify-center w-4 h-4">
                                    <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 7.06L3.05333 4L0 0.94L0.94 0L4.94 4L0.94 8L0 7.06Z" fill="currentColor" />
                                    </svg>
                                </span>
                            </Button>
                        )
                    }
                </div>
            </div>
            <Tabs
                onTabChange={setActiveTabId}
                items={campaigns.map(campaign => {
                    return {
                        id: campaign.campaign.id,
                        label: campaign.campaign.mainTitle,
                        content: (
                            <OfferShowcaseTabContent key={campaign.campaign.id} campaign={campaign} showBanner={showBanner}/>
                        )
                    }
                })}
                classNames={{
                    tabList: 'gap-0 mx-6',
                    tab: 'px-4 py-2 lg:min-w-[144px] h-12',
                    tabContent: 'text-sm font-semibold',
                    panel: 'p-0'
                }}
            />
        </div>
    )
}

export default OffersShowcase