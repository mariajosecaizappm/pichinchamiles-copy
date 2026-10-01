"use client"

import Modal from "@/presentation/components/Modal"
import Button from "@/presentation/components/Form/components/Button/Button"

type ConfirmationModalProps = {
    isOpen: boolean
    message: string
    title?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmationModal = ({
    isOpen,
    message,
    title,
    confirmLabel = "Salir",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
}: ConfirmationModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            onClose={isOpenState => {
                if (!isOpenState) onCancel()
            }}
            classNames={{
                wrapper: "!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-3rem)] !max-w-[563px] !rounded-xl overflow-hidden",
                header: "hidden min-h-0 border-0 p-0",
                body: "flex flex-col p-0",
                footer: "flex w-full gap-3 justify-center p-6 pt-5 font-sans",
                closeButton: "!z-50",
            }}
            footer={
                <>
                    <Button
                        color="secondary"
                        className="h-12 text-sm font-semibold leading-6"
                        onPress={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        color="primary"
                        className="h-12 text-sm font-semibold leading-6"
                        onPress={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <div
                className="pointer-events-none relative min-h-[62px] shrink-0 border-b border-darkGrayishBlue-300"
                aria-hidden
            />
            <div className="flex flex-col items-center p-6 pt-3">
                {title ? (
                    <>
                        <h2 className="text-center text-xl font-semibold leading-7 text-blue-500 md:text-[26px] md:leading-normal">
                            {title}
                        </h2>
                        <p className="mt-2 text-center text-base font-normal leading-6 text-grayscale-500">
                            {message}
                        </p>
                    </>
                ) : (
                    <p className="text-center text-xl font-semibold leading-7 text-blue-500 md:text-[26px] md:leading-normal">
                        {message}
                    </p>
                )}
            </div>
        </Modal>
    )
}

export default ConfirmationModal
