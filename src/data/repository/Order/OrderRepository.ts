import RepositoryBase from "@/data/repository/RepositoryBase";
import { Order, OrderListParams, ProductOrder, ProductOrderProcessed } from "@/domain/entity/Order/order";
import IOrderRepository from "@/domain/repository/Order/IOrderRepository";
import {generateIdempotencyHash, getConsumptionsAdapter, productRedemptionAdapter} from "@/data/adapters/Order/orderAdapter";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import {Otp} from "@/domain/entity/Otp/otp";
import {getOtp} from "@/data/adapters/Auth/authAdapters";
import { List } from "@/domain/entity/List/list";

export default class OrderRepository extends RepositoryBase implements IOrderRepository {
    async productRedemption(order: ProductOrder, kountSessionId: string): Promise<ProductOrderProcessed> {
        const payload = productRedemptionAdapter(order, kountSessionId, this.programId);
        const idempotencyKey = generateIdempotencyHash(payload, this.programId);
        const { data } = await axPrivate.post(`${this.basketPrefix}/${this.programId}/baskets/v3/checkout`, {
            ...payload,
            idempotencyKey
        });
        return data;
    }

    async getProductRedemptionOtp(recaptchaAction: string, recaptchaToken: string): Promise<Otp | null>{
        const { data } = await axPrivate.post(`${this.identityPrefix}/${this.programId}/users/members/transactions/generate-otp`, {
            otpOperationType: 'PRODUCT_REDEMPTION_TRANSACTION'
        }, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        });

        return getOtp(data);
    }

    async getOrderHistory(params: OrderListParams): Promise<List<Order>> {
        const url = `${this.historyPrefix}/${this.programId}/consumptions`
        const page = params.page ? params.page - 1 : 0;
        const pageSize = params.pageSize || 10;
        const queryParams = [`Page=${page}`, `PageSize=${pageSize}`];
        if(params.orderNumber) queryParams.push(`filters=Order.Number,${params.orderNumber},=,and`);
        const { data } = await axPrivate.get(`${url}?${queryParams.join('&')}`);
        return getConsumptionsAdapter(data, pageSize);
    }
}