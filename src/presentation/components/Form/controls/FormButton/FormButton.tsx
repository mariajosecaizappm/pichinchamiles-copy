import React, { useContext, useMemo, useEffect } from "react"
import {
    Button,
    ButtonProps,
} from "@/presentation/components/Form/components/Button"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { useScreenReader } from "@/presentation/components/providers/ScreenReaderProvider"

type FormButtonProps = ButtonProps & {
    /** When true, the button stays enabled so validation errors can appear on submit. */
    alwaysEnabled?: boolean
}

const FormButton: React.FC<FormButtonProps> = ({
    children,
    disabled,
    isLoading,
    alwaysEnabled = false,
    testId,
    'aria-label': ariaLabel,
    ...rest
}) => {
    const { isSubmitting, hasErrors } = useContext(FormContext);
    const { info } = useScreenReader()
    const isButtonLoading = isSubmitting ?? isLoading;
    const isButtonDisabled = alwaysEnabled
        ? Boolean(disabled ?? isLoading)
        : (hasErrors ?? disabled ?? isLoading);

    useEffect(() => {
        if (isButtonLoading) {
            info("Procesando solicitud")
        }
    }, [isButtonLoading, info])

    const buttonAriaLabel = useMemo(() => {
        if (isButtonDisabled && ariaLabel) {
            return `${ariaLabel}, Botón deshabilitado`;
        }
        return ariaLabel;
    }, [isButtonDisabled, ariaLabel]);

    return (
        <Button
            {...rest}
            testId={testId}
            isLoading={isButtonLoading}
            type="submit"
            color="primary"
            isDisabled={isButtonDisabled}
            aria-busy={isButtonLoading}
            aria-label={buttonAriaLabel}
        >
            {children}
        </Button>
    )
}

export default FormButton
