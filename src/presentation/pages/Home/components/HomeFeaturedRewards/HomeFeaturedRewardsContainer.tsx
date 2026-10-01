import container from "@/presentation/config/inversify.config";
import HomeFeaturedRewards from "./HomeFeaturedRewards"
import GetHomeContentUseCase from "@/domain/interactors/Home/GetHomeContentUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import HomeFeaturedRewardsSkeleton from "./componenets/HomeFeaturedRewardsSkeleton";

const HomeFeaturedRewardsContainer = async () => {

    try {

        const getHomeContentUseCase = container.get<GetHomeContentUseCase>(
            UseCaseTypes.GetHomeContentUseCase,
        );

        const featuredRewards = await getHomeContentUseCase.getFeaturedRewards();

        return (
            <HomeFeaturedRewards rewards={featuredRewards.data} />
        )
        
    } catch {
        return <HomeFeaturedRewardsSkeleton />
    }
}

export default HomeFeaturedRewardsContainer 