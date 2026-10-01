import { Basket } from "@/domain/entity/Basket/structure/basket";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export default class UpdateBasketUseCase {
    private readonly basketRepository: IBasketRepository;

    constructor(
        @inject(RepositoryTypes.BasketRepository) basketRepository: IBasketRepository,
    ) {
        this.basketRepository = basketRepository;
    }

    async updateBasket(basket: Basket): Promise<Basket | null> {
        return this.basketRepository.updateBasket(basket);
    }

    async getBasket(): Promise<Basket | null> {
        return this.basketRepository.getBasket();
    }
}
