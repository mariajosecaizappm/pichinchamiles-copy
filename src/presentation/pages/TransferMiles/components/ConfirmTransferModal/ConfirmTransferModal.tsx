"use client"

import { Icon } from "@iconify/react"
import Modal from "@/presentation/components/Modal"
import Button from "@/presentation/components/Form/components/Button/Button"
import { formatMiles } from "@/presentation/helpers/quantities"

type ConfirmTransferModalProps = {
    isOpen: boolean
    miles: number
    beneficiaryName: string
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmTransferModal = ({
    isOpen,
    miles,
    beneficiaryName,
    onConfirm,
    onCancel,
}: ConfirmTransferModalProps) => {
    const formattedMiles = formatMiles(miles)

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            onClose={(nextOpen) => {
                if (!nextOpen) onCancel()
            }}
            classNames={{
                wrapper: "!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-3rem)] !max-w-[456px] !rounded-xl overflow-hidden",
                header: "hidden min-h-0 border-0 p-0",
                body: "flex flex-col p-0",
                footer: "pt-4",
            }}
            footer={
                <div className="flex w-full gap-3">
                    <Button
                        color="secondary"
                        className="h-12 font-sans text-sm font-semibold leading-6"
                        onPress={onCancel}
                        testId="confirmTransferCancel"
                        aria-label="Cancelar transferencia"
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        className="h-12 font-sans text-sm font-semibold leading-6"
                        onPress={onConfirm}
                        testId="confirmTransferConfirm"
                        aria-label="Confirmar transferencia"
                    >
                        Confirmar
                    </Button>
                </div>
            }
        >
            <div
                className="min-h-[62px] shrink-0 border-b border-darkGrayishBlue-300"
                aria-hidden
            />
            <div className="flex flex-col items-center p-6 pt-3">
                <div className="w-min rounded-full bg-success-50 p-2.5" aria-hidden>
                    <span className="flex size-[27px] items-center justify-center rounded-full bg-success-500">
                        <Icon icon="ic:round-check" className="size-4.5 text-white" />
                    </span>
                </div>
                <h2 className="typo-main-headline-3-prelo-semi-bold mt-4 text-center text-blue-500">
                    ¿Confirmas la transferencia?
                </h2>
                <p className="mt-2 text-center font-sans text-base font-medium leading-6 text-grayscale-500">
                    Estás a punto de transferir
                    <br />
                    {formattedMiles} millas a {beneficiaryName}
                </p>
            </div>
        </Modal>
    )
}

export default ConfirmTransferModal
