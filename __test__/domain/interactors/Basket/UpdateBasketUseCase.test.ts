import { describe, expect, it, vi } from "vitest";
import UpdateBasketUseCase from "@/domain/interactors/Basket/UpdateBasketUseCase";

describe("UpdateBasketUseCase", () => {
    it("delegates updateBasket to repository", async () => {
        const basket = { buyerId: "b", items: [] } as any;
        const updated = { buyerId: "b2", items: [] } as any;
        const repository = {
            updateBasket: vi.fn().mockResolvedValue(updated),
            getBasket: vi.fn(),
        } as any;

        const useCase = new UpdateBasketUseCase(repository);
        const result = await useCase.updateBasket(basket);

        expect(repository.updateBasket).toHaveBeenCalledWith(basket);
        expect(result).toBe(updated);
    });

    it("delegates getBasket to repository", async () => {
        const basket = { buyerId: "b", items: [] } as any;
        const repository = {
            updateBasket: vi.fn(),
            getBasket: vi.fn().mockResolvedValue(basket),
        } as any;

        const useCase = new UpdateBasketUseCase(repository);
        const result = await useCase.getBasket();

        expect(repository.getBasket).toHaveBeenCalledTimes(1);
        expect(result).toBe(basket);
    });
});
