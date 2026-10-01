import * as Yup from 'yup';

export type ActivationFormValues = {
    password: string
    confirmPassword: string
    acceptTermsAndConditions: boolean
}

export const defaultActivationFormValues: ActivationFormValues = {
    password: "",
    confirmPassword: "",
    acceptTermsAndConditions: false,
}

export const activationFormSchema = Yup.object({
    password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(16, 'La contraseña no puede tener más de 16 caracteres')
        .matches(/[a-z]/, 'Debe incluir al menos una letra minúscula')
        .matches(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
        .matches(/\d/, 'Debe incluir al menos un número')
        .matches(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial')
        .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
        .required('La confirmación de contraseña es requerida')
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
    acceptTermsAndConditions: Yup.boolean()
        .oneOf([true], 'Debe aceptar los términos y condiciones')
        .required('Debe aceptar los términos y condiciones')
})

