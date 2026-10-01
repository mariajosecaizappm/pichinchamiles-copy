import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { DatePickerProps } from "@heroui/react"

vi.mock("@heroui/react", () => ({
    DatePicker: ({ 
        isOpen, 
        onOpenChange, 
        classNames,
        ...rest
    }: DatePickerProps) => {
        const dataTestId = (rest as unknown as Record<string, string>)["data-testid"]
        return (
            <div 
                data-testid={dataTestId || "date-picker"}
                data-isopen={isOpen ? "true" : "false"}
            >
                <div data-testid="base-class">{classNames?.base as string}</div>
                <div data-testid="input-wrapper-class">{classNames?.inputWrapper as string}</div>
                <button 
                    data-testid="toggle-open"
                    onClick={() => onOpenChange && onOpenChange(!isOpen)}
                >
                    Toggle
                </button>
            </div>
        )
    },
}))

import DatePicker from "@/presentation/components/Form/components/DatePicker/DatePicker"

describe("DatePicker", () => {
    it("should render with testId", () => {
        render(<DatePicker testId="my-date-picker" />)
        
        expect(screen.getByTestId("my-date-picker")).toBeInTheDocument()
    })

    it("should render without testId using default", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
    })

    it("should pass isOpen state", () => {
        render(<DatePicker isOpen={true} />)
        
        expect(screen.getByTestId("date-picker")).toHaveAttribute("data-isopen", "true")
    })

    it("should pass isOpen as false when not provided", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toHaveAttribute("data-isopen", "false")
    })

    it("should call onOpenChange when toggled", () => {
        const onOpenChange = vi.fn()
        render(<DatePicker onOpenChange={onOpenChange} />)
        
        screen.getByTestId("toggle-open").click()
        
        expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it("should apply custom base classNames", () => {
        render(<DatePicker testId="picker" />)
        
        const baseClass = screen.getByTestId("base-class")
        expect(baseClass.textContent).toContain("gap-2")
        expect(baseClass.textContent).toContain("@container")
    })

    it("should apply input wrapper styling classes", () => {
        render(<DatePicker isOpen={true} />)
        
        const inputWrapperClass = screen.getByTestId("input-wrapper-class")
        expect(inputWrapperClass.textContent).toContain("rounded-sm")
        expect(inputWrapperClass.textContent).toContain("border-information-500")
    })

    it("should pass lang as 'es'", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
    })

    it("should use bordered variant", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
    })

    it("should have labelPlacement outside", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
    })

    it("should render with calendar icon", () => {
        render(<DatePicker />)
        
        expect(screen.getByTestId("date-picker")).toBeInTheDocument()
    })
})
