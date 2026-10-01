import React, {FC, ReactNode} from 'react';
import {Checkbox} from "@/presentation/components/Form/components/Checkbox";

type FeeCheckboxProps = {
    name: string
    label: ReactNode
    checked: boolean
    onChange: (checked: boolean) => void
    hasError: boolean
    errorMessage?: string
}

const FeeCheckbox: FC<FeeCheckboxProps> = ({
    name,
    label,
    checked,
    onChange,
    hasError,
    errorMessage = "Debes marcar esta opción para continuar"
}) => {
    return (
        <div>
            <div className={`border ${hasError ? "border-error-300" : "border-grayscale-200"} rounded-sm p-[14px]`}>
                <Checkbox
                    name={name}
                    label={<span className="text-black">{label}</span>}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
            </div>
            {hasError && (
                <p className="mt-2 text-[12px] leading-[16px] font-medium text-error-500">{errorMessage}</p>
            )}
        </div>
    );
};

export default FeeCheckbox;
