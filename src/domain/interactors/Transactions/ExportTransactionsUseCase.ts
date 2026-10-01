import "reflect-metadata"
import {inject, injectable} from "inversify";
import type ITransactionRepository from "@/domain/repository/Transaction/ITransactionRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";

@injectable()
export default class ExportTransactionsUseCase {
    private readonly transactionRepository: ITransactionRepository;

    constructor(@inject(RepositoryTypes.TransactionRepository) transactionRepository: ITransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    exportTransactions(startDate: Date, endDate: Date): Promise<string | void>{
        return this.transactionRepository.exportTransactions(startDate, endDate);
    }
}