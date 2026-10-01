import { validDocument } from "@/presentation/helpers/validation";
import * as Yup from "yup";
import { ContactFormValues } from "./types";

export const ContactFormValidationSchema = Yup.object().shape({
    identificationNumber: Yup.string()
        .required("Número de identificación requerido")
        .test(
            "custom",
            "El número de identificación es incorrecto",
            function (value: string) {
                return validDocument(value, this.parent.identificationType);
            }
        ),
    identificationType: Yup.string().required("Tipo de identificación requerido"),
    fullname: Yup.string().required("Nombre completo requerido"),
    description: Yup.string().min(20, "Ingresa al menos 20 caracteres").required("Descripción requerida"),
    email: Yup.string()
        .required("Correo electrónico requerido")
        .email("Formato inválido")
        .matches(/^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Formato inválido")
        .max(50, "El correo electrónico no puede exceder 50 caracteres"),
    pqrsRequirementTypeId: Yup.string().required(
        "Campo requerido"
    ),
    pqrsRequirementSubTypeId: Yup.string().required(
        "Campo requerido"
    ),
});

export const contactFormInitialValues: ContactFormValues = {
    identificationNumber: "",
    identificationType: "",
    fullname: "",
    description: "",
    email: "",
    pqrsRequirementTypeId: "",
    pqrsRequirementSubTypeId: ""
}