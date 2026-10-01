import * as Yup from 'yup';

export type ResetPasswordFormValues = {
    password: string
    confirmPassword: string
}

export const defaultResetPasswordFormValues: ResetPasswordFormValues = {
    password: "",
    confirmPassword: "",
}

export const resetPasswordFormSchema = Yup.object({
    password: Yup.string()
        .max(16)
        .required(),
    confirmPassword: Yup.string()
        .required('La confirmación de contraseña es requerida')
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
})