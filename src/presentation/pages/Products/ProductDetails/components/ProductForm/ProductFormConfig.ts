import { PaymentMethod } from "@/domain/entity/Payment/payment"

export type ProductFormValues = {
    quantity: number
    paymentType: PaymentMethod
    points: number
    coins: number
    features: Record<string, string>
}

export const defaultProductFormValues: ProductFormValues = {
    quantity: 1,
    paymentType: PaymentMethod.POINTS,
    points: 0,
    coins: 0,
    features: {}
}

export const productFormErrors = () => {
    return "Ocurrió un error, inténtalo más tarde"
}

export const COPAYMENT_PERCENTAGE = 20
