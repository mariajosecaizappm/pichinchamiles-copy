import { Button, cn, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React from "react";
import PassengerSelectItem from "./PassengerSelectItem";
import PassengersSelectAge from "./PassengersSelectAge";
import { PassengersSelectProps } from "./types";

const getLabelClassName = (isInvalid?: boolean, isDisabled?: boolean) => [
    "block text-sm font-semibold leading-4",
    isInvalid ? "text-danger" : "",
    isDisabled ? "opacity-50" : "",
].join(" ");

const getButtonClassName = (isOpen?: boolean) => [
    "w-full flex items-center justify-between",
    "rounded-sm p-3 h-12",
    "border border-grayscale-200",
    "hover:border-information-500",
    "data-[hover=true]:opacity-100!",
    "outline-offset-0",
    isOpen ? "border-2 border-information-500 rounded-b-none border-b-0" : "",
].join(" ");

const PassengersSelect = ({
    categories,
    isDisabled,
    isInvalid,
    label,
    className,
    testId,
    showRoom = false,
    roomLabel = "Habitación",
    showAgeSelect = false,
    displayValue,
    childrenCount = 0,
    onChange,
    isOpen = false,
    setIsOpen,
    triggerRef,
    triggerWidth = 0,
    triggerAriaLabel,
}: PassengersSelectProps) => {
    const labelId = testId ? `${testId}-label` : undefined;
    const valueId = testId ? `${testId}-value` : undefined;

    return (
        <div className={cn("flex flex-col gap-2", className)} data-testid={testId}>
            {label && (
                <label
                    id={labelId}
                    className={getLabelClassName(isInvalid, isDisabled)}
                >
                    {label}
                </label>
            )}
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen || (() => {})}
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
                        aria-labelledby={labelId && valueId ? `${labelId} ${valueId}` : undefined}
                        aria-label={triggerAriaLabel}
                        className={getButtonClassName(isOpen)}
                    >
                        <span id={valueId} className={isOpen ? "text-grayscale-400" : "text-grayscale-500"}>
                            {displayValue ?? "Número de pasajeros"}
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10H7Z" fill="#0F265C" />
                        </svg>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 overflow-hidden ">
                    <div className="w-full first:border-t first:border-t-grayscale-100">
                        {showRoom && (
                            <PassengerSelectItem
                                key="room"
                                label={roomLabel}
                                min={1}
                                max={1}
                                value={1}
                                onChange={() => {}}
                                state={'readonly'}
                            />
                        )}
                        {categories.map((cat) => (
                            <PassengerSelectItem
                                key={cat.key}
                                label={cat.label}
                                min={cat.min}
                                max={cat.max}
                                value={cat.value}
                                onChange={(v) => onChange?.(cat.key, v)}
                                state={cat.state}
                            />
                        ))}
                        {showAgeSelect && (
                            <PassengersSelectAge
                                childrenCount={childrenCount}
                            />
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default PassengersSelect;