import { Button, ButtonProps } from "@heroui/react";
import clsx from "clsx";

type Props = {
    className?: string;
    isReadonly?: boolean;
    children?: React.ReactNode;
} & ButtonProps

const CounterTrigger = ({ className, isReadonly, children, ...props }: Props) => {

    return (
        <Button
            size="sm"
            variant="light"
            isIconOnly
            className={clsx("min-w-6 w-6 h-6 flex items-center justify-center text-information-500 rounded-sm", isReadonly && "opacity-0", className)}
            {...props}
        >
            {children}
        </Button>
    )
};

export default CounterTrigger;
