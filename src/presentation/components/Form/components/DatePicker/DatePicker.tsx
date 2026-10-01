import { DatePicker } from "@heroui/react";
import React from "react";

export interface BaseDatePickerProps extends React.ComponentProps<typeof DatePicker> {
    testId?: string;
}

const BaseRangePicker = ({ isOpen, onOpenChange, testId, classNames, ...props }: BaseDatePickerProps) => {


    return (

        <DatePicker
            {...props}
            data-testid={testId}
            variant="bordered"
            lang="es"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            selectorIcon={<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 2H17V0H15V2H5V0H3V2H2C0.9 2 0 2.9 0 4V20C0 21.1 0.9 22 2 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H2V9H18V20ZM18 7H2V4H18V7Z" fill="currentColor" />
            </svg>
            }
                
            classNames={{
                base: "gap-2 @container",
                label: "font-semibold text-sm leading-4 text-grayscale-500 group-data-[invalid=true]:text-grayscale-500!",
                selectorButton: "min-w-8 w-8 h-8",
                selectorIcon: "ws-5 h-5",
                inputWrapper: [
                    " rounded-sm shadow-none p-3 h-12",
                    "border border-grayscale-200",
                    "hover:border-information-500",
                    "focus-within:border-information-500",
                    "focus-within:border-2",
                    "focus-within:hover:border-information-500",
                    "group-data-[invalid=true]:focus-within:border-danger",
                    isOpen && "border-2 border-information-500"
                ].join(" "),
                segment: [
                    "text-grayscale-300",
                    "data-[editable=true]:text-grayscale-500",
                    "data-[editable=true]:data-[placeholder=true]:text-grayscale-300",
                    "focus:bg-information-50",
                    "data-[editable=true]:focus:text-information-500!",
                    "data-[invalid=true]:text-danger!",
                    "data-[invalid=true]:focus:text-danger-400/50!",
                ].join(" "),
                popoverContent: "p-0 shadow-lg rounded-lg",
                timeInput: "p-0 gap-2 justify-between [&_[data-slot=input-wrapper]]:flex-none [&_[data-slot=input-wrapper]]:w-min [&_[data-slot=input-wrapper]]:shadow-none [&_[data-slot=input-wrapper]]:px-2",
                timeInputLabel: "flex-1 text-[18px] leading-[22px] font-medium text-blue-500",
                ...classNames,
            }}
            calendarProps={{
                classNames: {
                    
                    base: "bg-white shadow-none border-0 rounded-lg p-6 font-sans w-full min-w-75 shrink-0",
                    content: "w-full flex flex-col gap-6",
                    headerWrapper: "p-0 after:bg-transparent gap-2",
                    header: "flex w-full items-center gap-2 z-10 order-2 justify-start p-0 bg-transparent capitalize w-min! flex-1",
                    title: "text-[18px] leading-[22px] font-normal text-blue-500",
                    cellButton: [
                        "w-8 h-8 leading-6 p-0",
                        "data-[selected=true]:bg-blue-500 data-[selected=true]:text-white data-[hover=true]:bg-blue-500 data-[hover=true]:text-white data-[selected=true]:data-[hover=true]:bg-blue-500 data-[selected=true]:data-[hover=true]:text-white"
                    
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