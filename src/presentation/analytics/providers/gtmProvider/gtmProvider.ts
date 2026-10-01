import AnalyticsProvider from "@/presentation/analytics/providers/types";
import { AnalyticsEvent, EventName } from "@/presentation/analytics/types";
import { sendGTMEvent as sendEvent } from '@next/third-parties/google'
import {
    activationEvents,
    conversionEvents,
    loginEvents,
    redemptionEvents,
    transferEvents,
} from "@/presentation/analytics/providers/gtmProvider/events";
import { Category } from "@/domain/entity/Category/structure/category";
import { Brand } from "@/domain/entity/Brand/brand";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";

type RedemptionSummary = {
    points: number
    coins: number
    category: string
}

type GtmEvent = (typeof loginEvents)[number]

const STATUS_AUX = {
    success: "exito",
    error: "error",
} as const

const REDEMPTION_TAB_LABEL: Record<string, string> = {
    products: "Productos",
    flights: "Vuelos",
    hotels: "Hoteles",
    cars: "Autos",
    activities: "Actividades",
    disney: "Disney",
}

const withFunnelAux = (event: GtmEvent, funnelAux: string): GtmEvent => ({
    ...event,
    funnel_aux: funnelAux,
})

const sendGtmEvent = (event: GtmEvent, identification?: string) => {
    sendEvent(identification ? { ...event, identification } : event)
}

const SIMPLE_EVENT_MAP: Readonly<Partial<Record<EventName, GtmEvent>>> = {
    [EventName.OPEN_AUTH_MODAL]: loginEvents[0],
    [EventName.VIEWED_HOME]: loginEvents[1],
    [EventName.VIEWED_IDENTIFICATION_FORM]: loginEvents[2],
    [EventName.VERIFY_IDENTIFICATION]: loginEvents[3],
    [EventName.VIEWED_PASSWORD_FORM]: loginEvents[4],
    [EventName.VERIFY_PASSWORD]: loginEvents[5],
    [EventName.VIEWED_LOGIN_OTP]: loginEvents[6],
    [EventName.VERIFY_LOGIN_OTP]: loginEvents[7],
    [EventName.VIEWED_ACTIVATION_OTP]: activationEvents[2],
    [EventName.VERIFY_ACTIVATION_OTP]: activationEvents[3],
    [EventName.VIEWED_ACTIVATION_PASSWORD]: activationEvents[4],
    [EventName.VERIFY_ACTIVATION_PASSWORD]: activationEvents[5],
    [EventName.VIEWED_CHECKOUT_PRODUCTS]: redemptionEvents[9],
    [EventName.GO_TO_CHECKOUT_SHIPPING]: redemptionEvents[10],
    [EventName.VIEWED_CHECKOUT_SHIPPING]: redemptionEvents[11],
    [EventName.GO_TO_CHECKOUT_BILLING]: redemptionEvents[12],
    [EventName.VIEWED_CHECKOUT_BILLING]: redemptionEvents[13],
    [EventName.VIEWED_CHECKOUT_CONFIRMATION]: redemptionEvents[15],
    [EventName.GO_TO_CHECKOUT_CONFIRMATION]: redemptionEvents[14],
    [EventName.REDEEM_PRODUCT]: redemptionEvents[16],
    [EventName.CLICKED_TRANSFER]: transferEvents[0],
    [EventName.VIEWED_TRANSFER]: transferEvents[1],
    [EventName.TRANSFER]: transferEvents[2],
}

const handlePurchasedProduct = (products: BasketItem[], reference: string) => {
    const coins = products
        .map(p => p.paymentTypes?.coin?.amount ?? 0)
        .reduce((sum, n) => sum + n, 0)
    const points = products
        .map(p => p.paymentTypes.points.amount)
        .reduce((sum, n) => sum + n, 0)
    const details: RedemptionSummary = {
        points,
        coins,
        category: products[0].categoryName,
    }
    localStorage.setItem(reference || 'points-redemption', JSON.stringify(details))
}

const handleViewedRedeemStatus = (reference: string | undefined, identification?: string) => {
    const raw = localStorage.getItem(reference || "points-redemption")
    if (!raw) return

    const s = JSON.parse(raw) as RedemptionSummary
    sendGtmEvent(withFunnelAux(redemptionEvents[17], s.category), identification)
    sendGtmEvent({
        ...conversionEvents[0],
        miles: s.points,
        value: s.coins,
        aux2: s.category,
    }, identification)
}

const handleClickedFilters = (filter: Brand | Category, type: "brand" | "category", identification?: string) => {
    if (type !== 'category') return
    const cat = filter as Category
    if (cat.parent) {
        sendGtmEvent(withFunnelAux(redemptionEvents[3], cat.name), identification)
        sendGtmEvent(withFunnelAux(redemptionEvents[4], cat.name), identification)
    } else {
        sendGtmEvent(withFunnelAux(redemptionEvents[2], cat.name), identification)
    }
}

const gtmProvider: AnalyticsProvider = {
    name: "gtm",
    track: (event: AnalyticsEvent) => {
        const identification = event.payload.identification
        const simple = SIMPLE_EVENT_MAP[event.name]
        if (simple) {
            sendGtmEvent(simple, identification)
            return
        }

        switch (event.name) {
        case EventName.LOGIN:
            sendGtmEvent(withFunnelAux(loginEvents[8], STATUS_AUX[event.payload.status]), identification)
            break
        case EventName.ACTIVE_ACCOUNT:
            sendGtmEvent(withFunnelAux(activationEvents[6], STATUS_AUX[event.payload.status]), identification)
            break
        case EventName.CLICKED_REDEMPTION: {
            const label = REDEMPTION_TAB_LABEL[event.payload.tab] ?? ""
            sendGtmEvent(withFunnelAux(redemptionEvents[1], label), identification)
            break
        }
        case EventName.CLICKED_FILTERS:
            handleClickedFilters(event.payload.filter, event.payload.type, identification)
            break
        case EventName.VIEWED_PRODUCT:
            sendGtmEvent(withFunnelAux(redemptionEvents[5], event.payload.category), identification)
            break
        case EventName.ADDED_PRODUCT:
            sendGtmEvent(withFunnelAux(redemptionEvents[6], event.payload.category), identification)
            break
        case EventName.VIEWED_COPAYMENT:
            sendGtmEvent(withFunnelAux(redemptionEvents[7], event.payload.category), identification)
            break
        case EventName.GO_TO_CHECKOUT:
            sendGtmEvent(withFunnelAux(redemptionEvents[8], event.payload.category), identification)
            break
        case EventName.PURCHASED_PRODUCT:
            handlePurchasedProduct(event.payload.products, event.payload.reference)
            break
        case EventName.VIEWED_REDEEM_STATUS:
            handleViewedRedeemStatus(event.payload.reference, identification)
            break
        case EventName.VIEWED_TRANSFER_STATUS: {
            const { amount, status } = event.payload
            sendGtmEvent(withFunnelAux(transferEvents[3], STATUS_AUX[status]), identification)
            if (status === 'success') {
                sendGtmEvent({ ...conversionEvents[1], miles: amount }, identification)
            }
            break
        }
        default:
            break
        }
    },
}

export default gtmProvider;
