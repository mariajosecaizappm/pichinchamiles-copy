/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddedBasketItem, Basket, BasketItem } from "@/domain/entity/Basket/structure/basket";
import { ProductAsset } from "@/domain/entity/Product/product";

const getProductAssetsAdapter = (assets: any[] | undefined | null): Omit<ProductAsset, 'id'>[] => {
    if (!assets?.length) return [];

    return assets.map((asset: any)=>{
        return{
            type: asset.type,
            htmlAlternative: asset.htmlAlternative,
            order: asset.order,
            desktopUrl: asset.desktopUrl,
            mobileUrl: asset.mobileUrl
        }
    })
}

export const getBasketAdapter = (data: any): Basket =>{
    return {
        buyerId: data?.buyerId ?? "",
        items: (data?.items ?? []).map((item: any)=>{
            const basketItem: BasketItem = {
                id: item.id,
                storeId: item.storeId,
                supplierId: item.supplierId,
                productId: item.productId,
                variationId: item.variationId,
                categoryId: item.categoryId,
                quantity: item.quantity,
                comments: item.comments,
                brandName: item.brandName,
                categoryName: item.categoryName,
                paymentMethod: item.paymentMethod,
                productType: item.productType,
                description: item.description,
                slug: item.slug,
                isAvailability: item.isAvailability,
                queryId: item.queryId,
                variationInfo: {
                    productName: item.variationInfo.productName,
                    productNameChanged: item.variationInfo.productNameChanged,
                    productSlug: item.variationInfo.productSlug,
                    productSlugChanged: item.variationInfo.productSlugChanged,
                    stock: item.variationInfo.stock,
                    stockChanged: item.variationInfo.stockChanged,
                    price: item.variationInfo.price,
                    priceChanged: item.variationInfo.priceChanged,
                    pointsPrice: item.variationInfo.pointsPrice,
                    pointsPriceChanged: item.variationInfo.pointsPriceChanged,
                    taxes: item.variationInfo.taxes,
                    copayment: item.variationInfo.copayment ? {
                        initialization: {
                            points: item.variationInfo.copayment.points,
                            coins: item.variationInfo.copayment.coins
                        },
                        pointsConversionRatePercentage: item.variationInfo.copayment.pointsConversionRatePercentage,
                        minimumPointsValue: item.variationInfo.copayment.minimumPointsValue
                    } : undefined,
                    assets: getProductAssetsAdapter(item.variationInfo?.assets),
                    features: item.variationInfo?.features ?? []
                },
                paymentTypes: {
                    points: {
                        amount: item.paymentTypes.points.amount,
                        currencyId: item.paymentTypes.points.currencyId
                    },
                    ...(item.paymentTypes.pointsConversionRatePercentage && {
                        pointsConversionRatePercentage: item.paymentTypes.pointsConversionRatePercentage
                    })
                }
            }
            if(item.paymentTypes.coin){
                basketItem.paymentTypes.coin = {
                    amount: item.paymentTypes.coin.amount,
                    currencyId: item.paymentTypes.coin.currencyId
                }
            }

            return basketItem
        })
    }
}


export const addBasketItemAdapter = (newBasketItem: AddedBasketItem, basket: Basket | null) => {
    const { product, variation } = newBasketItem;
    const formattedItem: any = {
        storeId: product.store.id,
        supplierId: product.supplierId,
        productId: product.id,
        variationId: variation.id,
        categoryId: product.categories[0].id,
        quantity: newBasketItem.quantity,
        comments: "",
        productType: product.productType,
        brandName: product.brand.name,
        categoryName: product.categories[0].name,
        queryId: product.searchEngine?.queryID,
        slug: product.slug,
        variationInfo: {
            productName: product.name,
            productSlug: product.slug,
            stock: variation.stock,
            price: variation.price,
            taxes: variation.taxes,
            pointsPrice: variation.pointsPrice,
            description: product.description,
            copayment: {
                points: variation.copayment?.initialization.points,
                coins: variation.copayment?.initialization.coins,
                pointsConversionRatePercentage: variation.copayment?.pointsConversionRatePercentage,
                minimumPointsValue: variation.copayment?.minimumPointsValue,
            },
            features: variation.features.map(feature => ({
                name: feature.name,
                option: feature.option
            }))
        },
        paymentTypes: {
            points: {
                currencyId: newBasketItem.pointsCurrencyId,
                amount: newBasketItem.pointsTotal
            }
        }
    };
    const assets = variation.assets.length > 0 ? variation.assets : product.assets;
    formattedItem.variationInfo.assets = assets.map(asset => ({
        type: asset.type,
        desktopUrl: asset.desktopUrl,
        mobileUrl: asset.mobileUrl,
        order: asset.order,
    }));

    if (newBasketItem.coinsTotal) {
        formattedItem.paymentTypes.coin = {
            currencyId: newBasketItem.coinsCurrencyId,
            amount: newBasketItem.coinsTotal
        }
    }

    if (basket) {
        const formattedBasket = updateBasketAdapter(basket);
        return {
            items: [...formattedBasket.items, formattedItem]
        };
    }

    return {
        items: [formattedItem]
    }
}

export const updateBasketAdapter = (basket: Basket) =>{
    const items = basket.items.filter(item=> item.isAvailability);

    return {
        items: items.map(item=>{
            const formattedItem: any = {
                storeId: item.storeId,
                supplierId: item.supplierId,
                productId: item.productId,
                variationId: item.variationId,
                categoryId: item.categoryId,
                quantity: item.quantity,
                comments: item.comments,
                productType: item.productType,
                brandName: item.brandName,
                categoryName: item.categoryName,
                slug: item.slug,
                queryId: item.queryId,
                variationInfo: {
                    productName: item.variationInfo.productName,
                    productSlug: item.variationInfo.productSlug,
                    stock: item.variationInfo.stock,
                    price: item.variationInfo.price,
                    pointsPrice: item.variationInfo.pointsPrice,
                    description: item.description,
                    taxes: item.variationInfo.taxes,
                    copayment: item.variationInfo.copayment ? {
                        points: item.variationInfo.copayment.initialization.points,
                        coins: item.variationInfo.copayment.initialization.coins,
                        pointsConversionRatePercentage: item.variationInfo.copayment.pointsConversionRatePercentage,
                        minimumPointsValue: item.variationInfo.copayment.minimumPointsValue,
                    } : undefined,
                    assets: item.variationInfo.assets.map(asset=> ({
                        type: asset.type,
                        desktopUrl: asset.desktopUrl,
                        mobileUrl: asset.mobileUrl,
                        order: asset.order,
                    })),
                    features: item.variationInfo.features.map(feature=>({
                        name: feature.name,
                        option: feature.option
                    }))
                },
                paymentTypes: {
                    points: {
                        currencyId: item.paymentTypes.points.currencyId,
                        amount: item.paymentTypes.points.amount
                    },
                    ...(item.paymentTypes.pointsConversionRatePercentage && {
                        pointsConversionRatePercentage: item.paymentTypes.pointsConversionRatePercentage
                    })
                }
            };
            if(item.paymentTypes.coin){
                formattedItem.paymentTypes.coin = {
                    currencyId: item.paymentTypes.coin.currencyId,
                    amount: item.paymentTypes.coin.amount
                }
            }

            return formattedItem
        })
    }
}