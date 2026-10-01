import { beforeEach, describe, expect, it, vi } from "vitest";
import GetOrdersUseCase from "@/domain/interactors/Order/GetOrdersUseCase";
import type IOrderRepository from "@/domain/repository/Order/IOrderRepository";
import { List } from "@/domain/entity/List/list";
import { Order } from "@/domain/entity/Order/order";

describe("GetOrdersUseCase", () => {
    let mockRepository: IOrderRepository;
    let useCase: GetOrdersUseCase;

    beforeEach(() => {
        mockRepository = {
            getOrderHistory: vi.fn()
        };
        useCase = new GetOrdersUseCase(mockRepository);
    });

    it("delegates getOrderHistory to repository", async () => {
        const mockResult: List<Order> = {
            data: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0,
                totalPages: 0
            }
        };

        (mockRepository.getOrderHistory as any).mockResolvedValueOnce(mockResult);

        const params = { page: 1, pageSize: 10 };
        const result = await useCase.getOrderHistory(params);

        expect(mockRepository.getOrderHistory).toHaveBeenCalledWith(params);
        expect(mockRepository.getOrderHistory).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(mockResult);
    });

    it("passes orderNumber parameter through to repository", async () => {
        const mockResult: List<Order> = {
            data: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0,
                totalPages: 0
            }
        };

        (mockRepository.getOrderHistory as any).mockResolvedValueOnce(mockResult);

        const params = { page: 1, pageSize: 10, orderNumber: "123456" };
        await useCase.getOrderHistory(params);

        expect(mockRepository.getOrderHistory).toHaveBeenCalledWith(params);
    });

    it("returns repository result unchanged", async () => {
        const mockOrders: Order[] = [
            {
                estimatedDeliveredDate: new Date("2024-01-15"),
                orderCreatedAt: new Date("2024-01-10"),
                orderNumber: "111222",
                orderStatus: "delivered" as any,
                shippingDetails: [],
                totalCoins: 50,
                totalPoints: 1000
            }
        ];

        const mockResult: List<Order> = {
            data: mockOrders,
            pagination: {
                page: 1,
                pageSize: 10,
                total: 1,
                totalPages: 1
            }
        };

        (mockRepository.getOrderHistory as any).mockResolvedValueOnce(mockResult);

        const result = await useCase.getOrderHistory({ page: 1, pageSize: 10 });

        expect(result).toEqual(mockResult);
        expect(result.data).toHaveLength(1);
        expect(result.data[0].orderNumber).toBe("111222");
    });

    it("handles repository errors by propagating them", async () => {
        const error = new Error("Repository error");
        (mockRepository.getOrderHistory as any).mockRejectedValueOnce(error);

        await expect(
            useCase.getOrderHistory({ page: 1, pageSize: 10 })
        ).rejects.toThrow("Repository error");
    });
});
