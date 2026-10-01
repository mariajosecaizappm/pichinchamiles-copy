"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities";

type CopaymentCounterProps = {
    type: CurrencyType;
    label: string;
    value: number;
    min: number;
    max: number;
    disabled?: boolean;
    onChange: (value: number) => void;
};

const CopaymentCounter = ({
    type,
    label,
    value,
    min,
    max,
    disabled = false,
    onChange,
}: CopaymentCounterProps) => {
    const isCoins = type === CurrencyType.COINS;
    const disableDecrement = value <= min;
    const disableIncrement = value >= max;

    const getNextValue = (direction: "up" | "down") => {
        const step = 1;
        const rawNext =
            direction === "up"
                ? Number.parseFloat((value + step).toFixed(2))
                : Number.parseFloat((value - step).toFixed(2));

        if (direction === "up") {
            return rawNext > max ? max : rawNext;
        }

        return rawNext < min ? min : rawNext;
    };

    const formattedValue = isCoins ? formatCopaymentAmount(value) : formatMiles(value);

    return (
        <div
            className={clsx(
                "flex w-full max-w-[164px] flex-col gap-2"
            )}
        >
            <span className="text-base font-bold text-grayscale-500">{label}</span>
            <div className="flex h-10 items-center justify-between gap-2 rounded-sm border border-grayscale-200 bg-white px-2">
                <button
                    type="button"
                    className="flex size-6 items-center justify-center text-information-500 disabled:opacity-40"
                    onClick={() => onChange(getNextValue("down"))}
                    disabled={disabled || disableDecrement}
                    aria-label={`Disminuir ${label.toLowerCase()}`}
                >
                    <Icon icon="mdi:minus" className="size-6" />
                </button>
                <span className="min-w-[60px] text-center text-sm font-medium leading-6 text-grayscale-500">
                    {formattedValue}
                </span>
                <button
                    type="button"
                    className="flex size-6 items-center justify-center text-information-500 disabled:opacity-40"
                    onClick={() => onChange(getNextValue("up"))}
                    disabled={disabled || disableIncrement}
                    aria-label={`Aumentar ${label.toLowerCase()}`}
                >
                    <Icon icon="mdi:plus" className="size-6" />
                </button>
            </div>
        </div>
    );
};

export default CopaymentCounter;
