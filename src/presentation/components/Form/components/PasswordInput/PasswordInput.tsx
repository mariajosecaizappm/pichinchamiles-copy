import { Input, InputProps } from "@heroui/react"
import { FC, ReactNode } from "react";

export interface PasswordInputProps extends InputProps {
    name: string
    helpText?: ReactNode
    testId?: string
    errorMessage?: string
}

export interface PasswordInputPresentationalProps extends PasswordInputProps {
    isVisible: boolean
    toggleVisibility: () => void
    isFocused: boolean
    handleFocus: () => void
    handleBlur: () => void
    characterCountLabel: string
    showLengthIndicator: boolean | number | undefined
    currentLength: number
}

const BasePasswordInput: FC<PasswordInputPresentationalProps> = ({
    helpText,
    isInvalid,
    testId,
    maxLength,
    value,
    isVisible,
    toggleVisibility,
    handleFocus,
    handleBlur,
    characterCountLabel,
    showLengthIndicator,
    currentLength,
    ...rest
}) => {

    return (
        <div className="flex flex-col w-full relative">
            <Input
                {...rest}
                value={value}
                maxLength={maxLength}
                type={isVisible ? "text" : "password"}
                data-testid={testId}
                variant={rest.variant ?? "bordered"}
                isInvalid={isInvalid}
                placeholder={rest.placeholder || " "}
                onFocus={handleFocus}
                onBlur={handleBlur}
                classNames={{
                    base: "w-full",
                    label: "text-sm font-semibold leading-4 !mb-2 !text-grayscale-500",
                    input: `!leading-6 placeholder:text-grayscale-300 font-medium ${isInvalid ? "!text-error-500" : "text-grayscale-500"} !text-sm ${isVisible ? "" : "[-webkit-text-security:disc] tracking-widest placeholder:tracking-normal"}`,
                    inputWrapper: `border bg-white rounded-sm !p-3 !h-[48px] !min-h-[48px] ${isInvalid ? "!border-error-500" : "data-[focus=true]:!border-grayscale-500"} flex items-center`,
                    innerWrapper: "flex items-center w-full",
                    errorMessage: "text-error-500 font-body3",
                    helperWrapper: "mt-2 !p-0",
                    description: "font-body3 text-default-400",
                    ...rest.classNames,
                }}
                className=""
                size={rest.size ?? "lg"}
                labelPlacement={rest.labelPlacement ?? "outside"}
                description={helpText}
                endContent={
                    <button
                        className="focus:outline-none bg-transparent border-none cursor-pointer"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Ocultar contraseña. Oculta los caracteres ingresados." : "Mostrar contraseña. Muestra los caracteres ingresados."}
                    >
                        <span className="text-information-600 text-[14px] leading-5 font-sans font-medium hover:text-information-700 transition-colors">
                            {isVisible ? "Ocultar" : "Mostrar"}
                        </span>
                    </button>
                }
            />
            {showLengthIndicator && (
                <div 
                    className="absolute -bottom-5 right-0 font-sans text-[12px] font-semibold leading-[16px] text-grayscale-400"
                    aria-label={characterCountLabel}
                    aria-live="polite"
                >
                    {currentLength}/{maxLength}
                </div>
            )}
        </div>
    )
}

export default BasePasswordInput;
export { default as PasswordInputContainer } from "./PasswordInputContainer";
