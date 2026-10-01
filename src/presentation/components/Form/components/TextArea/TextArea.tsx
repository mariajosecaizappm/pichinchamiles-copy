import { Textarea, TextAreaProps } from "@heroui/react"
import { FC, ReactNode } from "react"
import { clsx } from "clsx"

export interface BaseTextAreaProps extends TextAreaProps {
    name: string
    helpText?: ReactNode
    testId?: string
    errorId?: string
}

const BaseTextArea: FC<BaseTextAreaProps> = (props) => {
    const {isInvalid} = props

    return <Textarea {...props}
        labelPlacement="outside"
        classNames={{
            base: "data-[disabled=true]:opacity-100",
            label: "text-sm font-semibold leading-4 !mb-2 !text-grayscale-500 group-data-[disabled=true]:!text-grayscale-500 group-data-[disabled=true]:!opacity-100",
            input: clsx(`!text-sm !leading-6 placeholder:text-grayscale-300 font-medium ${isInvalid ? "!text-error-500" : "text-grayscale-500"} group-data-[disabled=true]:!text-grayscale-400 group-data-[disabled=true]:!text-opacity-100 group-data-[has-value=true]:group-data-[disabled=true]:!text-grayscale-400`,),
            inputWrapper: clsx(`bg-white! rounded-sm !p-3 border border-grayscale-200 shadow-none data-[hover=true]:bg-white! data-[hover=true]:border-information-500 group-data-[focus=true]:bg-white! group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-transparent ${isInvalid ? "!border-error-500" : "data-[focus=true]:!border-grayscale-500"} group-data-[disabled=true]:!pointer-events-none group-data-[disabled=true]:!transition-none group-data-[disabled=true]:!bg-grayscale-50 group-data-[disabled=true]:!border-grayscale-200 group-data-[disabled=true]:!opacity-100`),
            errorMessage: "text-error-500 font-body3",
            helperWrapper: "mt-2 !p-0",
            description: "font-body3 text-grayscale-400 font-medium",
        }}/>
}

export default BaseTextArea