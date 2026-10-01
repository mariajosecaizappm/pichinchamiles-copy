import { inject, injectable } from "inversify";
import { type FaqFrequentQuestion } from "@/domain/entity/Pqrs/pqrs";
import { type IPQRSSRepository } from "@/domain/repository/Pqrs/IPqrsRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";

@injectable()
export default class GetHomeFaqsUseCase {

    private readonly pqrsRepository: IPQRSSRepository;

    constructor(
        @inject(RepositoryTypes.PqrsRepository)
            pqrsRepository: IPQRSSRepository,
    ) {
        this.pqrsRepository = pqrsRepository;
    }

    getFrequentQuestions(): FaqFrequentQuestion[] {
        return this.pqrsRepository.getHomeFaqs();
    }

}
