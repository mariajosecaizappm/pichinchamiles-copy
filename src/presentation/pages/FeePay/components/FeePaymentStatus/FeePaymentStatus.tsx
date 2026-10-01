"use client";

import {FC, useEffect, useState} from 'react';
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetFeePaymentUseCase from "@/domain/interactors/Payment/GetFeePaymentUseCase";
import {useRouter, useSearchParams} from "next/navigation";
import links from "@/presentation/config/links";
import {useQuery} from "@tanstack/react-query";
import {Spinner} from "@heroui/spinner";
import FeePaymentStatusModal from "@/presentation/pages/FeePay/components/FeePaymentStatus/FeePaymentStatusModal";

type FeePaymentStatusProps = {
    reference: string
}

const FeePaymentStatus: FC<FeePaymentStatusProps> = ({reference: referenceProp}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referenceFromParams = searchParams.get('reference');
    const reference = referenceFromParams || referenceProp;
    const paramsSignature = searchParams.toString();
    const getFeePaymentUseCase = container.get<GetFeePaymentUseCase>(UseCaseTypes.GetFeePaymentUseCase);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: feePaymentDetail, isLoading, isError, refetch } = useQuery({
        queryKey: ["feePayment", reference, paramsSignature],
        queryFn: () => getFeePaymentUseCase.getFeePaymentDetail(reference),
        refetchOnWindowFocus: false,
        staleTime: 0,
        enabled: Boolean(reference),
    })

    useEffect(() => {
        if(isError) router.push(links.home);
    }, [isError]);

    useEffect(() => {
        if (reference) {
            refetch();
        }
    }, [paramsSignature, reference, refetch]);

    useEffect(() => {
        if (!reference || !feePaymentDetail) {
            return;
        }
        setIsModalOpen(true);
    }, [feePaymentDetail, reference]);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleBackToHome = () => {
        setIsModalOpen(false);
        router.push(links.products);
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(74,74,80,0.8)]">
                    <Spinner
                        size="lg"
                        variant="simple"
                        aria-label="Consultando estado del fee de procesamiento"
                        classNames={{
                            wrapper: "text-white",
                        }}
                    />
                </div>
            )}

            {feePaymentDetail?.status && (
                <FeePaymentStatusModal
                    isOpen={isModalOpen}
                    paymentDetail={feePaymentDetail}
                    onClose={handleClose}
                    onBackToHome={handleBackToHome}
                />
            )}
        </>
    );
};

export default FeePaymentStatus;