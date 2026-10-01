"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { ButtonProps } from "@heroui/react";
import useSession from "@/presentation/hooks/useSession";

const LoginButton = ({ isDisabled: isDisabledProp, ...props }: ButtonProps) => {
    const { isValidatingSession, onOpenAuthModal, isLogged } = useSession();
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        setIsDisabled(isValidatingSession);
    }, [isValidatingSession]);

    if (isLogged) {
        return null;
    }

    return (
        <Button
            isDisabled={isDisabledProp ?? isDisabled}
            onPress={onOpenAuthModal}
            aria-label="Ingresar, iniciar sesión en Pichincha Miles"
            data-testid="buttonIngresar"
            {...props}
        >
            Ingresar
        </Button>
    );
};

export default LoginButton;
