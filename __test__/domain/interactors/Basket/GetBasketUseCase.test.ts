import { describe, it, expect, vi } from "vitest";
import GetBasketUseCase from "@/domain/interactors/Basket/GetBasketUseCase";

describe("GetBasketUseCase", () => {
    const basketRepository = {
        getBasket: vi.fn(),
        addBasketItem: vi.fn(),
        updateBasket: vi.fn(),
        removeBasketItem: vi.fn(),
    };

    const basket = { buyerId: "buyer-1", items: [] } as any;
    const basketItem = { id: "item-1" } as any;
    const useCase = new GetBasketUseCase(basketRepository as any);

    it("should delegate getBasket to repository", async () => {
        basketRepository.getBasket.mockResolvedValueOnce(basket);

        const result = await useCase.getBasket();

        expect(result).toEqual(basket);
        expect(basketRepository.getBasket).toHaveBeenCalledTimes(1);
    });

    it("should delegate updateBasket to repository", async () => {
        basketRepository.updateBasket.mockResolvedValueOnce(basket);

        const result = await useCase.updateBasket(basket);

        expect(result).toEqual(basket);
        expect(basketRepository.updateBasket).toHaveBeenCalledWith(basket);
    });

    it("should delegate removeBasketItem to repository", async () => {
        basketRepository.removeBasketItem.mockResolvedValueOnce(basket);

        const result = await useCase.removeBasketItem("item-1", basket);

        expect(result).toEqual(basket);
        expect(basketRepository.removeBasketItem).toHaveBeenCalledWith("item-1", basket);
    });
});

