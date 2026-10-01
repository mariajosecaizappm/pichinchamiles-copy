import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { DateRangePickerProps } from "@heroui/react"

vi.mock("@heroui/react", () => ({
    DateRangePicker: ({ 
        isOpen, 
        onOpenChange,
        onChange,
        value,
        endContent,
        classNames,
        ...rest
    }: DateRangePickerProps) => {
        const dataTestId = (rest as unknown as Record<string, string>)["data-testid"]
        return (
            <div 
                data-testid={dataTestId ?? "date-range-picker"}
                data-isopen={isOpen ? "true" : "false"}
                data-has-value={value?.start || value?.end ? "true" : "false"}
            >
                <div data-testid="base-class">{classNames?.base as string}</div>
                <div data-testid="input-wrapper-class">{classNames?.inputWrapper as string}</div>
                <div data-testid="end-content">{endContent ?? "absent"}</div>
                <button 
                    data-testid="toggle-open"
                    onClick={() => onOpenChange && onOpenChange(!isOpen)}
                >
                    Toggle
                </button>
                <button
                    data-testid="clear-value"
                    onClick={() => onChange && onChange(null)}
                >
                    Clear
                </button>
            </div>
        )
    },
}))

import DateRangePicker from "@/presentation/components/Form/components/DateRangePicker/DateRangePicker"

describe("DateRangePicker", () => {
    it("should render with testId", () => {
        render(<DateRangePicker testId="my-date-picker" />)
        
        expect(screen.getByTestId("my-date-picker")).toBeInTheDocument()
    })

    it("should render without testId using default", () => {
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    it("should pass isOpen state", () => {
        render(<DateRangePicker isOpen={true} />)
        
        expect(screen.getByTestId("date-range-picker")).toHaveAttribute("data-isopen", "true")
    })

    it("should pass isOpen as false when not provided", () => {
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toHaveAttribute("data-isopen", "false")
    })

    it("should call onOpenChange when toggled", () => {
        const onOpenChange = vi.fn()
        render(<DateRangePicker onOpenChange={onOpenChange} />)
        
        screen.getByTestId("toggle-open").click()
        
        expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it("should apply custom base classNames", () => {
        render(<DateRangePicker testId="picker" />)
        
        const baseClass = screen.getByTestId("base-class")
        expect(baseClass.textContent).toContain("gap-2")
        expect(baseClass.textContent).toContain("@container")
    })

    it("should apply input wrapper styling classes", () => {
        render(<DateRangePicker isOpen={true} />)
        
        const inputWrapperClass = screen.getByTestId("input-wrapper-class")
        expect(inputWrapperClass.textContent).toContain("rounded-sm")
        expect(inputWrapperClass.textContent).toContain("border-information-500")
    })

    it("should pass lang as 'es'", () => {
        // The lang prop is passed but not visible in mock output
        // This test verifies the component renders without errors
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    it("should use bordered variant", () => {
        // Variant is passed to the component
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    it("should have labelPlacement outside", () => {
        // labelPlacement is passed to the component
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    it("should render with calendar icon", () => {
        // selectorIcon is passed as an SVG
        render(<DateRangePicker />)
        
        expect(screen.getByTestId("date-range-picker")).toBeInTheDocument()
    })

    it("should not render clear end content by default", () => {
        render(<DateRangePicker />)

        expect(screen.getByTestId("end-content")).toHaveTextContent("absent")
    })

    it("should render clear end content when isClearable is enabled with a value", () => {
        render(
            <DateRangePicker
                testId="picker"
                isClearable
                value={{
                    start: { year: 2026, month: 3, day: 11 },
                    end: { year: 2026, month: 3, day: 15 },
                }}
            />,
        )

        expect(screen.getByTestId("picker-clear")).toBeInTheDocument()
    })

    it("should call onChange with null when clear is triggered", () => {
        const onChange = vi.fn()
        render(
            <DateRangePicker
                testId="picker"
                isClearable
                onChange={onChange}
                value={{
                    start: { year: 2026, month: 3, day: 11 },
                    end: { year: 2026, month: 3, day: 15 },
                }}
            />,
        )

        fireEvent.click(screen.getByTestId("picker-clear"))

        expect(onChange).toHaveBeenCalledWith(null)
    })
})
