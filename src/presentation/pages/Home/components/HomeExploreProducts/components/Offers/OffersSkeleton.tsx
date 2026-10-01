import OffersShowcaseSkeleton from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersShowcaseSkeleton"

const OffersSkeleton = () => {
    return (
        <div className="bg-grayscale-50">
            <OffersShowcaseSkeleton showBannerSkeleton={true} />
        </div>
    )
}

export default OffersSkeleton