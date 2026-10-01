import { FC, useState, useCallback, useMemo, useRef } from "react";
import PasswordInput, { PasswordInputProps } from "./PasswordInput";
import { numberToWords } from "@/presentation/helpers/numberToWords";
import { useScreenReader } from "@/presentation/components/providers/ScreenReaderProvider";

const PasswordInputContainer: FC<PasswordInputProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const { announce } = useScreenReader();
    const previousLengthRef = useRef(0);

    const toggleVisibility = useCallback(() => setIsVisible((prev) => !prev), []);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const { onChange: originalOnChange } = props;
    
    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const currentLength = newValue.length;
        const previousLength = previousLengthRef.current;
        
        if (currentLength > previousLength) {
            // Se agregó un caracter
            announce("carácter oculto");
        }
        
        previousLengthRef.current = currentLength;
        
        if (originalOnChange) {
            originalOnChange(e);
        }
    }, [announce, originalOnChange]);

    const { value, maxLength, errorMessage, "aria-label": ariaLabelProp } = props;
    const stringValue = typeof value === 'string' ? value : '';
    const currentLength = stringValue.length;
    const showLengthIndicator = maxLength && currentLength > 0;

    const characterCountLabel = useMemo(() => {
        if (!maxLength) return '';
        return `${numberToWords(currentLength.toString())} de ${numberToWords(maxLength.toString())} caracteres ingresados.`;
    }, [currentLength, maxLength]);

    const ariaLabel = useMemo(() => {
        const baseLabel = ariaLabelProp ?? '';
        const valueInWords = currentLength > 0 ? stringValue : '';
        const visibleSuffix = isVisible ? ' Contraseña visible.' : '';
        
        if (isFocused) {
            return `${baseLabel}. Editando.${visibleSuffix}`;
        } else if (errorMessage && currentLength > 0) {
            return `${baseLabel}. Valor ingresado: ${valueInWords}. Error: ${errorMessage}.${visibleSuffix}`;
        } else if (currentLength > 0) {
            return `${baseLabel}. Contraseña ingresada.${visibleSuffix}`;
        }
        return `${baseLabel}.${visibleSuffix}`;
    }, [ariaLabelProp, isFocused, currentLength, errorMessage, stringValue, isVisible]);

    return (
        <PasswordInput
            {...props}
            onChange={handlePasswordChange}
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            characterCountLabel={characterCountLabel}
            aria-label={ariaLabel}
            showLengthIndicator={showLengthIndicator}
            currentLength={currentLength}
        />
    );
};

export default PasswordInputContainer;
