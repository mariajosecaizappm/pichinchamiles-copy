import { describe, it, expect, vi } from "vitest";
import GetOrdersUseCase from "@/domain/interactors/Order/GetOrdersUseCase";
import IOrderRepository from "@/domain/repository/Order/IOrderRepository";
import { Order, OrderStatus, ShippingAddress } from "@/domain/entity/Order/order";
import { List } from "@/domain/entity/List/list";

describe("GetOrdersUseCase", () => {
    const createOrder = (orderNumber: string, orderCreatedAt: Date): Order => ({
        orderNumber,
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date(),
        orderCreatedAt,
        totalCoins: 0,
        totalPoints: 100,
        shippingDetails: [],
        shippingAddress: {} as unknown as ShippingAddress,
    });

    it("delegates to orderRepository.getOrderHistory", async () => {
        const response: List<Order> = {
            data: [createOrder("1", new Date("2024-01-01"))],
            pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
        };

        const orderRepository = {
            getOrderHistory: vi.fn().mockResolvedValue(response),
        } as unknown as IOrderRepository;

        const useCase = new GetOrdersUseCase(orderRepository);
        const result = await useCase.getOrderHistory({ page: 1, pageSize: 10 });

        expect(orderRepository.getOrderHistory).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
        expect(result).toEqual(response);
    });

});
