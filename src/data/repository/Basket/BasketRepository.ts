import { addBasketItemAdapter, getBasketAdapter, updateBasketAdapter } from "@/data/adapters/Basket/basketAdapter";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import RepositoryBase from "@/data/repository/RepositoryBase";
import { AddedBasketItem, Basket } from "@/domain/entity/Basket/structure/basket";
import IBasketRepository from "@/domain/repository/BasketRepository/IBasketRepository";
import { injectable } from "inversify";

@injectable()
export default class BasketRepository extends RepositoryBase implements IBasketRepository {
    async getBasket(): Promise<Basket | null> {
        const { data } = await axPrivate.get(`${this.basketPrefix}/${this.programId}/baskets`)
        if (!data) return null;
        return getBasketAdapter(data)
    }

    async addBasketItem(newBasketItem: AddedBasketItem, basket: Basket | null): Promise<Basket> {
        const payload = addBasketItemAdapter(newBasketItem, basket);
        const { data } = await axPrivate.post(`${this.basketPrefix}/${this.programId}/v2/baskets`, payload);
        return getBasketAdapter(data)
    }

    async updateBasket(basket: Basket): Promise<Basket | null> {
        const payload = updateBasketAdapter(basket);
        const { data } = await axPrivate.post(`${this.basketPrefix}/${this.programId}/baskets`, payload);
        if (!data) return null;
        return getBasketAdapter(data)
    }

    async removeBasketItem(basketItemId: string, basket: Basket): Promise<Basket | null> {
        const updatedBasket: Basket = {
            ...basket,
            items: basket.items.filter(item => item.id !== basketItemId)
        };

        return this.updateBasket(updatedBasket);
    }
}
