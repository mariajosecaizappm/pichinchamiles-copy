"use client";

import { Icon } from "@iconify/react";

type ShoppingCartQuantityFieldProps = {
    value: number;
    min?: number;
    max: number;
    disabled?: boolean;
    onDecrease: () => void;
    onIncrease: () => void;
    onRemove: () => void;
};

const ShoppingCartQuantityField = ({
    value,
    min = 1,
    max,
    disabled = false,
    onDecrease,
    onIncrease,
    onRemove,
}: ShoppingCartQuantityFieldProps) => {
    const canDecrease = value > min;

    return (
        <div className="flex h-10 w-[118px] items-center justify-center gap-3 rounded-sm border border-grayscale-200 bg-white px-2 py-1">
            <button
                type="button"
                className="flex size-6 items-center justify-center text-information-500 disabled:opacity-40"
                onClick={canDecrease ? onDecrease : onRemove}
                disabled={disabled}
                aria-label={canDecrease ? "Disminuir cantidad" : "Eliminar producto"}
            >
                <Icon
                    icon={canDecrease ? "mdi:minus" : "mdi:delete-outline"}
                    className="size-6"
                />
            </button>
            <span className="min-w-[30px] text-center text-sm font-medium leading-6 text-grayscale-500">
                {value}
            </span>
            <button
                type="button"
                className="flex size-6 items-center justify-center text-information-500 disabled:opacity-40"
                onClick={onIncrease}
                disabled={disabled || value >= max}
                aria-label="Aumentar cantidad"
            >
                <Icon icon="mdi:plus" className="size-6" />
            </button>
        </div>
    );
};

export default ShoppingCartQuantityField;
