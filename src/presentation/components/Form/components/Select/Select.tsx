// app/presentation/Form/components/Select.tsx
import IconSelector from "@/presentation/components/icons/IconSelector"
import { Select, SelectProps } from "@heroui/react"
import { FC } from "react"
import { clsx } from "clsx"

export interface SelectOption {
  id: string
  name: string
}

export interface BaseSelectProps extends SelectProps {
  testId?: string
  iconColor?: string
}

const BaseSelect: FC<BaseSelectProps> = ({
    disabled,
    isDisabled,
    testId,
    iconColor,
    classNames,
    listboxProps,
    ...rest
}) => {
    const finalIsDisabled = isDisabled ?? disabled

    const { label, value, trigger, popoverContent, listboxWrapper, listbox, selectorIcon, ...restClassNames } = classNames ?? {}
    const { itemClasses, ...restListboxProps } = listboxProps ?? {}
    const { wrapper, base, selectedIcon, ...restItemClasses } = itemClasses ?? {}
    const isInvalid = Boolean(rest.isInvalid ?? rest.errorMessage)

    return (
        <Select
            {...rest}
            isDisabled={finalIsDisabled}
            data-testid={testId}
            variant="bordered"
            labelPlacement="outside-top"
            disableAnimation
            disableSelectorIconRotation
            classNames={{
                label: clsx("font-semibold text-sm leading-4 text-grayscale-500! z-0", label),
                value: clsx("font-medium text-grayscale-300 group:data-[filled=true]:text-grayscale-500 text-sm", value),
                trigger: clsx([
                    "rounded-sm shadow-none p-3 h-12",
                    "border border-grayscale-200",
                    "data-[hover=true]:border-information-500",
                    "data-[focus=true]:border-information-500",
                    "data-[open=true]:border-2 data-[open=true]:border-information-500",
                    "data-[open=true]:border-b-transparent",
                    "data-[open=true]:rounded-b-none",
                    "outline-none",
                ], trigger),
                popoverContent: clsx([
                    "p-0 shadow-none",
                    "border-2 border-information-500 border-t-0",
                    "rounded-t-none rounded-b-sm",
                    isInvalid && "border-danger-500"
                ], popoverContent),
                listboxWrapper: clsx("p-0", listboxWrapper),
                listbox: clsx("p-0", listbox),
                selectorIcon: clsx("w-6 h-6", selectorIcon),
                ...restClassNames
            }}
            popoverProps={{
                offset: -1.5,
                shadow: "none",
                shouldFlip: false
            }}
            listboxProps={{
                ...restListboxProps,
                itemClasses: {
                    wrapper: clsx("border", wrapper),
                    base: clsx([
                        "px-4 py-2 rounded-none h-10",
                        "text-grayscale-400",
                        "data-[hover=true]:bg-darkGrayishBlue-100",
                        "data-[selectable=true]:focus:bg-darkGrayishBlue-100",
                        "data-[selected=true]:bg-darkGrayishBlue-100",
                        "first:border-t border-grayscale-100",
                        "outline-none"
                    ], base),
                    selectedIcon: clsx("text-blue-500", selectedIcon),
                    ...restItemClasses
                },
            }}
            selectorIcon={<IconSelector color={iconColor} />}
        />
    )
}

export default BaseSelect