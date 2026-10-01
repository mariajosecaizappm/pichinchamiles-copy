import { inject, injectable } from "inversify"
import "reflect-metadata"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import RecaptchaService from "@/domain/services/RecaptchaService"
import type ITransferRepository from "@/domain/repository/Transfer/ITransferRepository"

@injectable()
export default class GetBeneficiaryUseCase {
    private readonly transferRepository: ITransferRepository

    constructor(
        @inject(RepositoryTypes.TransferRepository) transferRepository: ITransferRepository,
    ) {
        this.transferRepository = transferRepository
    }

    async execute(identification: string): Promise<TransferBeneficiary> {
        const recaptchaAction = "GetNameUserIdentification"
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)
        return this.transferRepository.getBeneficiary(identification, recaptchaAction, recaptchaToken)
    }
}
