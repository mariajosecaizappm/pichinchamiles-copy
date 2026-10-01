import {
    getFeePaymentDetailAdapter,
    getPaymentDetailAdapter,
    getPendingTransaction
} from "@/data/adapters/Payment/paymentAdapter";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import RepositoryBase from "@/data/repository/RepositoryBase";
import type IPaymentRepository from "@/domain/repository/Payment/IPaymentRepository";
import {injectable} from "inversify";
import {FeePaymentDetail, PaymentDetail} from "@/domain/entity/Payment/payment";

@injectable()
export default class PaymentRepository extends RepositoryBase implements IPaymentRepository {
    async getPendingTransaction(): Promise<string> {
        const { data } = await axPrivate.get(
            `${this.paymentsPrefix}/placetopay/${this.programId}/transactions/pending`
        );
        return getPendingTransaction(data);
    }

    async getPaymentDetail(reference: string): Promise<PaymentDetail>{
        const { data } = await axPrivate.get(`${this.paymentsPrefix}/placetopay/${this.programId}/transactions/lightbox/${reference}`);
        return getPaymentDetailAdapter(data);
    }

    async getFeePaymentDetail(reference: string): Promise<FeePaymentDetail> {
        const { data } = await axPrivate.get(`${this.paymentsPrefix}/placetopay/${this.programId}/v2/transactions/lightbox/${reference}`);
        return getFeePaymentDetailAdapter(data);
    }
}
