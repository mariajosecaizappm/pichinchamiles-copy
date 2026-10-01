import { DateRangePicker } from "@heroui/react";
import React from "react";
import IconCalendar from "@/presentation/components/icons/IconCalendar";
import DateRangePickerClearButton from "@/presentation/components/Form/components/DateRangePicker/DateRangePickerClearButton";

export interface BaseRangePickerProps extends React.ComponentProps<typeof DateRangePicker> {
    testId?: string;
    isClearable?: boolean;
}

const BaseRangePicker = ({
    isOpen,
    onOpenChange,
    testId,
    classNames: classNamesProp,
    isClearable = false,
    value,
    onChange,
    endContent,
    ...props
}: BaseRangePickerProps) => {
    const hasValue = !!(value?.start || value?.end);

    const clearButton = isClearable && hasValue ? (
        <DateRangePickerClearButton
            testId={testId}
            onClear={() => onChange?.(null)}
        />
    ) : null;

    const shouldRenderClearControls = isClearable && hasValue && !endContent;
    const selectorButtonClassName = "min-w-6 w-6 h-6 @[256px]:min-w-8 @[256px]:w-8 @[256px]:h-8";
    const innerWrapperClassName = shouldRenderClearControls
        ? [
            "flex flex-1 items-center gap-1.5",
            "[&>*:first-child]:order-last",
            "[&>*:last-child]:order-2",
            "[&>*:not(:first-child):not(:last-child)]:order-1",
        ].join(" ")
        : undefined;
    const { innerWrapper: customInnerWrapper, ...restClassNames } = classNamesProp ?? {};

    return (

        <DateRangePicker
            {...props}
            value={value}
            onChange={onChange}
            data-testid={testId}
            variant="bordered"
            lang="es"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectorButtonPlacement={shouldRenderClearControls ? "start" : "end"}
            endContent={endContent ?? (shouldRenderClearControls ? clearButton : undefined)}
            selectorIcon={<IconCalendar />}

            classNames={{
                base: "gap-2 @container",
                label: "font-semibold text-sm leading-4 text-grayscale-500 group-data-[invalid=true]:text-grayscale-500!",
                selectorButton: selectorButtonClassName,
                selectorIcon: "w-4 h-4 text-grayscale-500 @[256px]:w-5 @[256px]:h-5",
                inputWrapper: [
                    "rounded-sm shadow-none p-3 h-12",
                    "border border-grayscale-200",
                    "hover:border-information-500",
                    "focus-within:border-information-500",
                    "focus-within:border-2",
                    "focus-within:hover:border-information-500",
                    "group-data-[invalid=true]:focus-within:border-danger",
                    "data-[editable=true]:data-[placeholder=true]:text-danger!",
                    isOpen && "border-2 border-information-500"
                ].join(" "),
                errorMessage: "text-danger font-medium",
                segment: [
                    "text-grayscale-300",
                    "data-[editable=true]:text-grayscale-500",
                    "data-[editable=true]:data-[placeholder=true]:text-grayscale-300",
                    "focus:bg-information-50",
                    "data-[editable=true]:focus:text-information-500!",
                    "data-[invalid=true]:text-danger!",
                    "data-[invalid=true]:focus:text-danger-400/50!",
                ].join(" "),
                separator: "text-grayscale-400 group-data-[invalid=true]:text-danger!",
                popoverContent: "p-0 shadow-lg rounded-lg",
                innerWrapper: [innerWrapperClassName, customInnerWrapper].filter(Boolean).join(" "),
                ...restClassNames,
            }}
            popoverProps={{
                offset: 8,
                shadow: "lg",
            }}
            calendarProps={{
                classNames: {
                    base: "bg-white shadow-none border-0 w-full rounded-lg p-6 font-sans",
                    content: "w-full flex flex-col gap-6",
                    headerWrapper: "p-0 after:bg-transparent gap-2",
                    header: "flex w-full items-center gap-2 z-10 order-2 justify-start p-0 bg-transparent capitalize w-min! flex-1",
                    title: "text-[18px] leading-[22px] font-normal text-blue-500",
                    cellButton: [
                        "w-8 h-8 leading-6 p-0",
                        "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:bg-blue-500",
                        "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:bg-blue-500",
                        "data-[selected=true]:data-[range-selection=true]:before:bg-blue-50",
                        "data-[selected=true]:data-[range-selection=true]:text-grayscale-500",
                    ].join(" "),
                    cell: "flex-1 flex justify-center items-center py-0.5 overflow-hidden",
                    prevButton: "order-3 text-blue-500 bg-blue-50 min-w-8 w-8 h-8",
                    nextButton: "order-4 text-blue-500 bg-blue-50 min-w-8 w-8 h-8",
                    gridWrapper: "w-full border-t border-darkGrayishBlue-300 pt-6",
                    gridHeaderRow: "p-0 w-full flex",
                    gridHeaderCell: "flex flex-1 justify-center items-center font-semibold text-blue-500 leading-6",
                    gridBodyRow: "flex items-center",
                    gridHeader: "bg-transparent shadow-none",
                },
                showMonthAndYearPickers: true,
                disableAnimation: true,
            }}
            labelPlacement="outside"
        />

    )
}

export default BaseRangePicker


