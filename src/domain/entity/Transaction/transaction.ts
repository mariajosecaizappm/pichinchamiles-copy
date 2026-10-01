import {ListParams} from "@/domain/entity/List/list";

export enum TransactionStatus {
    APPROVED = 'approved',
    PENDING = 'pending',
    REJECTED = 'rejected',
}

export enum TransactionTypes {
    UltraviajesActivityRedemption = 'ultraviajes_activity_redemption',
    ReversedUltraviajesActivityRedemption = 'reversed_ultraviajes_activity_redemption',
    UltraviajesHotelRedemption = 'ultraviajes_hotel_redemption',
    ReversedUltraviajesHotelRedemption = 'reversed_ultraviajes_hotel_redemption',
    UltraviajesFlightRedemption = 'ultraviajes_flight_redemption',
    ReversedUltraviajesFlightRedemption = 'reversed_ultraviajes_flight_redemption',
    UltraviajesDisneyRedemption = 'ultraviajes_disney_redemption',
    ReversedUltraviajesDisneyRedemption = 'reversed_ultraviajes_disney_redemption',
    UltraviajesCarRedemption = 'ultraviajes_car_redemption',
    ReversedUltraviajesCarRedemption = 'reversed_ultraviajes_car_redemption',
    UltraviajesTravelpackageRedemption = 'ultraviajes_travelpackage_redemption',
    ReversedUltraviajesTravelpackageRedemption = 'reversed_ultraviajes_travelpackage_redemption',
    NationalHotelRedemption = 'national_hotel_redemption',
    ReversedNationalHotelRedemption = 'reversed_national_hotel_redemption',
    NationalActivityRedemption = 'national_activity_redemption',
    ReversedNationalActivityRedemption = 'reversed_national_activity_redemption',
    Accreditation = 'accreditation',
    ReversedAccreditation = 'reversed_accreditation',
    TransferReceive = 'transfer_receive',
    ReversedTransferReceive = 'reversed_transfer_receive',
    ProgramTransferReceive = 'program_transfer_receive',
    ReversedProgramTransferReceive = 'reversed_program_transfer_receive',
    SavingPlan = 'saving_plan',
    TransferSend = 'transfer_send',
    ReversedTransferSend = 'reversed_transfer_send',
    AviosTransfer = 'avios_transfer',
    PointsPurchase = 'points_purchase',
    ReversedPointsPurchase = 'reversed_points_purchase',
    ProductRedemption = 'product_redemption',
    ReversedProductRedemption = 'reversed_product_redemption',
    ProgramTransferSend = 'program_transfer_send',
    ReversedProgramTransferSend = 'reversed_program_transfer_send',
    Donation = 'donation',
    PayCard = 'pay_card',
    Expiration = 'expiration',
    PayDebt = 'pay_debt',
    ReversedPayDebt = 'reversed_pay_debt',
    GiftcardRedemption = 'giftcard_redemption',
    ReversedGiftcardRedemption = 'reversed_giftcard_redemption',
    RewardsWebRedemption = 'rewards_web_redemption',
    ReverseRewardsWebRedemption = 'reverse_rewards_web_redemption'
}

export type TransactionDetail = {
    name?: string;
    quantity: number;
    totalPoints: number;
    totalCoins: number;
}

export type Transaction = {
    number: number
    details?: TransactionDetail[]
    paymentMethod?: string
    slug?: string
    pointsAmount: number
    balanceAfterOperation: number
    transactionType: TransactionTypes
    status: TransactionStatus
    createAt: string
    promo?: string
    cutOffDate?: string
    originalMemberUser?: string
    originalNumber?: number
    destinationMemberUser?: string
    destinationNumber?: number
}

export interface TransactionListParams extends ListParams {
    startDate?: Date
    endDate?: Date
}