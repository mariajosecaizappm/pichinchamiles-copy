import { FC, useState, useEffect, useRef, ReactNode } from 'react';
import { InputOtpProps } from "@heroui/react";
import OtpInput from './OtpInput';
import { numberToWords, digitWords } from '@/presentation/helpers/numberToWords';
import { useScreenReader } from '@/presentation/components/providers/ScreenReaderProvider';

type OtpInputContainerProps = InputOtpProps & {
    leftHelperText?: ReactNode;
    testId?: string;
    errorId?: string;
    isLoading?: boolean;
};

const OtpInputContainer: FC<OtpInputContainerProps> = (props) => {
    const { leftHelperText, className, testId, errorId, isLoading, ...rest } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [internalValue, setInternalValue] = useState("");
    const currentValue = rest.value ?? internalValue;
    const hasValue = String(currentValue).length > 0;
    const isComplete = String(currentValue).length === 6;
    const otpRef = useRef<HTMLDivElement>(null);
    const { info, success } = useScreenReader();

    const spokenValue = hasValue ? `Ingresaste el código [${numberToWords(String(currentValue))}]` : '';
    const completionAnnouncement = isComplete ? 'Código de seguridad de seis dígitos. Completado.' : '';

    const handleChange = (val: string) => {
        setInternalValue(val);
        if (rest.onValueChange) {
            rest.onValueChange(val);
        }
    };

    useEffect(() => {
        if (otpRef.current) {
            const inputs = otpRef.current.querySelectorAll('input');
            inputs.forEach((input, index) => {
                if (input instanceof HTMLInputElement) {
                    const digitValue = String(currentValue)[index] || '';
                    const hasDigit = digitValue !== '';
                    const isActive = document.activeElement === input;
                    const status = hasDigit ? 'Ingresado' : 'Campo de texto vacío';
                    const editing = isActive ? 'Editando. Ingresa un número' : '';
                    const visibility = isVisible ? 'Visible' : 'Oculto';
                    input.setAttribute('aria-label', `Dígito ${digitWords[index + 1]} de seis. Campo de texto. ${status}. ${editing} ${visibility}`);
                }
            });
        }
    }, [currentValue, isVisible]);

    useEffect(() => {
        if (spokenValue) {
            info(spokenValue);
        }
    }, [spokenValue, info]);

    useEffect(() => {
        if (completionAnnouncement) {
            success(completionAnnouncement);
        }
    }, [completionAnnouncement, success]);

    useEffect(() => {
        if (isLoading) {
            info('Validando código de seguridad.');
        }
    }, [isLoading, info]);

    return (
        <OtpInput
            leftHelperText={leftHelperText}
            className={className}
            testId={testId}
            errorId={errorId}
            {...rest}
            otpRef={otpRef}
            currentValue={currentValue}
            isVisible={isVisible}
            hasValue={hasValue}
            onToggleVisibility={() => setIsVisible(!isVisible)}
            onValueChange={handleChange}
        />
    );
};

export default OtpInputContainer;
