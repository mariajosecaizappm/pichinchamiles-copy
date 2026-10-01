"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import UpdateMemberUseCase from "@/domain/interactors/Member/UpdateMemberUseCase"
import { FormRef } from "@/presentation/components/Form/context/Form"
import SuccessAlertModal from "@/presentation/components/Modal/SuccessAlertModal"
import container from "@/presentation/config/inversify.config"
import useOtp from "@/presentation/hooks/useOtp"
import useSession from "@/presentation/hooks/useSession"
import { Skeleton } from "@heroui/react"
import { useRef, useState } from "react"
import { SuccessSnackbarIcon } from "../../Products/ProductDetails/components/ProductForm/components/Snackbar"
import SecurityForm from "./SecurityForm"
import { EmailFormValues, SecurityFormValues } from "./types"
import { getOtpValidationData } from "./SecurityFormConfig"

const SecurityFormContainer = () => {
    const { member, updateEmail, isValidatingSession } = useSession()
    const formRef = useRef<FormRef>(null);
    const [show, setShow] = useState({ emailForm: false, passwordForm: false });
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    const updateMemberUseCase = container.get<UpdateMemberUseCase>(UseCaseTypes.UpdateMemberUseCase)

    const { withOtp } = useOtp<SecurityFormValues>({
        title: "Código de seguridad",
        onSubmitOtp: async (mfaRequest, values) => {
            await updateMemberUseCase.validateOtpUpdateInformation({
                ...getOtpValidationData(values, show),
                mfaCode: mfaRequest.mfaCode,
                mfaToken: mfaRequest.mfaToken,
            })
        },
        onRequestOtp: async (values) => {
            return await updateMemberUseCase.updateMember(getOtpValidationData(values, show))
        },
        onContinue: async (values) => {
            setIsSuccessModalOpen(true)
            const emailConfirmation = (values as EmailFormValues).emailConfirmation
            const isEmailUpdate = Boolean(emailConfirmation)

            if (isEmailUpdate) {
                updateEmail(emailConfirmation!)
                formRef.current?.setFieldValue("email", emailConfirmation!)
                formRef.current?.setFieldValue("newEmail", undefined)
                formRef.current?.setFieldValue("emailConfirmation", undefined)
            }

            setShow({ emailForm: false, passwordForm: false })

            if (!isEmailUpdate) {
                formRef.current?.reset()
            }
        },
    })

    const handleUpdateSecurityData = async (values: SecurityFormValues) => {
        await withOtp(values)
    }

    if(isValidatingSession) {
        return <div className="body-container pt-3 pb-6 md:max-w-[676px]">
            <Skeleton className="w-full h-60 rounded-lg border border-darkGrayishBlue-100" />
        </div>;
    }

    if (!member) {
        return null
    }

    return (
        <>
            <SecurityForm member={member} show={show} setShow={setShow} onUpdateSecurityData={handleUpdateSecurityData} formRef={formRef} />
            <SuccessAlertModal
                isOpen={isSuccessModalOpen}
                title="Datos actualizados exitosamente"
                continueLabel="OK"
                onContinue={() => setIsSuccessModalOpen(false)}
                successIcon={<SuccessSnackbarIcon />}
            />
        </>
    )
}

export default SecurityFormContainer