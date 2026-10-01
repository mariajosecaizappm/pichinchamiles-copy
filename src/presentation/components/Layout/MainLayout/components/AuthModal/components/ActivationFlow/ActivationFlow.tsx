import React, {useContext, useState} from 'react';
import {AuthFlow} from "@/domain/entity/Auth/auth";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import OtpForm from "@/presentation/components/Layout/OtpForm";
import container from "@/presentation/config/inversify.config";
import OnboardingUseCase from "@/domain/interactors/Auth/OnboardingUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import ActivationUseCase from "@/domain/interactors/Auth/ActivationUseCase";
import ActivationForm
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationForm";
import useSession from "@/presentation/hooks/useSession";
import ActivationSummary
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import {EventName} from "@/presentation/analytics/types";
import useAnalytics from "@/presentation/hooks/useAnalytics";

const ActivationFlow = () => {
    const onboardingUseCase = container.get<OnboardingUseCase>(UseCaseTypes.OnboardingUseCase);
    const activationUseCase = container.get<ActivationUseCase>(UseCaseTypes.ActivationUseCase);
    const { auth, identification, setAuth, onBlock, onUnblock, onContinueBlock, mfaRequest, setMfaRequest } = useContext(AuthModalContext);
    const { member } = useSession();
    const { track } = useAnalytics();
    const [activationToken, setActivationToken] = useState<string>("");
    const handleResendOtp = async () => {
        const auth = await onboardingUseCase.verifyIdentification(identification);
        setAuth(auth);
    }

    const handleSubmitOtp = async (mfaRequest: MfaRequest) =>{
        track(EventName.VERIFY_ACTIVATION_OTP);
        const activationToken = await activationUseCase.verifyOtp(identification, mfaRequest.mfaToken, mfaRequest.mfaCode);
        setActivationToken(activationToken);
        setMfaRequest(mfaRequest);
    }

    if(auth?.flow !== AuthFlow.ACTIVATE_ACCOUNT) return null;

    if(member){
        return <ActivationSummary member={member}/>
    }

    if(mfaRequest && activationToken){
        return (
            <ActivationForm mfaRequest={mfaRequest} activationToken={activationToken}/>
        )
    }

    return (
        <>
            <MountTracker name={EventName.VIEWED_ACTIVATION_OTP}/>
            <OtpForm
                otp={auth.otp}
                onResendOtp={handleResendOtp}
                onSubmitOtp={handleSubmitOtp}
                onBlockUser={onBlock}
                onUnblockUser={onUnblock}
                onContinueBlockUser={onContinueBlock}
            />
        </>
    );
};

export default ActivationFlow;