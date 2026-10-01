import React, {useContext, useState} from 'react';
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {AuthFlow} from "@/domain/entity/Auth/auth";
import PasswordForm
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow/components/PasswordForm";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import LoginUseCase from "@/domain/interactors/Auth/LoginUseCase";
import container from "@/presentation/config/inversify.config";
import OtpForm from "@/presentation/components/Layout/OtpForm";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import useSession from "@/presentation/hooks/useSession";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import {MountTracker} from "@/presentation/analytics/MountTracker";

const LoginFlow = () => {
    const { auth, identification, otp, setOtp, onLoadAuthMember, onContinueBlock, onBlock, onUnblock } = useContext(AuthModalContext);
    const { onCloseAuthModal } = useSession();
    const { track } = useAnalytics();
    const [password, setPassword] = useState("");
    const loginUseCase = container.get<LoginUseCase>(UseCaseTypes.LoginUseCase)
    const handleSubmitPasswordForm = async (passwordValue?: string) =>{
        track(EventName.VERIFY_PASSWORD);
        const otp = await loginUseCase.getOtp(identification, passwordValue ?? password);
        setOtp(otp);
        if(passwordValue) setPassword(passwordValue);
    }

    const handleLogin = async (mfaRequest: MfaRequest) =>{
        track(EventName.VERIFY_LOGIN_OTP)
        try {
            await loginUseCase.verifyLoginOtp(identification, mfaRequest.mfaCode, mfaRequest.mfaToken);
        }catch (error){
            track(EventName.LOGIN, {status: "error"})
            throw error
        }

        try {
            await onLoadAuthMember();
            track(EventName.LOGIN, {status: "success"})
        }catch{
            track(EventName.LOGIN, {status: "error"})
        }
        onCloseAuthModal()
    }

    if(auth?.flow !== AuthFlow.LOGIN) return null;

    return otp ? (
        <>
            <OtpForm
                otp={otp}
                onResendOtp={handleSubmitPasswordForm}
                onSubmitOtp={handleLogin}
                onContinueBlockUser={onContinueBlock}
                onBlockUser={onBlock}
                onUnblockUser={onUnblock}
            />
            <MountTracker name={EventName.VIEWED_LOGIN_OTP}/>
        </>
    ) : <PasswordForm onSubmitPassword={(values)=> handleSubmitPasswordForm(values.password)}/>
};

export default LoginFlow;