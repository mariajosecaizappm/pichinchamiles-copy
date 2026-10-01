import { Basket } from "@/domain/entity/Basket/structure/basket";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";
import type IPaymentRepository from "@/domain/repository/Payment/IPaymentRepository";
import { inject, injectable } from "inversify";
import {PaymentDetail} from "@/domain/entity/Payment/payment";

@injectable()
export default class GetPaymentStatusUseCase {
    constructor(
        @inject(RepositoryTypes.PaymentRepository) private readonly paymentRepository: IPaymentRepository,
        @inject(RepositoryTypes.BasketRepository) private readonly basketRepository: IBasketRepository
    ) {}

    async getShoppingCartValues(): Promise<{ pendingTransaction: string; basket: Basket | null }> {
        const [pendingTransaction, basket] = await Promise.all([
            this.paymentRepository.getPendingTransaction(),
            this.basketRepository.getBasket(),
        ]);

        return { pendingTransaction, basket };
    }

    getPaymentDetail(reference: string): Promise<PaymentDetail>{
        return this.paymentRepository.getPaymentDetail(reference);
    }
}
