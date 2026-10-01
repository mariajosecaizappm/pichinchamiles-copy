"use client";

import { ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PaymentStatus } from "@/domain/entity/Payment/payment";
import { ModalInjectedProps } from "@/presentation/components/Modal";
import links from "@/presentation/config/links";
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities";
import { maskedEmail } from "@/presentation/helpers/member";
import useSession from "@/presentation/hooks/useSession";
import ShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/ShoppingCartStatusModal";
import { OpenShoppingCartStatusModalParams } from "@/presentation/pages/ShoppingCartDetail/types";
import { CONSUMPTIONS_PARAM, PENDING_ORDER_PARAM, } from "@/presentation/pages/Orders/OrdersConfig";
import { encryptText } from "@/data/provider/crypto/actions";

type ShoppingCartStatusModalContainerProps =
    OpenShoppingCartStatusModalParams & ModalInjectedProps;

type ShoppingCartStatusModalContent = {
    title: string;
    description: ReactNode;
    secondaryDescription: ReactNode;
    showSupportBox: boolean;
    retry: boolean
};

const getModalContent = ({
    status,
    type,
    reference,
    amount,
    email,
}: Pick<
    ShoppingCartStatusModalContainerProps,
    "status" | "type" | "reference"
> & {
    amount: number;
    email: string;
}): ShoppingCartStatusModalContent => {
    if (type === "redemption" && status === PaymentStatus.SUCCESS) {
        return {
            title: "Canje exitoso",
            description: (
                <>
                    Tu pedido con un valor de{" "}
                    <strong>{formatMiles(amount)} millas</strong> fue realizado exitosamente.
                </>
            ),
            secondaryDescription: (
                <>
                    Una copia de esta transacción fue enviada a tu correo electrónico
                    registrado: <strong>{email}</strong>
                </>
            ),
            showSupportBox: false,
            retry: false,
        };
    }

    if (type === "redemption" && status === PaymentStatus.REJECTED) {
        return {
            title: "Canje rechazado",
            description: (
                <>
                    Lo sentimos, tu pedido con un valor de{" "}
                    <strong>{formatMiles(amount)} millas</strong> fue rechazado.
                </>
            ),
            secondaryDescription: "Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros.",
            showSupportBox: true,
            retry: true,
        };
    }

    if (status === PaymentStatus.SUCCESS) {
        return {
            title: "Pago aprobado",
            description: (
                <>
                    Tu pago con referencia No. <strong>{reference}</strong> por un valor de{" "}
                    <strong>${formatCopaymentAmount(amount)} dólares</strong> fue realizado exitosamente.
                </>
            ),
            secondaryDescription: (
                <>
                    Una copia de esta transacción fue enviada a tu correo electrónico
                    registrado: <strong>{email}</strong>
                </>
            ),
            showSupportBox: false,
            retry: false,
        };
    }

    if (status === PaymentStatus.PENDING) {
        return {
            title: "Pago pendiente",
            description: (
                <>
                    Tu pago con referencia No. <strong>{reference}</strong> por un valor de{" "}
                    <strong>${formatCopaymentAmount(amount)} dólares</strong> se encuentra pendiente.
                </>
            ),
            secondaryDescription: (
                <>
                    Recibirás los detalles de la transacción a tu correo electrónico:{" "}
                    <strong>{email}</strong>
                </>
            ),
            showSupportBox: true,
            retry: false,
        };
    }

    return {
        title: "Pago rechazado",
        description: (
            <>
                Lo sentimos, tu pago con referencia No. <strong>{reference}</strong>{" "}
                por un valor de <strong>${formatCopaymentAmount(amount)} dólares</strong> fue rechazado.
            </>
        ),
        secondaryDescription: "Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros.",
        showSupportBox: true,
        retry: false,
    };
};

const ShoppingCartStatusModalContainer = ({
    isActive,
    onClose,
    ...contentProps
}: ShoppingCartStatusModalContainerProps) => {
    const router = useRouter();
    const { member } = useSession();
    const [isGoingToRedemptions, setIsGoingToRedemptions] = useState(false);
    const [isGoingToHome, setIsGoingToHome] = useState(false);
    const [, startTransition] = useTransition();
    const maskedEmailValue = member?.enrollmentEmail?.includes("@")
        ? maskedEmail(member.enrollmentEmail)
        : "";
    const content = getModalContent({
        ...contentProps,
        email: maskedEmailValue,
    });

    const handleClose = () => {
        onClose();
    };

    const handleGoToRedemptions = async () => {
        setIsGoingToRedemptions(true);
        try {
            const orderType = contentProps.type;
            const params = new URLSearchParams();
            if (orderType === "redemption") {
                const consumptions = await encryptText(contentProps.consumptions ?? "0");
                params.set(CONSUMPTIONS_PARAM, consumptions);
            } else {
                const reference = await encryptText(contentProps.reference);
                params.set(PENDING_ORDER_PARAM, reference);
            }

            startTransition(() => {
                const queryString = params.toString();
                router.push(queryString ? `${links.myOrders}?${queryString}` : links.myOrders);
            });

            onClose();
        } finally {
            setIsGoingToRedemptions(false);
        }
    };

    const handleBackToHome = () => {
        setIsGoingToHome(true);
        startTransition(() => {
            router.push(links.products);
        });
        onClose();
    };

    const handleRetry = () => onClose();

    return (
        <ShoppingCartStatusModal
            isOpen={isActive}
            title={content.title}
            description={content.description}
            secondaryDescription={content.secondaryDescription}
            showSupportBox={content.showSupportBox}
            onClose={handleClose}
            onGoToRedemptions={handleGoToRedemptions}
            onBackToHome={handleBackToHome}
            onRetry={handleRetry}
            status={contentProps.status}
            isGoingToHome={isGoingToHome}
            isGoingToRedemptions={isGoingToRedemptions}
            retry={content.retry}
        />
    );
};

export default ShoppingCartStatusModalContainer;
