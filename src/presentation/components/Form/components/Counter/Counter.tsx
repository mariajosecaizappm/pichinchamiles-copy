import clsx from "clsx";
import CounterTrigger from "./CounterTrigger";

type Props = {
    count: number;
    min: number;
    max: number;
    isReadonly?: boolean;
    label?: string;
    onChange: (count: number) => void;
    className?: string;
    countClassName?: string;
    formatValue?: (count: number) => string;
}

const Counter = ({ count, min, max, isReadonly = false, label, onChange, className, countClassName, formatValue }: Props) => {
    const getNextValue = (direction: "up" | "down") => {
        const rawNext = direction === "up" ? count + 1 : count - 1;

        if (direction === "up") {
            return Math.min(rawNext, max);
        }

        return Math.max(rawNext, min);
    };

    return (
        <div className={clsx(
            "flex py-1 px-2 items-center self-stretch rounded-sm gap-2.5 border border-grayscale-200",
            isReadonly && "bg-grayscale-50",
            className
        )}>
            <CounterTrigger
                isReadonly={isReadonly}
                onPress={() => onChange(getNextValue("down"))}
                aria-label={`Disminuir ${label}`}
                isDisabled={count <= min || isReadonly}
            >
                <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H0V0H14V2Z" fill="currentColor" />
                </svg>
            </CounterTrigger>

            <span className={clsx("text-sm leading-6 font-medium text-center", countClassName)}>
                {formatValue ? formatValue(count) : count}
            </span>
            <CounterTrigger
                isReadonly={isReadonly}
                onPress={() => onChange(getNextValue("up"))}
                aria-label={`Aumentar ${label}`}
                isDisabled={count >= max || isReadonly}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="currentColor" />
                </svg>
            </CounterTrigger>
        </div>
    );
};

export default Counter;
