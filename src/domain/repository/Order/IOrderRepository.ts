import { List } from "@/domain/entity/List/list";
import {Order, OrderListParams, ProductOrder, ProductOrderProcessed} from "@/domain/entity/Order/order";
import {Otp} from "@/domain/entity/Otp/otp";
export default interface IOrderRepository {
    productRedemption(order: ProductOrder, kountSessionId: string): Promise<ProductOrderProcessed>
    getProductRedemptionOtp(recaptchaAction: string, recaptchaToken: string): Promise<Otp | null>
    getOrderHistory(params: OrderListParams): Promise<List<Order>>
}