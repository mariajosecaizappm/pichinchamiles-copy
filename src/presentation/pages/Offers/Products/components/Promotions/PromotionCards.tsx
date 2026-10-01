import { Banner } from "@/domain/entity/Banner/banner"
import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper"
import PromotionCardItem from "./PromotionCardItem"
import { cn } from "@heroui/react"

type Props = {
    banners: Banner[]
}

const PromotionBanners = ({ banners }: Props) => {
    return (
        <div className="lg:body-container py-3">
            <CardsSliderWrapper
                className={cn("px-6 lg:px-0 lg:overflow-x-auto", banners.length === 4 ? "justify-between" : "justify-start")}
                items={banners}
                renderItem={(banner) => <PromotionCardItem banner={banner} />}
                itemClassName="lg:w-[295px]! lg:max-w-[295px]!"
            />
        </div>
    )
}

export default PromotionBanners