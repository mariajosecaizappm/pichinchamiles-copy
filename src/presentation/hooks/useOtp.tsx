"use client"

import { useEffect, useRef, useState } from "react"
import { MfaRequest, Otp } from "@/domain/entity/Otp/otp"
import { useModal } from "@/presentation/components/Modal"
import OtpModal, {
    OtpModalBaseProps,
} from "@/presentation/components/Modal/OtpModal"

type PendingSubmitState<TSubmitParams> = {
    submitParams: TSubmitParams
}

export type UseOtpConfig<TSubmitParams> = {
    title?: string
    onSubmitOtp: (mfaRequest: MfaRequest, submitParams: TSubmitParams) => Promise<void>
    onRequestOtp: (submitParams: TSubmitParams) => Promise<Otp | null>
    onContinue: (submitParams: TSubmitParams) => Promise<void> | void
    onSubmitOtpSuccess?: (submitParams: TSubmitParams) => Promise<void> | void
    onModalClose?: () => void
    onBlockUser?: (blockedUntil: Date) => void
    onUnblockUser?: () => void
    onContinueBlockUser?: () => void
}

const useOtp = <TSubmitParams,>(config: UseOtpConfig<TSubmitParams>) => {
    const { isOpen, openModal, closeModal } = useModal("otpModal");
    const configRef = useRef(config);
    const [pendingSubmitState, setPendingSubmitState] =
        useState<PendingSubmitState<TSubmitParams> | null>(null)
    const pendingSubmitStateRef = useRef<PendingSubmitState<TSubmitParams> | null>(null)

    useEffect(() => {
        configRef.current = config
    }, [config])

    const setPendingSubmitParams = (submitParams: TSubmitParams) => {
        const nextPendingSubmitState = { submitParams }
        pendingSubmitStateRef.current = nextPendingSubmitState
        setPendingSubmitState(nextPendingSubmitState)
    }

    const clearPendingSubmitParams = () => {
        pendingSubmitStateRef.current = null
        setPendingSubmitState(null)
    }

    const closeActiveOtpModal = () => {
        closeModal()
    }

    const closeOtpModal = () => {
        closeActiveOtpModal()
        clearPendingSubmitParams()
    }

    const continueFlow = async (
        submitParams: TSubmitParams,
        options?: { callOnSubmitOtpSuccess?: boolean }
    ) => {
        try {
            await configRef.current.onContinue(submitParams)

            if (options?.callOnSubmitOtpSuccess) {
                await configRef.current.onSubmitOtpSuccess?.(submitParams)
            }
        } finally {
            clearPendingSubmitParams()
        }
    }

    const getOtpModalProps = (otp: Otp): OtpModalBaseProps => ({
        otp,
        title: configRef.current.title,
        onModalClose: () => {
            clearPendingSubmitParams()
            configRef.current.onModalClose?.()
        },
        onBlockUser: configRef.current.onBlockUser,
        onUnblockUser: configRef.current.onUnblockUser,
        onContinueBlockUser: configRef.current.onContinueBlockUser,
        onSubmitOtp: async (mfaRequest) => {
            const currentPendingSubmitState = pendingSubmitStateRef.current
            if (!currentPendingSubmitState) return

            await configRef.current.onSubmitOtp(
                mfaRequest,
                currentPendingSubmitState.submitParams
            )
            closeActiveOtpModal()
            await continueFlow(currentPendingSubmitState.submitParams, {
                callOnSubmitOtpSuccess: true,
            })
        },
        onResendOtp: async () => {
            const currentPendingSubmitState = pendingSubmitStateRef.current
            if (!currentPendingSubmitState) return

            const nextOtp = await configRef.current.onRequestOtp(
                currentPendingSubmitState.submitParams
            )

            if (nextOtp) {
                openOtpModal(nextOtp)
                return
            }

            closeActiveOtpModal()
            await continueFlow(currentPendingSubmitState.submitParams)
        },
    })

    const openOtpModal = (otp: Otp) => {
        return openModal(OtpModal, getOtpModalProps(otp))
    }

    const withOtp = async (submitParams: TSubmitParams) => {
        setPendingSubmitParams(submitParams)
        const otp = await configRef.current.onRequestOtp(submitParams)

        if (otp) {
            openOtpModal(otp)
            return true
        }

        await continueFlow(submitParams)
        return false
    }
    return {
        isOtpModalOpen: isOpen,
        openOtpModal,
        closeOtpModal,
        pendingSubmitParams: pendingSubmitState?.submitParams ?? null,
        withOtp
    }
}

export default useOtp
