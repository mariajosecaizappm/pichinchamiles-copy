import {List} from "@/domain/entity/List/list";
import {Transaction, TransactionDetail} from "@/domain/entity/Transaction/transaction";

type TransactionDetailResponse = TransactionDetail

type TransactionResponse = Omit<Transaction, "details"> & {
    details?: TransactionDetailResponse[]
}

type TransactionsListResponse = {
    entities: TransactionResponse[]
    pagination: {
        page: number
        total: number
        pageSize: number
    }
}

const getTransactionDetail = (data: TransactionDetailResponse): TransactionDetail =>{
    return {
        name: data.name,
        quantity: data.quantity,
        totalPoints: data.totalPoints,
        totalCoins: data.totalCoins,
    }
}

const getTransaction = (data: TransactionsListResponse): Transaction[] => {
    return data.entities.map(entity =>({
        ...entity,
        details: entity.details ? entity.details.map(detail=> getTransactionDetail(detail)) : undefined
    }))
}

export const getTransactionsAdapter = (data: TransactionsListResponse): List<Transaction> => {
    return {
        data: getTransaction(data),
        pagination: {
            page: data.pagination.page + 1,
            total: data.pagination.total,
            pageSize: data.pagination.pageSize,
            totalPages: Math.ceil(data.pagination.total / data.pagination.pageSize)
        }
    }
}
