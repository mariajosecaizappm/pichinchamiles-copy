"use client"

import Modal from "@/presentation/components/Modal"
import Button from "@/presentation/components/Form/components/Button/Button"
import ModalInfoIcon from "@/presentation/components/icons/ModalInfoIcon"

type BalanceZeroModalProps = {
    isOpen: boolean
    title: string
    description: string
    continueLabel: string
    onGoHome: () => void
}

const BalanceZeroModal = ({
    isOpen,
    title,
    description,
    continueLabel,
    onGoHome,
}: BalanceZeroModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            hideCloseButton
            isDismissable={false}
            isKeyboardDismissDisabled
            onClose={() => undefined}
            classNames={{
                wrapper: "!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-3rem)] !max-w-[456px] !rounded-xl overflow-hidden",
                header: "hidden min-h-0 border-0 p-0",
                body: "flex flex-col p-0",
                footer: "pt-4",
            }}
            footer={
                <Button
                    color="primary"
                    className="h-12 w-full font-sans text-sm font-semibold leading-6"
                    onPress={onGoHome}
                    testId="balanceZeroGoHome"
                    aria-label={continueLabel}
                >
                    {continueLabel}
                </Button>
            }
        >
            <div
                className="min-h-[62px] shrink-0 border-b border-darkGrayishBlue-300"
                aria-hidden
            />
            <div className="flex flex-col items-center p-6 pt-3">
                <ModalInfoIcon className="size-12" />
                <h2 className="typo-main-headline-3-prelo-semi-bold mt-4 text-center text-blue-500">
                    {title}
                </h2>
                <p className="mt-2 text-center font-sans text-base font-medium leading-6 text-grayscale-500">
                    {description}
                </p>
            </div>
        </Modal>
    )
}

export default BalanceZeroModal
