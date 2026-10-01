import ITransactionRepository from "@/domain/repository/Transaction/ITransactionRepository";
import RepositoryBase from "@/data/repository/RepositoryBase";
import BankStatement from "@/domain/entity/Transaction/bankStatement";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import {getBankStatementAdapter} from "@/data/adapters/Transaction/bankStatementAdapter";
import {injectable} from "inversify";
import "reflect-metadata";
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";
import {Transaction, TransactionListParams} from "@/domain/entity/Transaction/transaction";
import {List} from "@/domain/entity/List/list";
import {getTransactionsAdapter} from "@/data/adapters/Transaction/transactionAdapter";

@injectable()
export default class TransactionRepository extends RepositoryBase implements ITransactionRepository {
    async getBankStatement(): Promise<BankStatement> {
        const { data } = await axPrivate.get(`${this.pointsTransactionsPrefix}/${this.programId}/users/members/balance/summary`);
        return getBankStatementAdapter(data);
    }

    async exportTransactions(startDate:Date, endDate:Date): Promise<string | void> {
        const isOutOffRange = () =>{
            const diff = endDate.getTime() - startDate.getTime();
            const diff_in_years = diff / (1000 * 3600 * 24 *365);
            return diff_in_years > 1
        }

        if(isOutOffRange()){
            throw new ApiError(ErrorCode.EXPORT_TRANSACTION_MAX_RANGE)
        }
        const { data, status } = await axPrivate.get(`${this.pointsTransactionsPrefix}/${this.programId}/transactions/transaction-history?startDate=${startDate.toISOString().replace('Z', '')}&endDate=${endDate.toISOString().replace('Z', '')}`);
        if (status === 204) {
            throw new ApiError(ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND)
        }

        return data
    }

    async getTransactions(params: TransactionListParams): Promise<List<Transaction>> {
        const { data } = await axPrivate.get(`${this.historyPrefix}/${this.programId}/bank-statements/movements`, {
            params: {
                ...params,
                page: params.page ? params.page - 1 : 0,
            }
        });
        return getTransactionsAdapter(data);
    }
}