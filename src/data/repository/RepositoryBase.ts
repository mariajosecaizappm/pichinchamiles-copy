import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export default class RepositoryBase {
    protected readonly baseUrl: string
    protected readonly clientId: string
    protected readonly clientSecret: string
    protected readonly programId: string
    protected readonly identityPrefix = "/identity-api"
    protected readonly pointsTransactionsPrefix = "/points-transactions-api"
    protected readonly programsPrefix = "/programs-api"
    protected readonly basketPrefix = "/baskets-api"
    protected readonly paymentsPrefix = "/payments-api"
    protected readonly pqrsPrefix = "/pqrs-api"
    protected readonly historyPrefix = "/history-api"

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL as string
        this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
        this.clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
        this.programId = process.env.NEXT_PUBLIC_PROGRAM_ID as string
    }
}