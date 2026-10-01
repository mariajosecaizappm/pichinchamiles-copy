import AnalyticsProvider from "@/presentation/analytics/providers/types";
import aa from 'search-insights';
import {EventName} from "@/presentation/analytics/types";
import {groupArrayPerPage} from "@/presentation/helpers/array";
import {AlgoliaIndex} from "@/data/provider/algolia/types";
import {BasketItem} from "@/domain/entity/Basket/structure/basket";
import links from "@/presentation/config/links";
import { getOrCreateSessionCookieInBrowser } from "@/domain/entity/Session/sessionCookie";

const eventPerPage = <T>(items: T[], fn: (items: T[]) => void) =>{
    const itemsPages = groupArrayPerPage(items, 20);
    itemsPages.forEach(page =>{
        fn(page);
    })
}

const queryIDKey = 'queryIdKey';

const setQueryID = (queryID: string, productIds: string[]) =>{
    sessionStorage.setItem(queryIDKey, JSON.stringify({queryID, productIds}));
}
const getQueryId = (productId: string) =>{
    const storageQueryId = sessionStorage.getItem(queryIDKey);
    const queryId = storageQueryId ? JSON.parse(storageQueryId) : "";
    if(queryId?.productIds?.includes(productId)){
        return queryId.queryID;
    }
    return "";
}

const getUserToken = (identification?: string): string => {
    if (identification) {
        return identification;
    }
    return getOrCreateSessionCookieInBrowser();
}

const algoliaProvider: AnalyticsProvider = {
    name: "algolia",
    track: (event) => {
        const baseEvent = {
            userToken: getUserToken(event.payload.identification),
            authenticatedUserToken: event.payload.identification
        }

        switch (event.name) {
        case EventName.CLICKED_PRODUCT: {
            const { pathname } = window.location;
            const { product } = event.payload;
            const sectionsMap: Record<string, string> = {
                [links.products]: "Home products",
                [`${links.offers}${links.productsList}`]: "Offers",
                [links.checkout]: "Checkout"
            }

            aa('clickedObjectIDsAfterSearch', {
                ...baseEvent,
                eventName: sectionsMap[pathname] ?? "Products catalog",
                index: product.searchEngine.index,
                queryID: product.searchEngine.queryID,
                objectIDs: [product.searchEngine.objectID],
                positions: [product.searchEngine.position]
            })
            break;
        }
        case EventName.ADDED_PRODUCT: {
            const { product } = event.payload;
            const queryId = getQueryId(product.id);
            if(queryId){
                aa('addedToCartObjectIDsAfterSearch', {
                    ...baseEvent,
                    eventName: "Product Added To Cart After Search",
                    index: product.searchEngine.index,
                    queryID: queryId,
                    objectIDs: [product.searchEngine.objectID],
                })
            }else{
                aa('addedToCartObjectIDs', {
                    ...baseEvent,
                    eventName: "Product Added To Cart",
                    index: product.searchEngine.index,
                    objectIDs: [product.searchEngine.objectID],
                })
            }
            break;
        }
        case EventName.PURCHASED_PRODUCT: {
            const { products } = event.payload;
            const getObjectIdsFromBasketItems = (basketItems: BasketItem[]) => {
                return basketItems.map(item=> {
                    return item.productId + ":" + item.storeId + ":" + process.env.NEXT_PUBLIC_PROGRAM_ID
                })
            }

            eventPerPage(products, (products)=>{
                const objectIDs = getObjectIdsFromBasketItems(products);
                aa('convertedObjectIDs', {
                    ...baseEvent,
                    eventName: 'Product Converted',
                    index: AlgoliaIndex.PRODUCTS,
                    objectIDs
                })

                aa('purchasedObjectIDs', {
                    ...baseEvent,
                    eventName: 'Product Purchased',
                    index: AlgoliaIndex.PRODUCTS,
                    objectIDs
                })
            })
            break;
        }
        case EventName.CLICKED_FILTERS:{
            const { filter, type } = event.payload;

            aa('clickedFilters', {
                ...baseEvent,
                eventName: type === "category" ? 'Category Filter Clicked' : 'Brand Filter Clicked',
                index: type === "category" ? AlgoliaIndex.CATEGORIES : AlgoliaIndex.BRANDS,
                filters: [`${type}:${filter.name}`],
            })
            break;
        }
        case EventName.VIEWED_FILTER:{
            const { filters } = event.payload;

            aa('viewedFilters',{
                ...baseEvent,
                eventName: 'Category Filter Viewed',
                index: AlgoliaIndex.CATEGORIES,
                filters: filters.map(filter=> `category:${filter.name}`),
            })
            break;
        }
        case EventName.VIEWED_PRODUCTS:{
            const { products: viewedProducts } = event.payload;
            setQueryID(viewedProducts[0].searchEngine.queryID, viewedProducts.map(product => product.id))
            eventPerPage(viewedProducts, (products)=>{
                aa('viewedObjectIDs',{
                    ...baseEvent,
                    eventName: 'Hits Viewed',
                    index: products[0].searchEngine.index,
                    objectIDs: products.map(product => product.searchEngine.objectID)
                })
            })
            break;
        }
        default:
            break;
        }
    }
}

export default algoliaProvider;
