"use client";

import {FC, ReactNode} from 'react';
import Modal from "@/presentation/components/Modal";
import StatusIcon
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon";
import SupportBox
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/SupportBox";
import Button from "@/presentation/components/Form/components/Button/Button";
import {PaymentStatus, FeePaymentDetail} from "@/domain/entity/Payment/payment";
import {formatCopaymentAmount} from "@/presentation/helpers/quantities";

type FeePaymentStatusModalProps = {
    isOpen: boolean;
    paymentDetail: FeePaymentDetail;
    onClose: () => void;
    onBackToHome: () => void;
};

type ModalContent = {
    title: string;
    description: ReactNode;
    secondaryDescription: ReactNode;
    showSupportBox: boolean;
    iconStatus: PaymentStatus;
};

const getModalContent = (
    status: PaymentStatus | null,
    reference: string,
    amount: number
): ModalContent => {
    const formattedAmount = `$ ${formatCopaymentAmount(amount)}`;

    switch (status) {
    case PaymentStatus.SUCCESS:
        return {
            title: "Pago aprobado",
            description: (
                <>
                    Tu pago con referencia <strong>No. {reference}</strong> por un valor
                    de <strong>{formattedAmount} dólares</strong> fue realizado exitosamente.
                </>
            ),
            secondaryDescription: (
                <>
                    Una copia de esta transacción fue enviada a tu correo electrónico.
                </>
            ),
            showSupportBox: false,
            iconStatus: PaymentStatus.SUCCESS,
        };
    case PaymentStatus.PENDING:
        return {
            title: "Pago pendiente",
            description: (
                <>
                    Tu pago con referencia <strong>No. {reference}</strong> por un
                    valor <strong> {formattedAmount} dólares</strong> se encuentra pendiente.
                </>
            ),
            secondaryDescription: (
                <>
                    Recibirás los detalles de la transacción a tu correo electrónico.
                </>
            ),
            showSupportBox: true,
            iconStatus: PaymentStatus.PENDING,
        };
    default:
        return {
            title: "Pago rechazado",
            description: (
                <>
                    Lo sentimos, tu pago con referencia <strong>No. {reference}</strong>{" "}
                    por un valor de <strong>{formattedAmount} dólares</strong> fue rechazado.
                </>
            ),
            secondaryDescription: (
                <>
                    Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros.
                </>
            ),
            showSupportBox: true,
            iconStatus: PaymentStatus.REJECTED,
        };
    }
};

const FeePaymentStatusModal: FC<FeePaymentStatusModalProps> = ({ isOpen, paymentDetail, onClose, onBackToHome }) => {
    const modalContent = getModalContent(
        paymentDetail.status,
        paymentDetail.reference,
        paymentDetail.totalAmount
    );

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            hideCloseButton
            isDismissable={false}
            onClose={(nextIsOpen) => {
                if (!nextIsOpen) onClose();
            }}
            classNames={{
                wrapper: "!p-4 md:!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-2rem)] !max-w-[456px] !rounded-xl overflow-hidden",
                body: "flex flex-col gap-4 !p-6",
            }}
        >
            <div className="flex flex-col items-center text-center">
                <StatusIcon status={modalContent.iconStatus}/>
                <h2 className="mt-4 text-[20px] text-blue-500 leading-6 font-semibold">
                    {modalContent.title}
                </h2>
                <p className="mt-1 typo-main-body-book">
                    {modalContent.description}
                </p>
            </div>

            <div className="border-t border-darkGrayishBlue-300 pt-4 text-center">
                <p className="typo-main-body-book">
                    {modalContent.secondaryDescription}
                </p>
            </div>

            {modalContent.showSupportBox ? <SupportBox/> : null}

            <div className="border-t border-darkGrayishBlue-300 pt-4">
                <Button
                    color="primary"
                    className="w-full"
                    onPress={onBackToHome}
                >
                    Volver al home
                </Button>
            </div>
        </Modal>
    );
};

export default FeePaymentStatusModal;
