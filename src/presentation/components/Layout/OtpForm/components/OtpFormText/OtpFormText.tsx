import React, {FC} from 'react';
import Countdown from "@/presentation/components/Layout/OtpForm/components/Countdown";
import {Spinner} from "@heroui/spinner";

type OtpFormTextProps = {
    isExpired: boolean
    isSendingOtp: boolean
    isResendingOtp: boolean
    isInvalidAttempt: boolean
    otpExpiredDate: Date
    onExpireOtp: () => void
    onResendOtp: () => void
    errorId?: string
}

const OtpFormText: FC<OtpFormTextProps> = ({isExpired, isSendingOtp, isResendingOtp, isInvalidAttempt, otpExpiredDate, onExpireOtp, onResendOtp, errorId}) => {

    if(isSendingOtp || isResendingOtp){
        return (
            <Spinner
                variant="simple"
                classNames={{
                    base: "flex-row gap-1",
                    wrapper: "w-4 h-4 text-blue-500",
                    label: "text-grayscale-500 font-medium font-sans text-[12px] leading-none"
                }}
                label={isSendingOtp ? "Cargando" : "Reenviando código"}
                aria-label={isSendingOtp ? "Enviando código de seguridad" : "Reenviando código de seguridad"}
            />
        )
    }

    if(isExpired){
        return (
            <button
                type="button"
                className="font-semibold text-information-500 bg-transparent border-none cursor-pointer"
                onClick={onResendOtp}
                data-testid="resendOtp"
                aria-label="Reenviar código de seguridad"
            >
                Reenviar codigo
            </button>
        )
    }

    return (
        <p className="font-medium text-grayscale-400">
            {isInvalidAttempt && (
                <span
                    id={errorId}
                    className="text-error-500"
                    role="alert"
                    aria-live="assertive"
                >
                    El código ingresado es incorrecto
                </span>
            )}
            <span className={`${isInvalidAttempt ? "hidden" : ""}`}>
                El código expira en [<Countdown
                    onComplete={onExpireOtp}
                    key={otpExpiredDate.toISOString()}
                    date={otpExpiredDate}
                />]
            </span>
        </p>

    );
};

export default OtpFormText;