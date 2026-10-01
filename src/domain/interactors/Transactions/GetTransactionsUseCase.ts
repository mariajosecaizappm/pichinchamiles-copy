import "reflect-metadata"
import {inject, injectable} from "inversify";
import type ITransactionRepository from "@/domain/repository/Transaction/ITransactionRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {List} from "@/domain/entity/List/list";
import {Transaction, TransactionListParams} from "@/domain/entity/Transaction/transaction";

@injectable()
export default class GetTransactionsUseCase{
    private readonly transactionRepository: ITransactionRepository;

    constructor(@inject(RepositoryTypes.TransactionRepository) transactionRepository: ITransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    getTransactions(params: TransactionListParams): Promise<List<Transaction>>{
        return this.transactionRepository.getTransactions(params);
    }
}