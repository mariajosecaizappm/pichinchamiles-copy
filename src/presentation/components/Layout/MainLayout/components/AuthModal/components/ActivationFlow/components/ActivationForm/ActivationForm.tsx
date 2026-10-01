import React, {FC, useRef, useCallback, useState, useContext} from 'react';
import {MfaRequest} from "@/domain/entity/Otp/otp";
import Form, { FormRef } from "@/presentation/components/Form/context/Form";
import {
    activationFormSchema, ActivationFormValues,
    defaultActivationFormValues
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationForm/ActivationFormConfig";
import ActivationFormFields from "./ActivationFormFields";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ActivationUseCase from "@/domain/interactors/Auth/ActivationUseCase";
import container from "@/presentation/config/inversify.config";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import {EventName} from "@/presentation/analytics/types";
import useAnalytics from "@/presentation/hooks/useAnalytics";

type ActivationFormProps = {
    mfaRequest: MfaRequest
    activationToken: string
}

const ActivationForm: FC<ActivationFormProps> = ({mfaRequest, activationToken}) => {
    const { identification, onLoadAuthMember } = useContext(AuthModalContext);
    const formRef = useRef<FormRef>(null);
    const activationUseCase = container.get<ActivationUseCase>(UseCaseTypes.ActivationUseCase);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const { track } = useAnalytics();
    
    const handleActivate = async (values: ActivationFormValues) =>{
        track(EventName.VERIFY_ACTIVATION_PASSWORD)
        try {
            await activationUseCase.activateAccount({
                password: values.password,
                mfaCode: mfaRequest.mfaCode,
                mfaToken: mfaRequest.mfaToken,
                acceptedTermsAndCondition: values.acceptTermsAndConditions,
                acceptedLopd: false,
                activeAccountToken: activationToken,
                identificationNumber: identification,
            })
            track(EventName.ACTIVE_ACCOUNT, {status: 'success'})
            await onLoadAuthMember();
        }catch(e){
            track(EventName.ACTIVE_ACCOUNT, {status: 'error'})
            throw e;
        }
    }

    const handlePasswordValidation = useCallback((isInvalid: boolean) => {
        setIsPasswordValid(!isInvalid);
        if (formRef.current?.disableForm) {
            formRef.current.disableForm(isInvalid);
        }
    }, []);

    
    return (
        <div className="flex-1 flex flex-col" aria-describedby='activation-form-description'>
            <p id='activation-form-description'>Define la contraseña para tu cuenta:</p>
            <MountTracker name={EventName.VIEWED_ACTIVATION_PASSWORD}/>
            <Form
                ref={formRef}
                initialValues={defaultActivationFormValues}
                onSubmit={handleActivate}
                schema={activationFormSchema}
                className="flex-1 flex flex-col gap-4 mt-4"
                formErrorId="formsAlert"
                autoFocusOn="password"
            >
                <ActivationFormFields
                    isPasswordValid={isPasswordValid}
                    onPasswordValidation={handlePasswordValidation}
                />
            </Form>
        </div>
    );
};

export default ActivationForm;