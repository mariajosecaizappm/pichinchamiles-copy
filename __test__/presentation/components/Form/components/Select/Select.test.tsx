import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { SelectProps } from "@heroui/react"

vi.mock("@heroui/react", () => ({
    Select: ({ 
        disabled,
        isDisabled,
        variant,
        labelPlacement,
        children,
        ...rest
    }: SelectProps & { "data-testid"?: string }) => {
        const dataTestId = (rest as unknown as Record<string, string>)["data-testid"]
        return (
            <div 
                data-testid={dataTestId ?? "select"}
                data-disabled={(isDisabled ?? disabled) ? "true" : "false"}
                data-variant={variant}
                data-label-placement={labelPlacement}
            >
                <>{children}</>
            </div>
        )
    },
}))

import Select from "@/presentation/components/Form/components/Select/Select"

describe("Select", () => {
    it("should render with testId", () => {
        render(<Select testId="my-select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("my-select")).toBeInTheDocument()
    })

    it("should render without testId using default", () => {
        render(<Select><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toBeInTheDocument()
    })

    it("should handle disabled prop", () => {
        render(<Select disabled testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-disabled", "true")
    })

    it("should handle isDisabled prop", () => {
        render(<Select isDisabled testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-disabled", "true")
    })

    it("should prioritize isDisabled over disabled when both provided", () => {
        render(<Select isDisabled={false} disabled={true} testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-disabled", "false")
    })

    it("should use bordered variant", () => {
        render(<Select testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-variant", "bordered")
    })

    it("should use outside-top label placement", () => {
        render(<Select testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-label-placement", "outside-top")
    })

    it("should not be disabled by default", () => {
        render(<Select testId="select"><option>Option 1</option></Select>)
        
        expect(screen.getByTestId("select")).toHaveAttribute("data-disabled", "false")
    })

    it("should render children", () => {
        render(<Select testId="select"><option data-testid="option-1">Option 1</option></Select>)
        
        expect(screen.getByTestId("option-1")).toBeInTheDocument()
    })

    it("should render multiple children", () => {
        render(
            <Select testId="select">
                <option data-testid="option-1">Option 1</option>
                <option data-testid="option-2">Option 2</option>
            </Select>
        )
        
        expect(screen.getByTestId("option-1")).toBeInTheDocument()
        expect(screen.getByTestId("option-2")).toBeInTheDocument()
    })
})
