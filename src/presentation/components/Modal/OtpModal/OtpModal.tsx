"use client"

import type { FC } from "react"
import type { OtpFormProps } from "@/presentation/components/Layout/OtpForm/OtpFormContainer"
import OtpForm from "@/presentation/components/Layout/OtpForm"
import Modal, { ModalInjectedProps } from "@/presentation/components/Modal"

export type OtpModalBaseProps = OtpFormProps & {
    title?: string
    onModalClose?: () => void
}

type OtpModalProps = OtpModalBaseProps & ModalInjectedProps

const DEFAULT_TITLE = "Código de seguridad"

const OtpModal: FC<OtpModalProps> = ({
    isActive,
    title = DEFAULT_TITLE,
    onModalClose,
    onClose,
    ...otpFormProps
}) => {
    const handleClose = (isOpen: boolean) => {
        if (isOpen) return

        onModalClose?.()
        onClose()
    }

    return (
        <Modal
            isOpen={isActive}
            onClose={handleClose}
            headerButton={
                <></>
            }
            classNames={{ base: "md:max-w-[456px] h-auto! m-auto! rounded-xl!", wrapper: "p-6! sm:p-6! md:p-0!" }}
        >
            <OtpForm {...otpFormProps} title={title} />
        </Modal>
    )
}

export default OtpModal
