import BankStatement from "@/domain/entity/Transaction/bankStatement";
import {List} from "@/domain/entity/List/list";
import {Transaction, TransactionListParams} from "@/domain/entity/Transaction/transaction";

export default interface ITransactionRepository{
    getBankStatement(): Promise<BankStatement>
    exportTransactions(startDate: Date, endDate: Date): Promise<string | void>
    getTransactions(params: TransactionListParams): Promise<List<Transaction>>
}