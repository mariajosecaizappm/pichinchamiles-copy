type Props = {
    title: string
    subtitle?: string
}

const OfferCampaignBannerTitle = ({ title, subtitle }: Props) => (
    <div className="flex flex-col gap-1 text-center text-white">
        <h1 className="typo-banner-title">{title}</h1>
        {subtitle && <p className="typo-banner-subtitle">{subtitle}</p>}
    </div>
)

export default OfferCampaignBannerTitle
