import "reflect-metadata"
import type ITransactionRepository from "@/domain/repository/Transaction/ITransactionRepository";
import {inject, injectable} from "inversify";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import BankStatement from "@/domain/entity/Transaction/bankStatement";

@injectable()
export default class GetBankStatementUseCase{
    private readonly transactionRepository: ITransactionRepository;

    constructor(@inject(RepositoryTypes.TransactionRepository) transactionRepository: ITransactionRepository){
        this.transactionRepository = transactionRepository;
    }

    getBankStatement(): Promise<BankStatement>{
        return this.transactionRepository.getBankStatement();
    }
}