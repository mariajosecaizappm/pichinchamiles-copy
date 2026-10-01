import { List } from "@/domain/entity/List/list";
import {Order, OrderLine, ProductOrder, ShippingDetail, ShippingStatus, OrderStatus, ShippingAddress} from "@/domain/entity/Order/order";
import MD5 from "crypto-js/md5";

type OrderLineResponse = {
    productImageUrl: string
    mobileImageUrl: string
    productName: string
    totalCoins: number
    totalPoints: number
    quantity: number
}

type CourierStatusResponse = {
    status: ShippingStatus
    date: string
}

type ShippingDetailResponse = {
    guidNumber: string | null
    shippingStatus: ShippingStatus | null
    estimatedDeliveryDate: string | null
    isOwnDelivery: boolean
    orderLines: OrderLineResponse[]
    courierStatus: CourierStatusResponse[] | null
}

type ConsumptionEntityResponse = {
    estimatedDeliveredDate: string
    orderCreatedAt: string
    orderNumber: number
    orderStatus: OrderStatus
    shippingDetails: ShippingDetailResponse[]
    totalCoins: number
    totalPoints: number
    shippingAddress: ShippingAddress
}

type ConsumptionsApiResponse = {
    entities: ConsumptionEntityResponse[]
    pagination: {
        page: number
        total: number
    }
}

type ProductRedemptionItem = {
    brandName: string
    categoryId: string
    categoryName: string
    comments: string
    id: string
    isAvailability?: boolean
    paymentMethod: "copayment" | "points"
    paymentTypes: {
        points: {
            currencyId: string
            amount: number
        }
        coin?: {
            currencyId: string
            amount: number
        }
    }
    productId: string
    productType: ProductOrder["basket"]["items"][number]["productType"]
    quantity: number
    slug: string
    storeId: string
    supplierId: string
    variationId: string
    variationInfo: null
}

type ProductRedemptionPayload = {
    buyerId: string
    programId: string
    sess: string
    items: ProductRedemptionItem[]
    customer: ProductOrder["customer"]
    shippingAddress: ShippingAddress
    billingAddress: ShippingAddress
    paymentUrl: {
        cancelUrl: string
        returnUrl: string
    }
    comments: string
    sendAsGiftFlag: boolean
    mfaRequest?: NonNullable<ProductOrder["mfaRequest"]>
}

const sortOrderItems = (order: ProductOrder) =>{
    const items = order.basket.items.map(item=>{
        const orderItem: ProductRedemptionItem = {
            brandName: item.brandName,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            comments: "",
            id: item.id,
            isAvailability: item.isAvailability,
            paymentMethod: item.paymentTypes.coin ? "copayment" : "points",
            paymentTypes: {
                points: {
                    currencyId: item.paymentTypes.points.currencyId,
                    amount: item.paymentTypes.points.amount
                }
            },
            productId: item.productId,
            productType: item.productType,
            quantity: item.quantity,
            slug: item.slug,
            storeId: item.storeId,
            supplierId: item.supplierId,
            variationId: item.variationId,
            variationInfo: null
        }

        if(item.paymentTypes.coin){
            orderItem.paymentTypes.coin = {
                currencyId: item.paymentTypes.coin.currencyId,
                amount: item.paymentTypes.coin.amount
            }
        }

        return orderItem
    }).sort((a, b) => {
        if (a.paymentMethod === "copayment" && b.paymentMethod !== "copayment") {
            return -1;
        }
        if (b.paymentMethod === "copayment" && a.paymentMethod !== "copayment") {
            return 1;
        }
        return 0;
    })

    return items
}

