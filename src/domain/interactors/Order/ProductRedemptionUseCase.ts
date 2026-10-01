import {inject, injectable} from "inversify";
import "reflect-metadata"
import type IOrderRepository from "@/domain/repository/Order/IOrderRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Otp} from "@/domain/entity/Otp/otp";
import RecaptchaService from "@/domain/services/RecaptchaService";
import {ProductOrder, ProductOrderProcessed} from "@/domain/entity/Order/order";

@injectable()
export default class ProductRedemptionUseCase {
    private readonly orderRepository: IOrderRepository;

    constructor(@inject(RepositoryTypes.OrderRepository) orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository;
    }

    async getProductOrderOtp(): Promise<Otp | null>{
        const recaptchaAction = 'GetNameUserIdentification';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction);

        return this.orderRepository.getProductRedemptionOtp(recaptchaAction, recaptchaToken);
    }

    productRedemption(order: ProductOrder, kountSessionId: string): Promise<ProductOrderProcessed>{
        return this.orderRepository.productRedemption(order, kountSessionId);
    }
}