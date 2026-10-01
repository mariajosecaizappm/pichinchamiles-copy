import React, {FC, useRef, useState} from 'react';
import AddressFormContainer from "@/presentation/forms/AddressForm/AddressFormContainer";
import Modal, { ModalInjectedProps } from "@/presentation/components/Modal";
import {Address} from "@/domain/entity/Address/structure/address";
import { MfaRequest } from "@/domain/entity/Otp/otp";
import {AddressFormValues} from "@/presentation/forms/AddressForm/AddressFormConfig";
import ConfirmationModal from "@/presentation/components/Modal/ConfirmationModal";
import SuccessAlertModal from "@/presentation/components/Modal/SuccessAlertModal";
import container from "@/presentation/config/inversify.config";
import UpdateMemberUseCase from "@/domain/interactors/Member/UpdateMemberUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import AddMemberAddressUseCase from "@/domain/interactors/Address/AddMemberAddressUseCase";
import UpdateMemberAddressUseCase from "@/domain/interactors/Address/UpdateMemberAddressUseCase";
import useAddress from "@/presentation/hooks/useAddress";
import useOtp from "@/presentation/hooks/useOtp";

const ADDRESS_MESSAGES = {
    updateTitle: "Dirección actualizada correctamente",
    updateDescription: "La dirección se ha editado de manera exitosa",
    createTitle: "Dirección creada correctamente",
    createDescription: "La dirección se ha registrado de manera exitosa",
} as const

type SuccessContent = {
    title: string
    description: string
}

type AddressModalProps = {
    address: AddressFormValues
    title: string
    submitText: string
} & ModalInjectedProps

type AddressSubmitParams = {
    values: AddressFormValues
    country: Address["country"]
}

const AddressModal: FC<AddressModalProps> = ({
    address,
    title,
    submitText,
    onClose,
    isActive
}) => {
    const memberUseCase = container.get<UpdateMemberUseCase>(UseCaseTypes.UpdateMemberUseCase)
    const addMemberAddressUseCase = container.get<AddMemberAddressUseCase>(UseCaseTypes.AddMemberAddressUseCase)
    const updateMemberAddressUseCase = container.get<UpdateMemberAddressUseCase>(UseCaseTypes.UpdateMemberAddressUseCase)
    const { refetchAddresses } = useAddress();
    const validatedOtpRef = useRef(false)
    const [isFormOpen, setIsFormOpen] = useState(true)
    const [successContent, setSuccessContent] = useState<SuccessContent | null>(null)
    const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)
    const [formAddress, setFormAddress] = useState(address)

    const hideForm = () => {
        setIsFormOpen(false)
        setShowUnsavedConfirm(false)
    }

    const closeAddressModal = () => {
        hideForm()
        onClose()
    }

    const showAddressSuccess = (edit: boolean) => {
        setSuccessContent({
            title: edit ? ADDRESS_MESSAGES.updateTitle : ADDRESS_MESSAGES.createTitle,
            description: edit ? ADDRESS_MESSAGES.updateDescription : ADDRESS_MESSAGES.createDescription,
        })
    }

    const getAddressPayload = ({ values, country }: AddressSubmitParams): Address => ({
        ...values,
        country,
        state: values.state!,
        city: values.city!,
        zone: values.zone!,
    })

    const saveAddress = async (addressPayload: Address, edit: boolean) => {
        if (edit) {
            await updateMemberAddressUseCase.updateMemberAddress(addressPayload)
        } else {
            await addMemberAddressUseCase.addMemberAddress(addressPayload)
        }

        showAddressSuccess(edit)
        refetchAddresses()
        hideForm()
    }

    const { withOtp } = useOtp<AddressSubmitParams>({
        title: "Código de seguridad",
        onSubmitOtp: async (mfaRequest: MfaRequest, submitParams) => {
            await memberUseCase.validateOtpUpdateInformation({
                address: getAddressPayload(submitParams),
                mfaCode: mfaRequest.mfaCode,
                mfaToken: mfaRequest.mfaToken,
            })
            validatedOtpRef.current = true
        },
        onRequestOtp: async () => {
            validatedOtpRef.current = false
            return await memberUseCase.updateMember({ isAddress: true })
        },
        onContinue: async (submitParams) => {
            const addressPayload = getAddressPayload(submitParams)
            const isEdit = !!submitParams.values.id

            try {
                if (validatedOtpRef.current) {
                    showAddressSuccess(isEdit)
                    refetchAddresses()
                    hideForm()
                    return
                }

                await saveAddress(addressPayload, isEdit)
            } finally {
                validatedOtpRef.current = false
            }
        },
    })

    const handleSubmit = async (values: AddressFormValues, country: Address["country"]) => {
        setFormAddress(values)
        await withOtp({ values, country })
    }

    const handleClose = (isOpenState?: boolean) => {
        if (isOpenState) return
        setShowUnsavedConfirm(true)
    }

    const handleConfirmExit = () => {
        closeAddressModal()
    }

    const handleCancelExit = () => {
        setShowUnsavedConfirm(false)
    }

    const handleSuccessContinue = () => {
        setSuccessContent(null)
        closeAddressModal()
    }

    return (
        <>
            {isFormOpen ? (
                <Modal
                    isOpen={isActive}
                    placement="center"
                    onClose={handleClose}
                    headerButton={
                        <span className="font-sans font-semibold leading-6 text-base">
                            {title}
                        </span>
                    }
                    classNames={{
                        base: "!m-auto !flex !flex-col !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-3rem)] !max-w-[888px] md:!h-[670px] md:!max-h-[670px] !rounded-xl overflow-hidden",
                        body: "flex min-h-0 flex-1 flex-col overflow-hidden !p-0",
                    }}
                >
                    <AddressFormContainer
                        address={formAddress}
                        onSubmit={handleSubmit}
                        saveText={submitText}
                    />
                </Modal>
            ) : null}
            <ConfirmationModal
                isOpen={showUnsavedConfirm}
                message="¿Deseas salir sin guardar los cambios?"
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
            />

            <SuccessAlertModal
                isOpen={successContent !== null}
                title={successContent?.title ?? ""}
                description={successContent?.description ?? ""}
                onContinue={handleSuccessContinue}
            />
        </>
    )
}

export default AddressModal
