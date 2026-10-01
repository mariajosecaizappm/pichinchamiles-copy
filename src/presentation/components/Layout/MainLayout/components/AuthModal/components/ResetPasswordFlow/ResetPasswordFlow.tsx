import React, {useContext, useState} from 'react';
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ResetPasswordUseCase from "@/domain/interactors/Auth/ResetPasswordUseCase";
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {AuthFlow} from "@/domain/entity/Auth/auth";
import OtpForm from "@/presentation/components/Layout/OtpForm";
import {MfaRequest} from "@/domain/entity/Otp/otp";
import ResetPasswordForm
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm";
import useSession from "@/presentation/hooks/useSession";
import ResetPasswordAlert
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordAlert";

const ResetPasswordFlow = () => {
    const {auth, setAuth, mfaRequest, identification, setMfaRequest, onBlock, onUnblock, onContinueBlock} = useContext(AuthModalContext);
    const { member } = useSession();
    const resetPasswordUseCase = container.get<ResetPasswordUseCase>(UseCaseTypes.ResetPasswordUseCase);
    const [resetPasswordToken, setResetPasswordToken] = useState<string>("");
    const handleResendOtp = async () =>{
        const otp = await resetPasswordUseCase.getOtp(identification);
        setAuth({
            flow: AuthFlow.RESET_PASSWORD,
            otp
        })
    }
    const handleSubmitOtp = async (mfaRequest: MfaRequest) =>{
        const resetPasswordToken = await resetPasswordUseCase.verifyOtp(identification, mfaRequest.mfaCode, mfaRequest.mfaToken);
        setMfaRequest(mfaRequest);
        setResetPasswordToken(resetPasswordToken);
    }

    if(auth?.flow !== AuthFlow.RESET_PASSWORD) return null;

    if (member) {
        return <ResetPasswordAlert/>
    }

    return mfaRequest
        ? (
            <ResetPasswordForm
                identificationNumber={identification}
                mfaRequest={mfaRequest}
                resetPasswordToken={resetPasswordToken}
            />
        )
        : (
            <OtpForm
                otp={auth.otp}
                onSubmitOtp={handleSubmitOtp}
                onResendOtp={handleResendOtp}
                onUnblockUser={onUnblock}
                onContinueBlockUser={onContinueBlock}
                onBlockUser={onBlock}
            />
        )
};

export default ResetPasswordFlow;
