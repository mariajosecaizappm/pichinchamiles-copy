import * as Yup from 'yup';
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";

export type OtpFormValues = {
    code: string
}

export const defaultOtpFormValues: OtpFormValues = {
    code: ''
}

export const otpFormSchema = Yup.object({
    code: Yup.string().required('El código es requerido').min(6).max(6),
})

export const OTP_GENERIC_ERROR_MESSAGE = (
    <>
        Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
        <strong>1800-BPMILE (276-453)</strong>.
    </>
)

export const onOtpFormError = (error: ApiError, setInvalidAttempt: (invalidAttempt: boolean)=> void, onBlock: (blockedUntil: Date)=> void) =>{
    if (error.is(ErrorCode.INVALID_ATTEMPT)) {
        setInvalidAttempt(true);
        return null;
    }

    if (error.is(ErrorCode.USER_BLOCKED)) {
        if (!error.metadata) return OTP_GENERIC_ERROR_MESSAGE;
        const blockedUntil = new Date(Date.now() + (error.metadata.minutes * 60 * 1000));
        onBlock(blockedUntil);
        return null;
    }

    return OTP_GENERIC_ERROR_MESSAGE;
}