export const productRedemptionAdapter = (
    order: ProductOrder,
    kountSessionId: string,
    programId: string
): ProductRedemptionPayload => {
    const adaptedOrder: ProductRedemptionPayload = {
        buyerId: order.basket.buyerId,
        programId,
        sess: kountSessionId,
        items: sortOrderItems(order),
        customer: order.customer,
        shippingAddress: {
            customerReceivingFirstName: order.shippingAddress.customerReceivingFirstName,
            customerReceivingLastName: order.shippingAddress.customerReceivingLastName,
            customerReceivingEmail: order.shippingAddress.customerReceivingEmail || order.customer.email,
            customerReceivingPhone: order.shippingAddress.customerReceivingPhone,
            customerReceivingIdentificationNumber: order.shippingAddress.customerReceivingIdentificationNumber,
            customerReceivingIdentificationType: order.shippingAddress.customerReceivingIdentificationType,
            reference: order.shippingAddress.reference,
            street1: order.shippingAddress.street1,
            street2: order.shippingAddress.street2,
            number: order.shippingAddress.number,
            companyName: "",
            secondPhone: order.shippingAddress.secondPhone,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country.name,
            state: order.shippingAddress.state.name,
            city: order.shippingAddress.city.name,
            zone: order.shippingAddress.zone.name,
            alias: order.shippingAddress.alias,
            sector: null,
            isThirdPartyAddress: order.shippingAddress.isThirdPartyAddress
        },
        billingAddress: {
            customerReceivingFirstName: order.billingAddress.customerReceivingFirstName,
            customerReceivingLastName: order.billingAddress.customerReceivingLastName,
            customerReceivingEmail: order.billingAddress.customerReceivingEmail,
            customerReceivingPhone: order.billingAddress.customerReceivingPhone,
            customerReceivingIdentificationNumber: order.billingAddress.customerReceivingIdentificationNumber,
            customerReceivingIdentificationType: order.billingAddress.customerReceivingIdentificationType,
            reference: order.billingAddress.reference,
            street1: order.billingAddress.street1,
            street2: order.billingAddress.street2,
            number: order.billingAddress.number,
            companyName: order.billingAddress.companyName ?? "",
            secondPhone: order.billingAddress.secondPhone,
            postalCode: order.billingAddress.postalCode,
            country: order.billingAddress.country.name,
            state: order.billingAddress.state.name,
            city: order.billingAddress.city.name,
            zone: order.billingAddress.zone.name,
            alias: order.billingAddress.alias,
            sector: null,
            isThirdPartyAddress: order.billingAddress.isThirdPartyAddress
        },
        paymentUrl: {
            cancelUrl: window.location.href,
            returnUrl: window.location.href
        },
        comments: "",
        sendAsGiftFlag: false
    }

    if (order.mfaRequest) {
        adaptedOrder.mfaRequest = order.mfaRequest;
    }

    return adaptedOrder
}

export const generateIdempotencyHash = (payload: object, programId: string): string => {
    const dataRequest = `${JSON.stringify(payload)}-${programId}`;
    return MD5(dataRequest).toString().toLowerCase();
};

const orderLineAdapter = (orderLine: OrderLineResponse): OrderLine =>{
    return{
        image: {
            desktopUrl: orderLine.productImageUrl,
            mobileUrl: orderLine.mobileImageUrl,
        },
        productName: orderLine.productName,
        totalCoins: orderLine.totalCoins,
        totalPoints: orderLine.totalPoints,
        quantity: orderLine.quantity,
    }
}

const shippingDetailAdapter = (detail: ShippingDetailResponse): ShippingDetail => {
    return {
        guidNumber: detail.guidNumber || "",
        shippingStatus: detail.shippingStatus || ShippingStatus.PENDING,
        isOwnDelivery: detail.isOwnDelivery,
        orderLines: detail.orderLines.map(orderLineAdapter),
        tracking: detail.courierStatus?.map((status) => ({
            status: status.status,
            trackingDate: new Date(status.date),
        })) || [],
    }
}

const consumptionAdapter = (entity: ConsumptionEntityResponse): Order =>{
    return {
        estimatedDeliveredDate: new Date(entity.estimatedDeliveredDate),
        orderCreatedAt: new Date(entity.orderCreatedAt),
        orderNumber: entity.orderNumber.toString(),
        orderStatus: entity.orderStatus,
        shippingDetails: entity.shippingDetails.map(shippingDetailAdapter),
        totalCoins: entity.totalCoins,
        totalPoints: entity.totalPoints,
        shippingAddress: entity.shippingAddress
    }
}

export const getConsumptionsAdapter = (data: ConsumptionsApiResponse, pageSize: number): List<Order> =>{
    const page = data.pagination.page + 1;
    const { total } = data.pagination;
    const totalPages = Math.ceil(total / pageSize);

    return {
        data: data.entities.map(consumptionAdapter).sort(
            (a, b) => b.orderCreatedAt.getTime() - a.orderCreatedAt.getTime()
        ),
        pagination: {
            page,
            pageSize,
            total,
            totalPages
        }
    }
}