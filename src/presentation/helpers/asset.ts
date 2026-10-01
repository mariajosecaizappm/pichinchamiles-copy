import { isMobileDevice } from "./device";
import { Asset } from "@/domain/entity/Asset/asset";
import { ProductAsset } from "@/domain/entity/Product/product";

export const getPlatformAsset = (asset: Asset) => {
    const isMobile = isMobileDevice();
    if (!asset.mobileUrl) return asset.desktopUrl
    return isMobile ? asset.mobileUrl : asset.desktopUrl
}

/** Returns the product's primary image: lowest `order`, excluding videos (ECOV3SM-3796). */
export const getPrimaryAsset = (assets: ProductAsset[]): ProductAsset | undefined => {
    const images = assets.filter((asset) => asset.type !== "video")
    if (images.length === 0) return undefined

    return images.reduce((lowest, asset) => (asset.order < lowest.order ? asset : lowest), images[0])
}