import React, {FC, useCallback, useContext, useRef, useState, useMemo} from 'react';
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ResetPasswordUseCase from "@/domain/interactors/Auth/ResetPasswordUseCase";
import {
    defaultResetPasswordFormValues,
    resetPasswordFormSchema,
    ResetPasswordFormValues
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm/ResetPasswordFormConfig";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import Form, {FormRef} from "@/presentation/components/Form/context/Form";
import {FormPasswordInput} from "@/presentation/components/Form/controls/FormPasswordInput";
import PasswordComparator from "../../../PasswordComparator";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";

type ResetPasswordFormProps = {
    identificationNumber: string
    mfaRequest: MfaRequest
    resetPasswordToken: string
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({identificationNumber, mfaRequest, resetPasswordToken}) => {
    const { onLoadAuthMember } = useContext(AuthModalContext);
    const formRef = useRef<FormRef>(null);
    const resetPasswordUseCase = container.get<ResetPasswordUseCase>(UseCaseTypes.ResetPasswordUseCase);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const handleResetPassword = async (values: ResetPasswordFormValues) =>{
        await resetPasswordUseCase.resetPassword(identificationNumber, mfaRequest, resetPasswordToken, values.password);
        await onLoadAuthMember();
    }

    const handlePasswordValidation = useCallback((isInvalid: boolean) => {
        setIsPasswordValid(!isInvalid);
        if (formRef.current?.disableForm) {
            formRef.current.disableForm(isInvalid);
        }
    }, []);

    const getButtonAriaLabel = useMemo(() => {
        if (!isPasswordValid) {
            return "Botón continuar deshabilitado, define la contraseña para continuar.";
        }
        return "La contraseña cumple todos los requisitos. Puedes continuar.";
    }, [isPasswordValid]);

    return (
        <div className="flex-1 flex flex-col" aria-describedby='reset-password-form-description'>
            <p id='reset-password-form-description'>Define una nueva contraseña para tu cuenta:</p>
            <Form
                ref={formRef}
                initialValues={defaultResetPasswordFormValues}
                onSubmit={handleResetPassword}
                schema={resetPasswordFormSchema}
                className="flex-1 flex flex-col gap-4 mt-4"
                formErrorId="formsAlert"
                autoFocusOn="password"
            >
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
                    onChange={handlePasswordValidation}
                />
                <FormButton testId="resetPasswordButton" className="mt-auto" aria-label={getButtonAriaLabel}>Continuar</FormButton>
            </Form>
        </div>
    );
};

export default ResetPasswordForm;