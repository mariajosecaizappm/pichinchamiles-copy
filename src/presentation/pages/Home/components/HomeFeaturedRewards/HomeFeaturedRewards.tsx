
import { Banner } from "@/domain/entity/Banner/banner"
import { HomeFeaturedRewardCard } from "./componenets"
import dynamic from "next/dynamic"

const MobileCarouselHomeFeaturedRewards = dynamic(() => import("./componenets/MobileCarouselHomeFeaturedRewards"))

const HomeFeaturedRewards = ({ rewards }: { rewards: Banner[] }) => {
    return (
        <section
            className="py-6 md:py-10 flex gap-10 flex-col items-start self-stretch w-full"
            aria-labelledby="featured-rewards-title"
        >
            <div className="space-y-4 text-center w-full home-body-container">
                <h3 id="featured-rewards-title" className="text-[28px] text-blue-500 typo-main-title">
                    Mira lo que otros ya están disfrutando
                </h3>
                <p className="text-grayscale-500">
                    Estas son las recompensas destacadas de este mes
                </p>
            </div>
            <ul className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 px-6 xl:px-0 w-full md:home-body-container list-none p-0 m-0">
                {rewards.map((reward) => (
                    <li key={reward.id}>
                        <HomeFeaturedRewardCard reward={reward} />
                    </li>
                ))}
            </ul>
            <div className="w-full md:hidden">
                <MobileCarouselHomeFeaturedRewards rewards={rewards} />
            </div>
        </section>
    )
}

export default HomeFeaturedRewards 
