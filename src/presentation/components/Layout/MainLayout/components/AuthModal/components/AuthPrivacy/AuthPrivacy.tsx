import React, {useContext} from 'react';
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import useSession from "@/presentation/hooks/useSession";
import {AuthFlow} from "@/domain/entity/Auth/auth";

const AuthPrivacy = () => {
    const { member } = useSession();
    const { blockedUntil, auth } = useContext(AuthModalContext);

    if(blockedUntil || (auth?.flow === AuthFlow.RESET_PASSWORD && member)) return null;

    return (
        <div className="p-6 bg-darkGrayishBlue-100 -mx-6 -mb-6">
            <p className="typo-main-legal-medium text-blue-500">
                <span aria-label='Este sitio está protegido por reCaptcha'>Este sitio está protegido por reCaptcha y aplica{" "}</span>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://policies.google.com/privacy?hl=es-419"
                    className="text-information-500"
                    aria-label="Enlace a política de privacidad de Google"
                >
                    Política de privacidad
                </a>{" "}
                y{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://policies.google.com/terms?hl=es"
                    className="text-information-500"
                    aria-label="Enlace a términos de servicio de Google"
                >
                    Términos de servicio de Google
                </a>.
            </p>
        </div>
    );
};

export default AuthPrivacy;
