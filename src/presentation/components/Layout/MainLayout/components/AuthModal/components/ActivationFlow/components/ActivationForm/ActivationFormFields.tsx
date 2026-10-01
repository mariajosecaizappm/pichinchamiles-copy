import React, {FC, useContext, useMemo} from 'react';
import FormContext from "@/presentation/components/Form/context/FormContext";
import {FormPasswordInput} from "@/presentation/components/Form/controls/FormPasswordInput";
import {FormCheckbox} from "@/presentation/components/Form/controls/FormCheckbox";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import Link from "next/link";
import links from "@/presentation/config/links";
import PasswordComparator from "../../../PasswordComparator";

type ActivationFormFieldsProps = {
    isPasswordValid: boolean;
    onPasswordValidation: (isInvalid: boolean) => void;
}

const ActivationFormFields: FC<ActivationFormFieldsProps> = ({isPasswordValid, onPasswordValidation}) => {
    const { values } = useContext(FormContext);
    
    const getButtonAriaLabel = useMemo(() => {
        const isFormValid = isPasswordValid && values.acceptTermsAndConditions;
        if (!isFormValid) {
            return "Botón continuar deshabilitado, define la contraseña o acepta los términos y condiciones para continuar.";
        }
        return "La contraseña cumple todos los requisitos. Puedes continuar.";
    }, [isPasswordValid, values.acceptTermsAndConditions]);

    return (
        <>
            <FormPasswordInput
                testId="password"
                name="password"
                label="Contraseña"
                maxLength={16}
                aria-label="Campo de texto seguro, ingresa tu contraseña"
            />
            <FormPasswordInput
                testId="confirmPassword"
                name="confirmPassword"
                label="Repita la contraseña"
                maxLength={16}
                aria-label="Repite la contraseña. Campo de texto seguro. Ingresa nuevamente tu contraseña"
            />
            <PasswordComparator
                name="password"
                onChange={onPasswordValidation}
            />
            <FormCheckbox
                testId="acceptTermsAndConditions"
                name="acceptTermsAndConditions"
                label={<>He leído y acepto los <Link href={links.termsAndConditions} target="_blank" className="underline text-information-500 font-bold" aria-label="Leer términos y condiciones del programa. Enlace">Términos y condiciones</Link> del programa</>}
                aria-label={"He leído y acepto los términos y condiciones del programa"}
            />
            <FormButton className="mt-auto" aria-label={getButtonAriaLabel}>Continuar</FormButton>
        </>
    );
};

export default ActivationFormFields;
