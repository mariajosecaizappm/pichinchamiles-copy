import React, {useContext} from 'react';
import useDetectKeyboardOpen from "@/presentation/hooks/useDetectKeyboardOpen";
import Form from "@/presentation/components/Form/context/Form";
import FormInput from "@/presentation/components/Form/controls/FormInput";
import {
    defaultIdentificationFormValues,
    identificationFormSchema,
    IdentificationFormValues,
    onIdentificationFormError
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm/IdentificationFormConfig";
import {textAndNumbers} from "@/presentation/helpers/regexp";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import container from "@/presentation/config/inversify.config";
import OnboardingUseCase from "@/domain/interactors/Auth/OnboardingUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {AuthFlow} from "@/domain/entity/Auth/auth";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import {EventName} from "@/presentation/analytics/types";
import useAnalytics from "@/presentation/hooks/useAnalytics";

const IdentificationForm = () => {
    const { setAuth, auth, blockedUntil, otp, identification } = useContext(AuthModalContext);
    const { track } = useAnalytics();
    const isKeyboardOpen = useDetectKeyboardOpen();
    const onboardingUseCase = container.get<OnboardingUseCase>(UseCaseTypes.OnboardingUseCase);
    const handleSubmitIdentification = async (values: IdentificationFormValues) => {
        track(EventName.VERIFY_IDENTIFICATION);
        const authentication = await onboardingUseCase.verifyIdentification(values.identificationNumber);
        setAuth(authentication, values.identificationNumber);
    }

    if(auth?.flow === AuthFlow.ACTIVATE_ACCOUNT || auth?.flow === AuthFlow.RESET_PASSWORD || blockedUntil || otp) return null;

    return (
        <Form
            initialValues={{ ...defaultIdentificationFormValues, identificationNumber: identification || defaultIdentificationFormValues.identificationNumber }}
            onSubmit={handleSubmitIdentification}
            schema={identificationFormSchema}
            onError={onIdentificationFormError}
            formErrorId="formsAlert"
            className={`flex flex-col ${auth?.flow === AuthFlow.LOGIN ? "h-fit" : "h-full"}`}
            autoFocusOn="identificationNumber"
        >
            <MountTracker name={EventName.VIEWED_IDENTIFICATION_FORM}/>
            <p className="typo-main-caption-book mb-4">
                {auth?.flow === AuthFlow.LOGIN ? "Ingresa tu contraseña para continuar:" : "Ingresa tu documento de identificación para continuar:"}
            </p>
            <FormInput
                label="Documento de identificación"
                name="identificationNumber"
                testId="identificationNumber"
                maxLength={16}
                placeholder="Ej. 1723402878"
                regExp={textAndNumbers}
                disabled={auth?.flow === AuthFlow.LOGIN}
                aria-label={
                    auth?.flow === AuthFlow.LOGIN 
                        ? "Documento de identificación"
                        : "Campo de texto. Ingresa tu número de identificación"
                }
            />
            {auth?.flow !== AuthFlow.LOGIN && !isKeyboardOpen && (
                <FormButton 
                    className="mt-auto md:mt-10" 
                    testId="validateIdentification"
                    aria-label="Validar documento de identificación"
                >
                    Validar
                </FormButton>
            )}
        </Form>
    );
};

export default IdentificationForm;