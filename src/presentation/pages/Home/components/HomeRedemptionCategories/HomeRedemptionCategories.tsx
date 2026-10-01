import { Banner } from "@/domain/entity/Banner/banner";
import HomeRedemptionCategoryItemCard from "./components/HomeRedemptionCategoryItemCard";
import dynamic from "next/dynamic";

const MobileCarouselHomeRedeptionCategories = dynamic(() => import("./components/MobileCarouselHomeRedeptionCategories"));

type Props = {
    redemptionCategories: Banner[]
}

const HomeRedemptionsCategories = ({
    redemptionCategories
}: Props) => {
    return (
        <section
            className="py-6 md:py-10 flex gap-10 flex-col items-start self-stretch w-full"
            aria-labelledby="redemption-categories-title"
        >
            <div className="space-y-4 text-center w-full px-6 md:home-body-container">
                <h3 id="redemption-categories-title" className="text-[28px] text-blue-500 typo-main-title">
                    Tu eliges en qué disfrutar tus millas.
                </h3>
                <p>
                    Explora y elige la opción ideal para ti.
                </p>
            </div>
            <ul className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 px-6 xl:px-0 w-full home-body-container list-none p-0 m-0">
                {redemptionCategories.map((redemptionCategory) => (
                    <li key={redemptionCategory.title}>
                        <HomeRedemptionCategoryItemCard redemptionCategory={redemptionCategory} />
                    </li>
                ))}
            </ul>
            <div className="w-full md:hidden">
                <MobileCarouselHomeRedeptionCategories redemptionCategories={redemptionCategories} />
            </div>
        </section>
    )
}


export default HomeRedemptionsCategories