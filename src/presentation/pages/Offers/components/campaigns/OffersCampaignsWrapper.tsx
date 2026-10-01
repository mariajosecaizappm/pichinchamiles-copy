import { CampaignBanner } from "@/domain/entity/Campaign/campaign"

type Props = {
    offers: CampaignBanner[]
    renderOffer: (offer: CampaignBanner, index: number) => React.ReactNode
}

const OffersCampaignsWrapper = ({ offers, renderOffer }: Props) => {
    return (
        <div className="flex flex-col">
            {offers.map((offer, index) => (
                <div
                    key={offer.campaign.id}
                    className={index % 2 === 0 ? "lg:bg-neutral-100" : ""}
                >
                    <div className="body-container py-4">
                        {renderOffer(offer, index)}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OffersCampaignsWrapper