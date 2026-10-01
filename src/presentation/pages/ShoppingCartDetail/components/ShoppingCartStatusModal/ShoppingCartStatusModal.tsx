"use client";

import { ReactNode } from "react";
import Button from "@/presentation/components/Form/components/Button/Button";
import Modal from "@/presentation/components/Modal";
import StatusIcon from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon";
import SupportBox from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/SupportBox";
import {PaymentStatus} from "@/domain/entity/Payment/payment";

type ShoppingCartStatusModalProps = {
    isOpen: boolean;
    title: string;
    description: ReactNode;
    secondaryDescription: ReactNode;
    showSupportBox: boolean;
    onClose: () => void;
    onGoToRedemptions: () => void
    isGoingToRedemptions?: boolean
    onBackToHome: () => void
    isGoingToHome?: boolean
    onRetry: () => void
    status: PaymentStatus
    retry: boolean
};

const ShoppingCartStatusModal = ({
    isOpen,
    title,
    description,
    secondaryDescription,
    showSupportBox,
    onClose,
    onRetry,
    onGoToRedemptions,
    isGoingToRedemptions,
    onBackToHome,
    isGoingToHome,
    status,
    retry
}: ShoppingCartStatusModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            placement="center"
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
                <StatusIcon status={status}/>
                <h2 className="mt-4 text-[20px] text-blue-500 leading-6 font-semibold">
                    {title}
                </h2>
                <p className="mt-1 typo-main-body-book">
                    {description}
                </p>
            </div>

            <div className="border-t border-darkGrayishBlue-300 pt-4 text-center">
                <p className="typo-main-body-book">
                    {secondaryDescription}
                </p>
            </div>

            {showSupportBox ? <SupportBox /> : null}

            <div className="grid grid-cols-1 gap-4 border-t border-darkGrayishBlue-300 pt-4 md:grid-cols-2">
                <Button
                    isLoading={isGoingToHome}
                    color="secondary"
                    className="border-darkGrayishBlue-300 bg-darkGrayishBlue-200"
                    onPress={onBackToHome}
                >
                    Volver al home
                </Button>
                <Button
                    isLoading={isGoingToRedemptions}
                    color="primary"
                    onPress={retry ? onRetry : onGoToRedemptions}
                >
                    {retry ? "Reiniciar tu compra" : "Ver mis pedidos"}
                </Button>
            </div>
        </Modal>
    );
};

export default ShoppingCartStatusModal;
