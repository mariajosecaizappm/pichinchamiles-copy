import {Input, InputProps} from "@heroui/react"
import {FC, ReactNode} from "react";
import { clsx } from "clsx";

export interface BaseInputProps extends InputProps {
    name: string
    helpText?: ReactNode
    testId?: string
    errorId?: string
}

const BaseInput: FC<BaseInputProps> = ({
    helpText,
    isInvalid,
    testId,
    disabled,
    isDisabled,
    disableAnimation,
    classNames,
    errorId,
    ...rest
}) => {
    const finalIsDisabled = isDisabled ?? disabled;

    const { base, label, input, inputWrapper, errorMessage, helperWrapper, description, ...restClassNames } = classNames ?? {}

    return (
        <Input
            {...rest}
            isDisabled={finalIsDisabled}
            disableAnimation={disableAnimation ?? finalIsDisabled}
            data-testid={testId}
            variant={rest.variant ?? "bordered"}
            isInvalid={isInvalid}
            classNames={{
                base: clsx("data-[disabled=true]:opacity-100", base),
                label: clsx("text-sm font-semibold leading-4 !mb-2 !text-grayscale-500 group-data-[disabled=true]:!text-grayscale-500 group-data-[disabled=true]:!opacity-100", label),
                input: clsx(`!text-sm !leading-6 placeholder:text-grayscale-300 font-medium ${isInvalid ? "!text-error-500" : "text-grayscale-500"} group-data-[disabled=true]:!text-grayscale-400 group-data-[disabled=true]:!text-opacity-100 group-data-[has-value=true]:group-data-[disabled=true]:!text-grayscale-400`, input),
                inputWrapper: clsx(`border bg-white rounded-sm !p-3 ${isInvalid ? "!border-error-500" : "data-[focus=true]:!border-grayscale-500"} group-data-[disabled=true]:!pointer-events-none group-data-[disabled=true]:!transition-none group-data-[disabled=true]:!bg-grayscale-50 group-data-[disabled=true]:!border-grayscale-200 group-data-[disabled=true]:!opacity-100`, inputWrapper),
                errorMessage: clsx("text-error-500 font-body3", errorMessage),
                helperWrapper: clsx("mt-2 !p-0", helperWrapper),
                description: clsx("font-body3 text-default-400", description),
                ...restClassNames,
            }}
            className=""
            size={rest.size ?? "lg"}
            labelPlacement={rest.labelPlacement ?? "outside"}
            description={helpText}
            errorMessageProps={{
                id: errorId
            }}
      
        />
    )
}

export default BaseInput
