import { Button, cn, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React from "react";

interface PopoverSelectProps {
    className?: string;
    testId?: string;
    value?: string;
    label?: string;
    isInvalid?: boolean;
    isDisabled?: boolean;
    children?: React.ReactNode;
}

const PopoverSelect = ({ className, testId, label, isInvalid, isDisabled, children, value }: PopoverSelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = React.useState<number>(0);


    React.useEffect(() => {
        if (isOpen && triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpen]);

    return (
        <div className={cn("flex flex-col gap-2", className)} data-testid={testId}>
            {label && (
                <label
                    className={[
                        "block text-sm font-semibold leading-4",
                        isInvalid ? "text-danger" : "",
                        isDisabled ? "opacity-50" : "",
                    ].join(" ")}
                >
                    {label}
                </label>
            )}
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom-start"
                disableAnimation
                triggerType={"listbox"}
                triggerScaleOnOpen={false}
                offset={0}
                shouldFlip={false}
                classNames={{
                    content: `rounded-sm shadow-none border-2 border-information-500 rounded-t-none border-t-0`
                }}
                style={{ width: triggerWidth }}

            >
                <PopoverTrigger>
                    <Button
                        ref={triggerRef}
                        type="button"
                        variant="bordered"
                        disableRipple
                        disableAnimation
                        disabled={isDisabled}
                        aria-label={label}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        className={[
                            "w-full flex items-center justify-between",
                            "rounded-sm p-3 h-12",
                            "border border-grayscale-200",
                            "hover:border-information-500",
                            "data-[hover=true]:opacity-100!",
                            "outline-offset-0",
                            isOpen ? "border-2 border-information-500 rounded-b-none border-b-0" : "",
                        ].join(" ")}
                    >
                        <span className={isOpen ? "text-grayscale-400" : "text-grayscale-500"} aria-hidden="true">
                            {value}
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M7 10L12 15L17 10H7Z" fill="#0F265C" />
                        </svg>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 overflow-hidden relative before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-grayscale-100">
                    {children}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default PopoverSelect
