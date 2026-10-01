import BankStatement from "@/domain/entity/Transaction/bankStatement";

type BankStatementSummaryKey =
    | "Consumptions"
    | "Promotions"
    | "Receive"
    | "Travels"
    | "Products"
    | "Donations"
    | "Others"
    | "Send"

type BankStatementSummaryEntry = {
    transactionType: BankStatementSummaryKey
    pointsAmount: number
}

type BankStatementResponse = {
    memberUserTotalBalance: number
    createdAt: string
    [key: string]: number | string | BankStatementSummaryEntry[]
}

export const getBankStatementAdapter = (data: BankStatementResponse): BankStatement =>{
    const { memberUserTotalBalance, createdAt, ...rest} = data;

    const transactions = new Map<string, number>();
    Object.entries(rest).forEach((transactionGroup) =>{
        if (!Array.isArray(transactionGroup[1])) {
            return
        }

        transactionGroup[1].forEach((transaction) =>{
            transactions.set(transaction.transactionType, transaction.pointsAmount)
        })
    })

    const consumptions = transactions.get('Consumptions') ?? 0;
    const promos = transactions.get('Promotions') ?? 0;
    const receivedTransfers = transactions.get('Receive') ?? 0;
    const travels = transactions.get('Travels') ?? 0;
    const products = transactions.get('Products') ?? 0;
    const donations = transactions.get('Donations') ?? 0;
    const others = transactions.get('Others') ?? 0;
    const sentTransfers = transactions.get('Send') ?? 0;

    return {
        balance: memberUserTotalBalance,
        createdAt: new Date(createdAt),
        accreditations: {
            totalPoints: consumptions + promos,
            consumptions,
            promos,
            receivedTransfers,
        },
        debits: {
            totalPoints: Math.abs(travels + products + donations + others),
            travels: Math.abs(travels),
            products: Math.abs(products),
            donations: Math.abs(donations),
            others: Math.abs(others),
            sentTransfers: Math.abs(sentTransfers)
        }
    }
}
