import React, {FC, ReactNode} from 'react';
import {InputOtp, InputOtpProps} from "@heroui/react";

export type OtpInputProps = InputOtpProps & {
    leftHelperText?: ReactNode;
    testId?: string;
    errorId?: string;
    otpRef: React.RefObject<HTMLDivElement | null>;
    currentValue: string;
    isVisible: boolean;
    hasValue: boolean;
    onToggleVisibility: () => void;
    onValueChange: (val: string) => void;
};

const OtpInput: FC<OtpInputProps> = ({leftHelperText, testId, errorId, otpRef, currentValue, isVisible, hasValue, onToggleVisibility, onValueChange, ...rest}) => {
    return (
        <div ref={otpRef} className={`flex flex-col w-full`}>
            <InputOtp
                {...rest}
                data-testid={testId}
                value={currentValue}
                onValueChange={onValueChange}
                type={isVisible ? "text" : "password"}
                errorMessage={undefined}
                disableAnimation={true}
                variant={rest.variant ?? "bordered"}
                aria-label="Campo de verificación del código de seguridad de seis dígitos"
                aria-describedby={rest.isInvalid && errorId ? errorId : undefined}
                classNames={{
                    ...rest.classNames,
                    base: [
                        "flex",
                        "justify-center",
                        "w-full",
                        rest.classNames?.base,
                    ].filter(Boolean).join(" "),
                    segmentWrapper: [
                        "gap-2",
                        rest.classNames?.segmentWrapper,
                    ].filter(Boolean).join(" "),
                    segment: [
                        "border",
                        "w-[45px]",
                        "h-[48px]",
                        "rounded-[4px]",
                        "!bg-white",
                        rest.isInvalid ? "!border-error-500" : "!border-grayscale-200",
                        rest.isInvalid ? "" : "data-[focus=true]:!border-grayscale-500",
                        "font-sans",
                        "font-medium",
                        "text-[14px]",
                        "leading-[24px]",
                        rest.isInvalid ? "!text-error-500" : "text-grayscale-500",
                        rest.classNames?.segment,
                    ].filter(Boolean).join(" "),
                    caret: [
                        "bg-grayscale-500",
                        rest.classNames?.caret,
                    ].filter(Boolean).join(" "),
                    errorMessage: [
                        "hidden",
                        rest.classNames?.errorMessage,
                    ].filter(Boolean).join(" "),
                }}
            />
            <div className="flex justify-between items-center w-full mt-1">
                <div className="text-[12px] leading-4 font-sans">
                    {leftHelperText}
                </div>

                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className={`text-information-500 text-[12px] leading-4 font-sans font-semibold bg-transparent border-none cursor-pointer transition-opacity duration-200 ${hasValue ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    aria-label={isVisible ? 'Ocultar código. Ocultar los dígitos ingresados.' : 'Mostrar código. Mostrar los dígitos ingresados.'}
                >
                    {isVisible ? 'Ocultar código' : 'Mostrar código'}
                </button>
            </div>
        </div>
    );
};

export default OtpInput;