import React, {useContext} from 'react';
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import useSession from "@/presentation/hooks/useSession";
import {AuthFlow} from "@/domain/entity/Auth/auth";

const AuthModalTitle = () => {
    const { member } = useSession();
    const { blockedUntil, auth } = useContext(AuthModalContext);

    if(blockedUntil || (auth?.flow === AuthFlow.RESET_PASSWORD && member)) return null;

    return (
        <h3 data-testid="textOtpWelcome" className="typo-main-headline-3-prelo-semi-bold text-blue-500 text-center mx-auto max-w-62.5 sm:max-w-full">
            ¡Te damos la bienvenida a Pichincha Miles!
        </h3>
    );
};

export default AuthModalTitle;