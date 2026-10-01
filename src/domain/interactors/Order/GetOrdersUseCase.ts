import type { Order } from "@/domain/entity/Order/order";
import { OrderListParams } from "@/domain/entity/Order/order";
import type { List } from "@/domain/entity/List/list";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IOrderRepository from "@/domain/repository/Order/IOrderRepository";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export default class GetOrdersUseCase {
    private readonly orderRepository: IOrderRepository

    constructor(@inject(RepositoryTypes.OrderRepository) orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository
    }

    getOrderHistory(params: OrderListParams): Promise<List<Order>> {
        return this.orderRepository.getOrderHistory(params)
    }
}
