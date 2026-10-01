import React, {FC, useContext} from 'react';
import Form from "@/presentation/components/Form/context/Form";
import {FormPasswordInput} from "@/presentation/components/Form/controls/FormPasswordInput";
import {
    defaultPasswordFormValues,
    onPasswordFormError,
    PasswordFormSchema,
    PasswordFormValues
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/components/PasswordForm/PasswordFormConfig";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import OtpFormBlocked from "@/presentation/components/Layout/OtpForm/components/OtpFormBlocked";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ResetPasswordUseCase from "@/domain/interactors/Auth/ResetPasswordUseCase";
import {AuthFlow} from "@/domain/entity/Auth/auth";
import {useMutation} from "@tanstack/react-query";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import {EventName} from "@/presentation/analytics/types";

type PasswordFormProps = {
    onSubmitPassword: (values: PasswordFormValues) => Promise<void>;
}

const PasswordForm: FC<PasswordFormProps> = ({onSubmitPassword}) => {
    const resetPasswordUseCase = container.get<ResetPasswordUseCase>(UseCaseTypes.ResetPasswordUseCase);
    const { blockedUntil, onBlock, onUnblock, onContinueBlock, setAuth, identification } = useContext(AuthModalContext);
    const handleResetPassword = async () =>{
        const otp = await resetPasswordUseCase.getOtp(identification);
        setAuth({
            flow: AuthFlow.RESET_PASSWORD,
            otp
        })
    }
    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: handleResetPassword,
    })

    if(blockedUntil){
        return (
            <OtpFormBlocked
                blockedUntil={blockedUntil}
                onUnblock={onUnblock}
                onContinueBlockUser={onContinueBlock}
            />
        )
    }

    return (
        <Form
            initialValues={defaultPasswordFormValues}
            onSubmit={onSubmitPassword}
            formErrorId="formsAlert"
            className="h-full flex flex-col"
            schema={PasswordFormSchema}
            onError={(error)=> onPasswordFormError(error, onBlock, handleResetPassword)}
            autoFocusOn="password"
        >
            <MountTracker name={EventName.VIEWED_PASSWORD_FORM}/>
            <FormPasswordInput
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                name="password"
                testId="password"
                disabled={isPending}
                aria-label="Ingresa tu contraseña"
                helpText={
                    <div className="flex justify-end w-full">
                        <button
                            type="button"
                            disabled={isPending}
                            data-testid="resetPasswordButton"
                            onClick={() => resetPassword()}
                            className="text-information-500 text-[12px] leading-4 font-sans font-medium hover:text-information-700 transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
                            aria-label="¿Olvidaste tu contraseña? Recuperar contraseña."
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                }
            />
            <FormButton
                className="mt-auto md:mt-10"
                testId="submitPassword"
                disabled={isPending}
                aria-label={isPending ? "Ingresa la contraseña para continuar" : "Continuar"}
            >
                Continuar
            </FormButton>
        </Form>
    );
};

export default PasswordForm;