import {Banner} from "@/domain/entity/Banner/banner";
import {ExperienceCampaign, ProductsCampaign} from "@/domain/entity/Campaign/campaign";
import {Product} from "@/domain/entity/Product/product";

export type ProductOffer = {
    banner: Banner
    campaign: ProductsCampaign
    products: Product[]
}

export type ActivityOffer = {
    banner: Banner
    campaign: ExperienceCampaign
}