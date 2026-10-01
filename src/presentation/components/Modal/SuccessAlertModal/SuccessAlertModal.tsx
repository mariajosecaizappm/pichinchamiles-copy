"use client"

import Modal from "@/presentation/components/Modal"
import Button from "@/presentation/components/Form/components/Button/Button"

type SuccessAlertModalProps = {
    isOpen: boolean
    title: string
    description?: string
    continueLabel?: string
    onContinue: () => void
    successIcon?: React.ReactNode
}

const SuccessAlertModal = ({
    isOpen,
    title,
    description,
    continueLabel = "Continuar",
    onContinue,
    successIcon,
}: SuccessAlertModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            onClose={isOpenState => {
                if (!isOpenState) onContinue()
            }}
            classNames={{
                wrapper: "!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-3rem)] !max-w-[563px] !rounded-xl overflow-hidden",
                header: "hidden min-h-0 border-0 p-0",
                body: "flex flex-col p-0",
            }}
        >
            <div
                className="min-h-[62px] shrink-0 border-b border-darkGrayishBlue-300"
                aria-hidden
            />
            <div className="flex flex-col items-center p-6 pt-3">
                {successIcon && <div className="mb-4">{successIcon}</div>}
                <h2 className="text-center text-xl font-semibold leading-7 text-blue-500 md:text-h2 md:leading-normal">
                    {title}
                </h2>
                {
                    description && (
                        <p className="text-center text-base font-normal leading-6 text-grayscale-500">
                            {description}
                        </p>
                    )
                }
                <div className="mt-5 w-full">
                    <Button color="primary" className="h-12 text-sm font-semibold leading-6 w-full" onPress={onContinue}>
                        {continueLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default SuccessAlertModal
