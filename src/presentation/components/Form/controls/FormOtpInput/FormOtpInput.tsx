import React, {FC, useContext, ReactNode} from 'react';
import OtpInputContainer from "@/presentation/components/Form/components/OtpInput/OtpInputContainer";
import { InputOtpProps } from "@heroui/react";
import FormContext from "@/presentation/components/Form/context/FormContext";

type FormOtpInputProps = {
    name: string
    testId?: string
    leftHelperText?: ReactNode
} & Omit<InputOtpProps, "onValueChange" | "value"> & {
    onValueChange?: (value: string) => void
}

const FormOtpInput: FC<FormOtpInputProps> = ({name, testId, leftHelperText, onValueChange: externalOnValueChange, ...rest}) => {
    const { values, errors, submitCount, isSubmitting, onInputChange } = useContext(FormContext)
    const value = values[name];
    const error = errors[name] as string | undefined
    const hasValue = value !== "" && value !== undefined && value !== null
    const showError = !!((hasValue || submitCount > 0) && error)
    const errorId = `${name}-error`

    const handleValueChange = (val: string) => {
        const eventLike = {
            target: {name, value: val},
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onInputChange(eventLike)
        externalOnValueChange?.(val)
    }

    return (
        <OtpInputContainer
            {...rest}
            testId={testId}
            name={name}
            leftHelperText={leftHelperText}
            onValueChange={handleValueChange}
            value={value}
            disabled={isSubmitting}
            isInvalid={showError}
            errorId={errorId}
            isLoading={isSubmitting}
        />
    );
};

export default FormOtpInput;
