import container from "@/presentation/config/inversify.config";
import Faq from "./Faq"
import GetFaqsUseCase from "@/domain/interactors/Faq/GetFaqsUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";

const FaqContainer = async () => {
    try {
        const getFaqsUseCase = container.get<GetFaqsUseCase>(
            UseCaseTypes.GetFaqsUseCase,
        );
        const faqCategories = await getFaqsUseCase.execute();

        return (
            <Faq faqCategories={faqCategories} />
        )
    } catch {
        return null   
    }
}

export default FaqContainer