import { List } from "@/domain/entity/List/list";
import { Order, OrderListParams } from "@/domain/entity/Order/order";

export default interface IRedemptionsRepository {
    getRedemptionsHistory(params: OrderListParams): Promise<List<Order>>
}
