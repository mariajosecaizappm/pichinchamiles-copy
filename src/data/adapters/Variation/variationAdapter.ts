import { DiscountStatus, DiscountType, Variation, VariationFeature } from "@/domain/entity/Product/variation";
import { AlgoliaSearchEngine } from "@/domain/entity/SearchEngine/structure/SearchEngine";
import { getArray, getNumber, getString, isRecord } from "../commonAdapters";
import { getProductAssetAdapter, getProductTagsAdapter } from "../Product/productAdapter";

export const getVariationAdapter = (hitValue: unknown, searchEngine?: AlgoliaSearchEngine): Variation => {
    const record = isRecord(hitValue) ? hitValue : {};
    return {
        id: getString(record.id),
        reference: getString(record.reference),
        stock: getNumber(record.stock),
        storeStock: getNumber(record.storeStock),
        price: getNumber(record.price),
        discountType: getString(record.discountType) as DiscountType,
        discountValue: getNumber(record.discountValue),
        discountTag: getString(record.discountTag),
        discountValidTo: getString(record.discountValidTo),
        discountValidFrom: getString(record.discountValidFrom),
        discountTagTextColor: getString(record.discountTagTextColor),
        discountTagBackgroundColor: getString(record.discountTagBackgroundColor),
        discountStatus: getString(record.discountStatus) as DiscountStatus,
        pointsPrice: getNumber(record.pointsPrice),
        width: record.width ? parseFloat(getNumber(record.width).toString()) : undefined,
        weight: parseFloat((getNumber(record.weight)).toString()),
        length: record.length ? parseFloat(getNumber(record.length).toString()) : undefined,
        height: record.height ? parseFloat(getNumber(record.height).toString()) : undefined,
        taxes: getNumber(record.taxes),
        tags: record.tags
            ? getProductTagsAdapter(getArray(record.tags))
            : [],
        assets: getArray(record.assets).map(getProductAssetAdapter).filter(asset => Boolean(asset.desktopUrl)),
        features: getArray(record.features).map((feature): VariationFeature => {
            const f = isRecord(feature) ? feature : {};
            return {
                name: getString(f.name),
                option: getString(f.option),
            };
        }),
        copayment: record.copayment ? record.copayment as Variation['copayment'] : undefined,
        searchEngine: searchEngine ?? (record.searchEngine as AlgoliaSearchEngine),
    }
}