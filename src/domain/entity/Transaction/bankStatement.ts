export type BankStatementAccreditations = {
    totalPoints: number
    consumptions: number
    promos: number
    receivedTransfers: number
}

export type BankStatementDebits = {
    totalPoints: number
    travels: number
    products: number
    donations: number
    others: number
    sentTransfers: number
}

export type BankStatement = {
    balance: number
    createdAt: Date
    accreditations: BankStatementAccreditations
    debits: BankStatementDebits
}

export default BankStatement