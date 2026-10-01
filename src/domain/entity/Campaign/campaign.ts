import { Asset } from "../Asset/asset"
import { Banner } from "../Banner/banner"
import { ListParams } from "../List/list"
import { MarketingPositions } from "../Marketing/marketing"
import { Product } from "../Product/product"

export enum CampaignType {
    PRODUCTS = 'products',
    EXPERIENCES = 'experiences'
}

export enum CampaignStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export interface BaseCampaign {
    id: string
    isOutstanding: boolean
    positions: MarketingPositions[]
    segmentCodes: string[]
    slug: string
    mainTitle: string
    secondaryTitle?: string
    hasLanding: boolean
    image: Asset
    shortDescription?: string
    longDescription?: string
    template?: string
    numberElementsSlide: number
    order: number
    status: CampaignStatus
    priority: number
}

export enum CampaignExperienceType {
    NATIONAL = 'national',
    INTERNATIONAL = 'international'
}

export type CampaignExperience = {
    name: string
    slug: string
    address: string
    experience: string
    description: string
    pointsAmount?: number
    validTo: Date
    url: string
    type: CampaignExperienceType
    image: Asset
}

export interface ProductsCampaign extends BaseCampaign {
    campaignType: CampaignType.PRODUCTS
    categories: string[]
    productIds: string[]
    priorityProducts: string[]
}

export interface ExperienceCampaign extends BaseCampaign {
    campaignType: CampaignType.EXPERIENCES
    experiences: CampaignExperience[]
}

export interface CampaignListParams extends ListParams {
    id?: string[]
    positions?: MarketingPositions[]
    campaignType?: CampaignType
    segmentCodes?: string[]
    isOutstanding?: boolean
    slug?: string
}


export type Campaign = ProductsCampaign | ExperienceCampaign;

export type CampaignWithProducts = ProductsCampaign & {
    products: Product[]
}

export type CampaignWithExperiences = ExperienceCampaign & {
    experiences: CampaignExperience[]
}

export type CampaignWithOffers = CampaignWithProducts | CampaignWithExperiences

 type BaseCampaignBanner = {
    banner: Banner
}

export type ExperienceCampaignBanner = BaseCampaignBanner & {
    campaign: ExperienceCampaign
    experiences: CampaignExperience[]
}

export type ProductsCampaignBanner = BaseCampaignBanner & {
    campaign: ProductsCampaign
    products: Product[]
}

export type CampaignBanner = ProductsCampaignBanner | ExperienceCampaignBanner
