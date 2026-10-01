import { inject, injectable } from "inversify"
import "reflect-metadata"
import { Otp } from "@/domain/entity/Otp/otp"
import { TRANSFER_OTP_OPERATION_TYPE } from "@/domain/entity/Transfer/structure/transfer"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import RecaptchaService from "@/domain/services/RecaptchaService"
import type ITransferRepository from "@/domain/repository/Transfer/ITransferRepository"

@injectable()
export default class GetGenerateOtpTransferUseCase {
    private readonly transferRepository: ITransferRepository

    constructor(
        @inject(RepositoryTypes.TransferRepository) transferRepository: ITransferRepository
    ) {
        this.transferRepository = transferRepository
    }

    async execute(): Promise<Otp | null> {
        const recaptchaAction = "GetOtpTransferMiles"
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)

        return this.transferRepository.getTransferOtp(
            recaptchaAction,
            recaptchaToken,
            TRANSFER_OTP_OPERATION_TYPE
        )
    }
}
