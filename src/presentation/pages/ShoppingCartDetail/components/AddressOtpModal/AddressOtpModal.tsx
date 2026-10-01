"use client"

import { Otp } from "@/domain/entity/Otp/otp"
import OtpForm from "@/presentation/components/Layout/OtpForm"
import { OtpFormValues } from "@/presentation/components/Layout/OtpForm/OtpFormConfig"
import Modal from "@/presentation/components/Modal"

type AddressOtpModalProps = {
    otp: Otp | null
    onClose: () => void
    onValidateOtp: (values: OtpFormValues) => Promise<void>
    onResendOtp: () => Promise<void>
}

const AddressOtpModal = ({ otp, onClose, onValidateOtp, onResendOtp }: AddressOtpModalProps) => {
    if (!otp) return null

    return (
        <Modal
            isOpen
            onClose={(isOpen) => {
                if (!isOpen) onClose()
            }}
            headerButton={
                <span className="text-lg font-semibold text-blue-500">Código de seguridad</span>
            }
            classNames={{ base: "md:max-w-[456px]" }}
        >
            <OtpForm
                otp={otp}
                onSubmitOtp={async mfaRequest => {
                    await onValidateOtp({ code: mfaRequest.mfaCode })
                }}
                onResendOtp={onResendOtp}
            />
        </Modal>
    )
}

export default AddressOtpModal
