import { AddedBasketItem, Basket } from "@/domain/entity/Basket/structure/basket";

export default interface IBasketRepository {
    getBasket(): Promise<Basket | null>
    addBasketItem(newBasketItem: AddedBasketItem, basket: Basket | null): Promise<Basket>
    updateBasket(basket: Basket): Promise<Basket | null>
    removeBasketItem(basketItemId: string, basket: Basket): Promise<Basket | null>
}
