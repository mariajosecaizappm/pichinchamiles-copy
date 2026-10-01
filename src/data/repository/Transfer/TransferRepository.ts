import { injectable } from "inversify"
import axPrivate from "@/data/provider/axios/axiosPrivate"
import { getOtp } from "@/data/adapters/Auth/authAdapters"
import { transferBeneficiaryAdapter } from "@/data/adapters/Transfer/transferBeneficiaryAdapter"
import RepositoryBase from "@/data/repository/RepositoryBase"
import { Otp } from "@/domain/entity/Otp/otp"
import {
    CreateTransferParams,
    CreateTransferResult,
    TransferBeneficiary,
} from "@/domain/entity/Transfer/structure/transfer"
import ITransferRepository from "@/domain/repository/Transfer/ITransferRepository"

@injectable()
export default class TransferRepository extends RepositoryBase implements ITransferRepository {
    async getBeneficiary(
        identification: string,
        recaptchaAction: string,
        recaptchaToken: string
    ): Promise<TransferBeneficiary> {
        const url = `${this.pointsTransactionsPrefix}/${this.programId}/users/members/${identification}`
        const { data } = await axPrivate.get(url, {
            headers: {
                Recaptchaaction: recaptchaAction,
                Recaptchatoken: recaptchaToken,
            },
        })

        return transferBeneficiaryAdapter(data)
    }

    async getTransferOtp(
        recaptchaAction: string,
        recaptchaToken: string,
        otpOperationType: string
    ): Promise<Otp | null> {
        const url = `${this.identityPrefix}/${this.programId}/users/members/transactions/generate-otp`
        const { data } = await axPrivate.post(
            url,
            { otpOperationType },
            {
                headers: {
                    Recaptchaaction: recaptchaAction,
                    Recaptchatoken: recaptchaToken,
                },
            }
        )

        return getOtp(data)
    }

    async createTransfer(
        params: CreateTransferParams,
        kountSessionId: string
    ): Promise<CreateTransferResult> {
        const url = `${this.pointsTransactionsPrefix}/${this.programId}/transfers`
        const { data } = await axPrivate.post(url, {
            ...params,
            sess: kountSessionId,
        })

        return data
    }
}
