import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import container from "@/presentation/config/inversify.config";
import HomeFaqs from "./HomeFaqs";
import HomeFaqsSkeleton from "./HomeFaqsSkeleton";
import GetHomeFaqsUseCase from "@/domain/interactors/Home/GetHomeFaqsUseCase";

const HomeFaqsContainer = () => {
    try {

        const getHomeFaqsUseCase = container.get<GetHomeFaqsUseCase>(
            UseCaseTypes.GetHomeFaqsUseCase,
        );

        const frequentQuestions = getHomeFaqsUseCase.getFrequentQuestions();

        return (

            <HomeFaqs frequentQuestions={frequentQuestions} />

        )
    } catch {

        return <HomeFaqsSkeleton />
    }
}

export default HomeFaqsContainer