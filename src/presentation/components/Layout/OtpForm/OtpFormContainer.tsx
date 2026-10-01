import { MfaRequest, Otp } from "@/domain/entity/Otp/otp";
import { ApiError } from "@/domain/entity/Error/models/ApiError";
import { ErrorCode } from "@/domain/entity/Error/structure/error";
import { FormRef } from "@/presentation/components/Form/context/Form";
import { OTP_GENERIC_ERROR_MESSAGE, OtpFormValues } from "@/presentation/components/Layout/OtpForm/OtpFormConfig";
import { useScreenReader } from "@/presentation/components/providers/ScreenReaderProvider";
import { maskedEmail } from "@/presentation/helpers/member";
import { numberToWords } from "@/presentation/helpers/numberToWords";
import { useMutation } from "@tanstack/react-query";
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

export type OtpFormProps = {
    title?: string
    otp: Otp
    onSubmitOtp: (mfaRequest: MfaRequest) => Promise<void>
    onResendOtp: () => Promise<void>
    onBlockUser?: (blockedUntil: Date) => void
    onUnblockUser?: () => void
    onContinueBlockUser?: () => void
}

export type OtpFormContainerProps = OtpFormProps & {
    children: (props: OtpFormContainerRenderProps) => React.ReactNode
}

export type OtpFormContainerRenderProps = {
    otpExpiredDate: Date
    isExpired: boolean
    blockedUntil: Date | null
    invalidAttempt: boolean
    formRef: React.RefObject<FormRef | null>
    phone: string
    phoneDigits: string
    phoneDigitsWords: string
    email: string
    emailDomain: string
    handleSubmit: (values: OtpFormValues) => Promise<void>
    resendOtp: () => void
    isSendingOtp: boolean
    isResendingOtp: boolean
    handleExpireOtp: () => void
    handleBlock: (blockedUntil: Date) => void
    handleUnblock: () => void
    setInvalidAttempt: (value: boolean) => void
}

const OtpFormContainer: FC<OtpFormContainerProps> = ({ title, otp, onSubmitOtp, onResendOtp, onBlockUser, onUnblockUser, children}) => {
    const { info } = useScreenReader()
    const otpExpiredDate = useMemo(() => {
        return otp.expirationDate ?? new Date(Date.now() + (otp.durationOtpCodeMinutes * 60 * 1000))
    }, [otp]);
    const [isExpired, setIsExpired] = useState(() => Date.now() >= otpExpiredDate.getTime());
    const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
    const [invalidAttempt, setInvalidAttempt] = useState(false);
    const formRef = useRef<FormRef>(null)

    const phone = otp.cellPhone ? `*******${otp.cellPhone}` : "";
    const phoneDigits = otp.cellPhone ?? "";
    const phoneDigitsWords = phoneDigits ? numberToWords(phoneDigits) : "";

    const email = maskedEmail(otp.email);
    const emailDomain = otp.email?.includes("@") ? otp.email.split("@")[1] : "";

    useEffect(() => {
        const expired = Date.now() >= otpExpiredDate.getTime();
        setIsExpired(expired);
        if (expired) {
            formRef.current?.addAlert({content: "El tiempo de duración del código ha expirado. Reenvía el código e intenta nuevamente.", dismiss: false});
        }
    }, [otpExpiredDate]);

    useEffect(() => {
        if (emailDomain) {
            info(`Dominio del correo electrónico: ${emailDomain}`)
        }
    }, [emailDomain, info])

    useEffect(() => {
        if (phoneDigits) {
            info(`Celular terminado en ${phoneDigitsWords}`)
        }
    }, [phoneDigits, phoneDigitsWords, info])

    const handleSubmit = async (values: OtpFormValues) => {
        try {
            await onSubmitOtp({mfaToken: otp.mfaToken, mfaCode: values.code});
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(ErrorCode.UNKNOWN);
        }
    }


    const {mutateAsync: submitMutation, isPending: isSubmittingOtp } = useMutation({
        mutationFn: handleSubmit,
    })

    const handleResendOtp = async () => {
        formRef.current?.clearAlert();
        formRef.current?.reset();
        await onResendOtp();
        setIsExpired(false);
    }
    const { mutate: resendOtp, isPending: isResendingOtp } = useMutation({
        mutationFn: handleResendOtp,
        onError: ()=>{
            formRef.current?.addAlert(OTP_GENERIC_ERROR_MESSAGE)
        }
    })

    const handleExpireOtp = () =>{
        setIsExpired(true);
        formRef.current?.addAlert({content: "El tiempo de duración del código ha expirado. Reenvía el código e intenta nuevamente.", dismiss: false});
    }
    const handleBlock = (blockedUntil: Date) => {
        setBlockedUntil(blockedUntil);
        if(onBlockUser) onBlockUser(blockedUntil);
    }

    const handleUnblock = () =>{
        setBlockedUntil(null);
        if(onUnblockUser) onUnblockUser();
    }

    return children({
        otpExpiredDate,
        isExpired,
        blockedUntil,
        invalidAttempt,
        formRef,
        phone,
        phoneDigits,
        phoneDigitsWords,
        email,
        emailDomain,
        handleSubmit: submitMutation,
        resendOtp,
        isSendingOtp: isSubmittingOtp,
        isResendingOtp,
        handleExpireOtp,
        handleBlock,
        handleUnblock,
        setInvalidAttempt
    });
};

export default OtpFormContainer;
