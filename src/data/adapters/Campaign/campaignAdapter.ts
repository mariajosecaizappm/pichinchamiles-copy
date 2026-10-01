import { AlgoliaHit } from "@/data/provider/algolia/types";
import { BaseCampaign, Campaign, CampaignExperience, CampaignStatus, CampaignType } from "@/domain/entity/Campaign/campaign";
import { getString, getBoolean, isRecord, getArray, getNumber } from "../commonAdapters";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";

export const getCampaignAdapter = (hitValue: AlgoliaHit): Campaign => {
    const record = isRecord(hitValue) ? hitValue : {};
    const baseCampaign: BaseCampaign = {
        id: getString(record?.id),
        isOutstanding: getBoolean(record?.isOutstanding),
        positions: (getArray(record.positions) as Array<{ name: string }>).map((position) => position.name as MarketingPositions),
        segmentCodes: getArray(record.segmentCodes) as string[],
        slug: getString(record.slug),
        mainTitle: getString(record?.mainTitle),
        secondaryTitle: getString(record?.secondaryTitle),
        hasLanding: getBoolean(record?.hasLanding),
        image: {
            desktopUrl: getString(record?.desktopBannerImageUrl),
            mobileUrl: getString(record?.mobileBannerImageUrl)
        },
        shortDescription: getString(record?.shortDescription),
        longDescription: getString(record?.longDescription),
        template: getString(record?.template),
        numberElementsSlide: getNumber(record?.numberElementsSlide),
        order: getNumber(record?.order),
        status: getString(record?.status) as CampaignStatus,
        priority: getNumber(record?.priority ?? 0)
    }

    if (record.campaignType === CampaignType.PRODUCTS) {
        const priorityProducts = record?.productsOrder && Array.isArray(record.productsOrder) && record.productsOrder.length > 0
            ? record.productsOrder.map((productOrder: unknown) => {
                if (typeof productOrder === 'object' && productOrder !== null && 'productId' in productOrder) {
                    return productOrder.productId as string;
                }
                return '';
            })
            : [];

        const productIds = getArray(record.productIds) as string[];

        return {
            ...baseCampaign,
            campaignType: CampaignType.PRODUCTS,
            categories: getArray(record.categories) as string[],
            priorityProducts,
            productIds: priorityProducts.length > 0
                ? productIds.filter((productId: string) => !priorityProducts.includes(productId))
                : productIds
        }
    } else {

        const experiences = getArray(record.campaignExperiences)


        return {
            ...baseCampaign,
            campaignType: CampaignType.EXPERIENCES,
            experiences: experiences.map((campaignExperience) => {
                const record = isRecord(campaignExperience) ? campaignExperience : {};
                return {
                    name: getString(record?.name),
                    slug: getString(record?.slug),
                    address: getString(record?.address),
                    experience: getString(record?.experience),
                    description: getString(record?.description),
                    pointsAmount: getNumber(record?.pointsAmount),
                    validTo: new Date(record?.validTo as string),
                    url: getString(record?.productUrl),
                    type: getString(record?.type),
                    image: {
                        desktopUrl: getString(record?.desktopImageUrl),
                        mobileUrl: getString(record?.mobileImageUrl)
                    }
                } as CampaignExperience
            })
        }
    }
}
