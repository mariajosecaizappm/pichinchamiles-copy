import React, {useContext} from 'react';
import AuthModalContext
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import {AuthFlow} from "@/domain/entity/Auth/auth";
import useSession from "@/presentation/hooks/useSession";

const AuthStepper = () => {
    const { auth, blockedUntil, currentStep } = useContext(AuthModalContext);
    const { member } = useSession();
    const STEPS = auth?.flow === AuthFlow.RESET_PASSWORD || auth?.flow === AuthFlow.LOGIN ? ['step-1', 'step-2', 'step-3'] : ['step-1', 'step-2', 'step-3', 'step-4'];

    if(blockedUntil || (auth?.flow === AuthFlow.RESET_PASSWORD && member)) return null;

    return (
        <div className="flex items-center justify-center gap-2 w-full p-2">
            {STEPS.map((stepId, index) => {
                const isActive = index + 1 === currentStep;
                const stepNumber = index + 1;
                const totalSteps = STEPS.length;
                return (
                    <div
                        key={stepId}
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                            isActive ? 'bg-blue-500' : 'bg-blue-100'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                        aria-label={`Paso ${stepNumber} de ${totalSteps}`}
                    />
                );
            })}
        </div>
    );
};

export default AuthStepper;
