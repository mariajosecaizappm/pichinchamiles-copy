import {createContext} from "react";
import {Transaction} from "@/domain/entity/Transaction/transaction";

export type TransactionsContextValues = {
    transaction: Transaction | null
    selectTransaction: (transaction: Transaction) => void
    clearTransaction: () => void
}

const TransactionsContext = createContext<TransactionsContextValues>({
    transaction: null,
    selectTransaction: () => {},
    clearTransaction: () => {},
})

export default TransactionsContext;