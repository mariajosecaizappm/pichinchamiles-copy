import React from "react";
import CloseIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon";

type DateRangePickerClearButtonProps = {
    testId?: string;
    onClear: () => void;
};

const DateRangePickerClearButton = ({ testId, onClear }: DateRangePickerClearButtonProps) => {
    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onClear();
    };

    return (
        <button
            type="button"
            aria-label="Limpiar fechas"
            data-testid={testId ? `${testId}-clear` : undefined}
            className="order-2 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2F313829]"
            onClick={handleClear}
            onPointerDown={(event) => event.stopPropagation()}
        >
            <CloseIcon className="size-[14px] text-[#5E626F]" />
        </button>
    );
};

export default DateRangePickerClearButton;
