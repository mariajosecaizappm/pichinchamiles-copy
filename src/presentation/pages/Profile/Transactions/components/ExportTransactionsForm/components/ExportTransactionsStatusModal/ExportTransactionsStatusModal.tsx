import React from "react"
import Modal, { ModalInjectedProps } from "@/presentation/components/Modal";
import Button from "@/presentation/components/Form/components/Button/Button";
import SuccessIcon from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/SuccessIcon";
import ErrorIcon from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/ErrorIcon";
import { ExportTransactionsAlertType } from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/types";

export type ExportTransactionsStatusModalProps = ModalInjectedProps & {
    title: string
    description: string
    variant: "success" | "error"
}

export const exportTransactionsModalContent: Record<
    ExportTransactionsAlertType,
    Omit<ExportTransactionsStatusModalProps, keyof ModalInjectedProps>
> = {
    "report-ready": {
        variant: "success",
        title: "Tu reporte está listo",
        description: "Descargamos el detalle de tus transacciones. Para rangos menores a 6 meses, el archivo llega directo a tu dispositivo.",
    },
    "report-sent": {
        variant: "success",
        title: "Reporte enviado con éxito",
        description: "Tu solicitud cubre un rango de 6 a 12 meses, por lo que enviaremos el detalle de transacciones a tu correo electrónico.",
    },
    "review-dates": {
        variant: "error",
        title: "Revisa las fechas",
        description: "El rango de fechas debe ser máximo 12 meses. Por favor, ajusta las fechas de tu búsqueda.",
    },
    "reports-not-found": {
        variant: "error",
        title: "Aún no existen reportes",
        description: "No tienes transacciones en el rango de fechas seleccionado.",
    },
}

const ExportTransactionsStatusModal = ({
    isActive,
    onClose,
    title,
    description,
    variant,
}: ExportTransactionsStatusModalProps) => {
    const Icon = variant === "success" ? SuccessIcon : ErrorIcon

    return (
        <Modal
            isOpen={isActive}
            placement="center"
            onClose={(nextIsOpen) => {
                if (!nextIsOpen) onClose()
            }}
            classNames={{
                wrapper: "!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-0.5rem)] !max-w-[456px] !rounded-xl overflow-hidden",
                header: "hidden min-h-0 border-0 p-0",
                body: "flex flex-col p-0",
            }}
        >
            <div
                className="min-h-[62px] shrink-0 border-b border-darkGrayishBlue-300"
                aria-hidden
            />
            <div className="flex flex-col items-center px-6 pb-3 pt-3 text-center">
                <Icon />
                <h2 className="mt-4 typo-main-headline-3-prelo-semi-bold text-blue-500 leading-7">
                    {title}
                </h2>
                <p className="mt-1 text-base font-normal text-grayscale-500 text-center">
                    {description}
                </p>
            </div>
            <div className="border-t border-darkGrayishBlue-300 p-6 pt-5">
                <Button color="primary" className="h-12 w-full text-sm font-semibold leading-6" onPress={onClose}>
                    Aceptar
                </Button>
            </div>
        </Modal>
    )
}

export default ExportTransactionsStatusModal
