import "reflect-metadata"
import {inject, injectable} from "inversify";
import type IPaymentRepository from "@/domain/repository/Payment/IPaymentRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {FeePaymentDetail} from "@/domain/entity/Payment/payment";

@injectable()
export default class GetFeePaymentUseCase {
    private readonly paymentRepository: IPaymentRepository;

    constructor(@inject(RepositoryTypes.PaymentRepository) paymentRepository: IPaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    getFeePaymentDetail(reference: string): Promise<FeePaymentDetail>{
        return this.paymentRepository.getFeePaymentDetail(reference);
    }
}