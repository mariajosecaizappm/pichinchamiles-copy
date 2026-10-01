import { inject, injectable } from "inversify"
import "reflect-metadata"
import {
    CreateTransferParams,
    CreateTransferResult,
} from "@/domain/entity/Transfer/structure/transfer"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import type ITransferRepository from "@/domain/repository/Transfer/ITransferRepository"

@injectable()
export default class CreateTransferUseCase {
    private readonly transferRepository: ITransferRepository

    constructor(
        @inject(RepositoryTypes.TransferRepository) transferRepository: ITransferRepository
    ) {
        this.transferRepository = transferRepository
    }

    execute(params: CreateTransferParams, kountSessionId: string): Promise<CreateTransferResult> {
        return this.transferRepository.createTransfer(params, kountSessionId)
    }
}
