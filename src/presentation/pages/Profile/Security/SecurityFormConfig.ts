import * as Yup from "yup";
import { EmailFormValues, PasswordFormValues, SecurityFormValues } from "./types";
import { maskedData } from "@/presentation/helpers/member";
import { Member } from "@/domain/entity/Member/member";

export const emailFormValidationSchema = Yup.object().shape({
    email: Yup.string(),
    newEmail: Yup.string()
        .required("El nuevo correo electrónico es requerido")
        .email("Por favor ingrese un correo electrónico válido")
        .max(50, "El correo electrónico no puede exceder los 50 caracteres")
        .test(
            'custom',
            'El nuevo correo electrónico debe ser diferente al anterior',
            function (value) {
                return this.parent.email != value
            }
        )
    ,
    emailConfirmation: Yup.string()
        .required("El correo electrónico de confirmación es requerido")
        .email("Por favor ingrese un correo electrónico válido")
        .test('custom', 'Los correos electrónicos no coinciden', function (value) {
            return this.parent.newEmail == value
        }),
});


export const passwordFormValidationSchema = Yup.object().shape({
    password: Yup.string(),
    newPassword: Yup.string()
        .required("La nueva contraseña es requerida")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(16, "La contraseña no puede tener más de 16 caracteres")
        .matches(/[a-z]/, "Debe incluir al menos una letra minúscula")
        .matches(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
        .matches(/\d/, "Debe incluir al menos un número")
        .matches(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial"),
    newPasswordConfirm: Yup.string()
        .required("La confirmación de contraseña es requerida")
        .test("passwords-match", "Las contraseñas no coinciden", function (value) {
            return this.parent.newPassword === value;
        }),
});

export const securityValidationSchema = Yup.object().shape({})

export enum SecurityFormSchemaType {
    EMAIL = 'email',
    PASSWORD = 'password'
}

export const emailFormInitialValues: EmailFormValues = {
    email: "",
    newEmail: undefined,
    emailConfirmation: undefined,
};


export const passwordFormInitialValues: PasswordFormValues = {
    password: maskedData("valuepass", 0, 1, true) || "",
    newPassword: "",
    newPasswordConfirm: "",
};


export const getSecurityFormValidationSchema = (type: SecurityFormSchemaType) => {
    if (type === SecurityFormSchemaType.EMAIL) {
        return emailFormValidationSchema
    } else if (type === SecurityFormSchemaType.PASSWORD) {
        return passwordFormValidationSchema
    } else {
        return securityValidationSchema
    }
}

export const getInitialFormValues = (member: Member) => {
    return {
        ...emailFormInitialValues,
        email: member.enrollmentEmail || "",
        ...passwordFormInitialValues,
    }
}

export const getOtpValidationData = (values: Partial<SecurityFormValues>, show: { emailForm: boolean, passwordForm: boolean }) => ({
    password: show.passwordForm ? (values as PasswordFormValues).newPasswordConfirm : undefined,
    enrollmentEmail: show.emailForm ? (values as EmailFormValues).emailConfirmation : undefined,
})