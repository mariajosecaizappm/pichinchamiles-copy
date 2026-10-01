import { Checkbox, CheckboxProps } from "@heroui/react"
import React, { FC, ReactNode, useMemo } from "react"
import { cn } from "@heroui/theme"

export interface BaseCheckboxProps extends Omit<CheckboxProps, "children"> {
    name: string
    label?: ReactNode
    labelClassName?: string
    testId?: string
    isSelected?: boolean
}

const BaseCheckbox: FC<BaseCheckboxProps> = ({
    label,
    labelClassName,
    testId,
    className,
    classNames,
    isSelected,
    onValueChange,
    "aria-label": ariaLabel,
    ...rest
}) => {
    const dynamicAriaLabel = useMemo(() => {
        const baseLabel = ariaLabel ?? (typeof label === 'string' ? label : '');
        const stateLabel = isSelected ? "Casilla seleccionada." : "Casilla no seleccionada.";
        return `${baseLabel} ${stateLabel}`.trim();
    }, [ariaLabel, label, isSelected]);

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <Checkbox
                {...rest}
                data-testid={testId}
                radius="sm"
                isSelected={isSelected}
                onValueChange={onValueChange}
                aria-label={dynamicAriaLabel}
                classNames={{
                    ...classNames,
                    base: cn("m-0 p-0", classNames?.base),
                    label: cn("ml-2 text-sm font-medium leading-5", classNames?.label),
                    wrapper: cn("w-[20px] h-[20px] rounded-[4px] border-grayscale-400 before:border-grayscale-400 data-[selected=true]:border-information-500 m-0 before:border-1 before:border-grayscale-400 after:bg-information-500 before:rounded-sm rounded-sm after:rounded-sm", classNames?.wrapper),
                    icon: cn("text-white", classNames?.icon),
                }}
            />
            {label && (
                <div
                    className={cn("typo-main-caption-book text-grayscale-400 mt-0.5", labelClassName)}
                >
                    {label}
                </div>
            )}

        </div>
    )
}

export default BaseCheckbox
