import { Otp } from "@/domain/entity/Otp/otp"
import {
    CreateTransferParams,
    CreateTransferResult,
    TransferBeneficiary,
} from "@/domain/entity/Transfer/structure/transfer"

export default interface ITransferRepository {
    getBeneficiary(
        identification: string,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<TransferBeneficiary>
    getTransferOtp(
        recaptchaAction: string,
        recaptchaToken: string,
        otpOperationType: string
    ): Promise<Otp | null>
    createTransfer(
        params: CreateTransferParams,
        kountSessionId: string
    ): Promise<CreateTransferResult>
}
