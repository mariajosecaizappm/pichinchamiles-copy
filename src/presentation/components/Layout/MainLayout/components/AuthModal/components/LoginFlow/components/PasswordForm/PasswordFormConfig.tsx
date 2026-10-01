import * as Yup from 'yup';
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";

export type PasswordFormValues = {
    password: string
}

export const defaultPasswordFormValues: PasswordFormValues = {
    password: '',
}

export const PasswordFormSchema = Yup.object({
    password: Yup.string().min(8, "").required("Requerido")
})

export const onPasswordFormError = (error: ApiError, onBlock: (blockedUntil: Date) => void, onResetPassword: () => void) => {
    if (error.is(ErrorCode.INVALID_ATTEMPT)) {
        return (
            <>
                <p aria-label='Error. La contraseña que ingresaste es incorrecta'>La contraseña que ingresaste es incorrecta.</p>
                <button type="button" onClick={onResetPassword} className="text-information-500 bg-transparent outline-0 p-0 cursor-pointer" aria-label="¿Olvidaste tu usuario y contraseña? Recuperar credenciales.">¿Olvidaste tu usuario y contraseña?</button>
            </>
        )
    }

    if (error.is(ErrorCode.USER_BLOCKED)) {
        if (!error.metadata) return;
        const blockedUntil = new Date(Date.now() + (error.metadata.minutes * 60 * 1000));
        onBlock(blockedUntil);
        return null;
    }
}