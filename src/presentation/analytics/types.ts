import {Product} from "@/domain/entity/Product/product";
import {BasketItem} from "@/domain/entity/Basket/structure/basket";
import {Brand} from "@/domain/entity/Brand/brand";
import {Category} from "@/domain/entity/Category/structure/category";

export enum EventName {
    // redemption events
    CLICKED_PRODUCT = 'CLICKED_PRODUCT', // clickedProductAfterSearch
    ADDED_PRODUCT = 'ADDED_PRODUCT', // addedToCartProductAfterSearch
    PURCHASED_PRODUCT = 'PURCHASED_PRODUCT', // purchasedProduct, convertedProductAfterSearch
    CLICKED_FILTERS = 'CLICKED_FILTERS', // clickedFilters
    VIEWED_FILTER = 'VIEWED_FILTER', // viewedProducts
    VIEWED_PRODUCTS = 'VIEWED_PRODUCTS', // viewedProducts
    CLICKED_REDEMPTION = 'CLICKED_REDEMPTION', //gtm

    // auth events
    OPEN_AUTH_MODAL = 'OPEN_AUTH_MODAL', // gtm
    VIEWED_HOME = 'VIEWED_HOME', // gtm
    VIEWED_IDENTIFICATION_FORM = 'VIEWED_IDENTIFICATION_FORM', // gtm
    VERIFY_IDENTIFICATION = 'VERIFY_IDENTIFICATION', // gtm
    VIEWED_PASSWORD_FORM = 'VIEWED_PASSWORD_FORM', // gtm
    VERIFY_PASSWORD = 'VERIFY_PASSWORD', // gtm
    VIEWED_LOGIN_OTP = 'VIEWED_LOGIN_OTP', // gtm
    VERIFY_LOGIN_OTP = 'VERIFY_LOGIN_OTP', // gtm
    LOGIN = 'LOGIN', // gtm
    VIEWED_ACTIVATION_OTP = 'VIEWED_ACTIVATION_OTP', // gtm
    VERIFY_ACTIVATION_OTP = 'VERIFY_ACTIVATION_OTP', // gtm
    VIEWED_ACTIVATION_PASSWORD = 'VIEWED_ACTIVATION_PASSWORD', // gtm
    VERIFY_ACTIVATION_PASSWORD = 'VERIFY_ACTIVATION_PASSWORD', // gtm
    ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT',
    VIEWED_PRODUCT = 'VIEWED_PRODUCT',
    VIEWED_COPAYMENT = 'VIEWED_COPAYMENT',
    GO_TO_CHECKOUT = 'GO_TO_CHECKOUT',
    VIEWED_CHECKOUT_PRODUCTS = 'VIEWED_CHECKOUT_PRODUCTS',
    VIEWED_CHECKOUT_SHIPPING = 'VIEWED_CHECKOUT_SHIPPING',
    VIEWED_CHECKOUT_BILLING = 'VIEWED_CHECKOUT_BILLING',
    VIEWED_CHECKOUT_CONFIRMATION = 'VIEWED_CHECKOUT_CONFIRMATION',
    GO_TO_CHECKOUT_SHIPPING = 'GO_TO_CHECKOUT_SHIPPING',
    GO_TO_CHECKOUT_BILLING = 'GO_TO_CHECKOUT_BILLING',
    GO_TO_CHECKOUT_CONFIRMATION = 'GO_TO_CHECKOUT_CONFIRMATION',
    REDEEM_PRODUCT = 'REDEEM_PRODUCT',
    VIEWED_REDEEM_STATUS = 'VIEWED_PRODUCT_STATUS',
    LOADED_USER = 'LOADED_USER', // ga

    // transfer
    CLICKED_TRANSFER = 'CLICKED_TRANSFER',
    VIEWED_TRANSFER = 'VIEWED_TRANSFER',
    TRANSFER = 'TRANSFER',
    VIEWED_TRANSFER_STATUS = 'VIEWED_TRANSFER_STATUS',
}

export interface GlobalEventContext{
    identification?: string
}

export interface EventPayloadMap {
    [EventName.CLICKED_PRODUCT]: { product: Product }
    [EventName.ADDED_PRODUCT]: { product: Product, category: string, pointsAmount: number }
    [EventName.PURCHASED_PRODUCT]: { products: BasketItem[], reference: string }
    [EventName.CLICKED_FILTERS]: { filter: Brand | Category, type: "brand" | "category" }
    [EventName.VIEWED_FILTER]: { filters: Category[] }
    [EventName.VIEWED_PRODUCTS]: { products: Product[] }
    [EventName.OPEN_AUTH_MODAL]: undefined
    [EventName.VIEWED_HOME]: undefined
    [EventName.VIEWED_IDENTIFICATION_FORM]: undefined
    [EventName.VERIFY_IDENTIFICATION]: undefined
    [EventName.VIEWED_PASSWORD_FORM]: undefined
    [EventName.VERIFY_PASSWORD]: undefined
    [EventName.VIEWED_LOGIN_OTP]: undefined
    [EventName.VERIFY_LOGIN_OTP]: undefined
    [EventName.LOGIN]: { status: "success" | "error" }
    [EventName.VIEWED_ACTIVATION_OTP]: undefined
    [EventName.VERIFY_ACTIVATION_OTP]: undefined
    [EventName.VIEWED_ACTIVATION_PASSWORD]: undefined
    [EventName.VERIFY_ACTIVATION_PASSWORD]: undefined
    [EventName.ACTIVE_ACCOUNT]: { status: "success" | "error" }
    [EventName.CLICKED_REDEMPTION]: { tab: string }
    [EventName.VIEWED_PRODUCT]: { category: string, product: Product }
    [EventName.VIEWED_COPAYMENT]: { category: string }
    [EventName.GO_TO_CHECKOUT]: { category: string }
    [EventName.VIEWED_CHECKOUT_PRODUCTS]: undefined
    [EventName.VIEWED_CHECKOUT_SHIPPING]: undefined
    [EventName.VIEWED_CHECKOUT_BILLING]: undefined
    [EventName.VIEWED_CHECKOUT_CONFIRMATION]: undefined
    [EventName.GO_TO_CHECKOUT_SHIPPING]: undefined
    [EventName.GO_TO_CHECKOUT_BILLING]: undefined
    [EventName.GO_TO_CHECKOUT_CONFIRMATION]: undefined
    [EventName.REDEEM_PRODUCT]: undefined
    [EventName.VIEWED_REDEEM_STATUS]: { reference?: string }
    [EventName.CLICKED_TRANSFER]: undefined
    [EventName.VIEWED_TRANSFER]: undefined
    [EventName.TRANSFER]: undefined
    [EventName.VIEWED_TRANSFER_STATUS]: { status: "success" | "error", amount: number }
    [EventName.LOADED_USER]: { cif: string }
}

export type AnalyticsPayload<K extends EventName> = [EventPayloadMap[K]] extends [undefined]
    ? GlobalEventContext
    : EventPayloadMap[K] & GlobalEventContext;

export type TrackEventArgs<K extends EventName> = [EventPayloadMap[K]] extends [undefined]
    ? [name: K, payload?: EventPayloadMap[K]]
    : [name: K, payload: EventPayloadMap[K]];

export type AnalyticsEvent = {
    [K in EventName]: { name: K; payload: AnalyticsPayload<K> }
}[EventName];
