import {Basket} from "@/domain/entity/Basket/structure/basket";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import {Address} from "@/domain/entity/Address/structure/address";
import { Asset } from "../Asset/asset";
import { ListParams } from "../List/list";

export type ProductOrder = {
    basket: Basket
    mfaRequest?: MfaRequest
    customer: {
        firstName: string
        lastName: string
        identificationType: string
        identificationNumber: string
        email: string
        phone: string
        secondPhone: string
        companyName: string
        city: string
    }
    billingAddress: Address
    shippingAddress: Address
}

export type ProductOrderProcessed = {
    balanceAfterOperation: number
    paymentGatewayReference: string
    placeToPayUrl: string
}

export enum OrderStatus {
    PENDING = 'pending',
    CREATED = 'created',
    APPROVED = 'approved',
    CANCELED = 'canceled',
    REJECTED = 'rejected',
    PAY_PENDING = 'paypending',
    PAID = 'paid',
    DELIVERED = 'delivered',
    NOVELTY = 'novelty'
}

export enum ShippingStatus {
    PENDING = 'pending',
    ASSIGNED = "assigned",
    WAIT_TO_SEND = "waitingtosend",
    ARRIVED_AT_THE_LOCAL = "arrivedatthelocal",
    DELIVERED = "delivered",
    NOVELTY = "novelty",
    WITH_DRAWN = "withdrawn",
    CANCELED = 'canceled',
}

export type OrderLine = {
    image: Asset
    productName: string
    quantity: number
    totalCoins: number
    totalPoints: number
}

export type ShippingTracking = {
    status: ShippingStatus
    trackingDate: Date
}

export type ShippingDetail = {
    guidNumber: string
    isOwnDelivery: boolean
    shippingStatus: ShippingStatus
    orderLines: OrderLine[]
    tracking: ShippingTracking[]
}


export type Order = {
    estimatedDeliveredDate: Date
    orderCreatedAt: Date
    orderNumber: string
    orderStatus: OrderStatus
    shippingDetails: ShippingDetail[]
    totalCoins: number
    totalPoints: number
    shippingAddress: ShippingAddress
}

export interface OrderListParams extends ListParams {
    orderNumber?: string
}

export interface ShippingAddress {
    customerReceivingFirstName: string
    customerReceivingLastName: string
    customerReceivingEmail: string
    customerReceivingPhone: string
    customerReceivingIdentificationNumber: string
    customerReceivingIdentificationType: string
    reference: string
    street1: string
    street2: string
    number: string
    companyName: string
    secondPhone: string
    postalCode: string
    country: string
    state: string
    city: string
    zone: string
    alias: string
    sector: null
    isThirdPartyAddress: boolean
}