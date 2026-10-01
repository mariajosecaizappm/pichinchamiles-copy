import { BannerCategory } from "@/domain/entity/Banner/banner"
import { BodyBanners, FeaturedItems, HeroFlightsCarousel, TravelDeals } from "../Flights"

type Props = {
    title: string,
    category: BannerCategory
}

const UltraViajesPage = ({ title, category }: Props) => (
    <>
        <HeroFlightsCarousel />
        <FeaturedItems category={category} title={title} />
        <TravelDeals />
        <BodyBanners />
    </>
)
export default UltraViajesPage