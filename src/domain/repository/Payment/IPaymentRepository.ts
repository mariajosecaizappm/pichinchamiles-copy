import {FeePaymentDetail, PaymentDetail} from "@/domain/entity/Payment/payment";

export default interface IPaymentRepository {
    getPendingTransaction(): Promise<string>
    getPaymentDetail(reference: string): Promise<PaymentDetail>
    getFeePaymentDetail(reference: string): Promise<FeePaymentDetail>
}
