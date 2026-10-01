import AssetImage from "@/presentation/components/AssetImage"
import OfferCampaignBannerTitle from "./OfferCampaignBannerTitle"
import {Asset} from "@/domain/entity/Asset/asset";

type Props = {
    image: Asset
    title: string
    subtitle?: string
}

const OfferCampaignBanner = ({ image, title, subtitle }: Props) => (
    <section className="flex flex-col gap-6">
        <div className="relative h-[160px] lg:h-[200px] rounded-lg overflow-hidden">
            <AssetImage
                asset={image}
                alt={title}
                width={1320}
                height={320}
                priority
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <OfferCampaignBannerTitle title={title} subtitle={subtitle} />
            </div>
        </div>
    </section>
)

export default OfferCampaignBanner
