import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Basket } from "@/domain/entity/Basket/structure/basket";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";

@injectable()
export default class GetBasketUseCase {
    constructor(
        @inject(RepositoryTypes.BasketRepository) private readonly basketRepository: IBasketRepository
    ) {}

    getBasket(): Promise<Basket | null> {
        return this.basketRepository.getBasket();
    }

    updateBasket(basket: Basket): Promise<Basket | null> {
        return this.basketRepository.updateBasket(basket);
    }

    removeBasketItem(basketItemId: string, basket: Basket): Promise<Basket | null> {
        return this.basketRepository.removeBasketItem(basketItemId, basket);
    }
}
