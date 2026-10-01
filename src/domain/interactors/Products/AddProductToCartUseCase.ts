import {inject, injectable} from "inversify";
import "reflect-metadata"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {Basket, BasketProduct} from "@/domain/entity/Basket/structure/basket";
import ShoppingCart from "@/domain/entity/Basket/models/ShoppingCart";
import type IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";

@injectable()
export default class AddProductToCartUseCase {
    private readonly basketRepository: IBasketRepository;

    constructor(@inject(RepositoryTypes.BasketRepository) basketRepository: IBasketRepository) {
        this.basketRepository = basketRepository;
    }

    async addProduct(product: BasketProduct): Promise<Basket | null>{
        const currentBasket = await this.basketRepository.getBasket();
        const shoppingCart = new ShoppingCart(currentBasket);
        const newBasket =  shoppingCart.addProduct(product);
        return this.basketRepository.updateBasket(newBasket);
    }
}