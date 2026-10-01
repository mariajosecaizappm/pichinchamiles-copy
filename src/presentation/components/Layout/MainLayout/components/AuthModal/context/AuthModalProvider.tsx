import React, {FC, PropsWithChildren, useMemo, useState, useCallback} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/presentation/config/store";
import { usePathname, useRouter } from 'next/navigation';
import links from '@/presentation/config/links';
import AuthModalContext, {
    AuthModalContextValues
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {Authentication, AuthFlow} from "@/domain/entity/Auth/auth";
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import type { Container } from "inversify";
import type { default as LoadAuthMemberUseCase } from "@/domain/interactors/Auth/LoadAuthMemberUseCase";
import useSession from "@/presentation/hooks/useSession";

const AuthModalProvider: FC<PropsWithChildren> = ({children}) => {
    const [auth, setAuth] = useState<Authentication | null>(null);
    const [identification, setIdentification] = useState<string>("");
    const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
    const [mfaRequest, setMfaRequest] = useState<MfaRequest | null>(null);
    const [otp, setOtp] = useState<Otp | null>(null);
    const { initSession, member } = useSession();

    const updateAuth = useCallback((auth: Authentication, identification?: string) =>{
        setAuth(auth);
        if(identification){
            setIdentification(identification)
        }
    }, []);

    const clearAuth = useCallback(() =>{
        setAuth(null);
        setIdentification("");
        setMfaRequest(null);
        setOtp(null);
        setBlockedUntil(null);
    }, []);

    const router = useRouter();
    const pathname = usePathname();

    const onLoginSuccess = useSelector((state: RootState) => state.authModal.onLoginSuccess);

    const handleLoadAuthMember = async () =>{
        const { default: container } = await import("@/presentation/config/inversify.config");
        const loadAuthMemberUseCase = (container as Container).get<LoadAuthMemberUseCase>(UseCaseTypes.LoadAuthMemberUseCase);
        const authMember = await loadAuthMemberUseCase.getAuthMember();
        initSession(authMember);
        window.scrollTo(0, 0);

        const callback = onLoginSuccess;
        if (callback) {
            callback();
        } else if (pathname === links.home) {
            router.push(links.products);
        }
    }

    const handleBlock = (blockedUntil: Date) => setBlockedUntil(blockedUntil);
    const handleUnblock = () => setBlockedUntil(null);
    const handleContinueBlock = () => {
        setBlockedUntil(null);
        clearAuth();
    }

    const currentStep = useMemo(() => {
        if (!auth?.flow) return 1;

        const flowSteps: Record<string, () => number> = {
            [AuthFlow.ACTIVATE_ACCOUNT]: () => {
                if (member) return 4;
                return mfaRequest ? 3 : 2;
            },
            [AuthFlow.LOGIN]: () => (otp ? 3 : 2),
            [AuthFlow.RESET_PASSWORD]: () => {
                if (member) return 4;
                return mfaRequest ? 3 : 2;
            },
        };

        const resolveStep = flowSteps[auth.flow];
        return resolveStep ? resolveStep() : 1;
    }, [auth, mfaRequest, member, otp]);

    const handleBackStep = useCallback(() => {
        if (!auth?.flow) return;

        if (auth.flow === AuthFlow.LOGIN) {
            if (otp) {
                setOtp(null);
            } else {
                clearAuth();
            }
        } else if (auth.flow === AuthFlow.ACTIVATE_ACCOUNT) {
            if (mfaRequest) {
                setMfaRequest(null);
            } else {
                clearAuth();
            }
        } else if (auth.flow === AuthFlow.RESET_PASSWORD) {
            if (mfaRequest) {
                setMfaRequest(null);
            } else {
                updateAuth({ flow: AuthFlow.LOGIN }, identification);
            }
        }
    }, [auth, otp, mfaRequest, clearAuth, updateAuth, identification]);

    const value: AuthModalContextValues = useMemo(()=>{
        return {
            auth,
            identification,
            blockedUntil,
            mfaRequest,
            otp,
            setAuth: updateAuth,
            clearAuth,
            setMfaRequest,
            onLoadAuthMember: handleLoadAuthMember,
            setOtp,
            onBlock: handleBlock,
            onUnblock: handleUnblock,
            onContinueBlock: handleContinueBlock,
            currentStep,
            backStep: handleBackStep
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, identification, blockedUntil, mfaRequest, handleLoadAuthMember, otp, currentStep, updateAuth, clearAuth, handleBackStep]);

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
};

export default AuthModalProvider;