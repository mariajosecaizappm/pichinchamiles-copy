import React from "react"
import {render, screen, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import FeeCheckbox from "@/presentation/pages/FeePay/components/FeePaymentForm/FeeCheckbox"

const mocks = vi.hoisted(() => ({
    onChange: vi.fn(),
    checkboxCallbacks: new Map<string, (val: boolean) => void>(),
}))

vi.mock("@/presentation/components/Form/components/Checkbox", () => ({
    Checkbox: ({name, isSelected, onValueChange, checked, onChange, label, "aria-label": ariaLabel, "data-testid": testId, children, ...rest}: any) => {
        const selected = isSelected !== undefined ? isSelected : checked
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onValueChange) onValueChange(e.target.checked)
            if (onChange) onChange(e)
        }
        const directCb = (val: boolean) => {
            const fakeEvent = { target: { checked: val } } as React.ChangeEvent<HTMLInputElement>
            if (onValueChange) onValueChange(val)
            if (onChange) onChange(fakeEvent)
        }
        mocks.checkboxCallbacks.set(name, directCb)
        return (
            <label>
                <input
                    data-testid={testId ?? `checkbox-${name}`}
                    type="checkbox"
                    aria-label={ariaLabel ?? name}
                    checked={selected}
                    onChange={handleChange}
                />
                {label ?? children}
            </label>
        )
    }
}))

const acceptCheckbox = (name: string, value = true) => {
    const directCb = mocks.checkboxCallbacks.get(name)
    if (directCb) {
        act(() => {
            directCb(value)
        })
    }
}

describe("FeeCheckbox", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.onChange.mockReset()
        mocks.checkboxCallbacks.clear()
    })

    it("renders the label content", () => {
        render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Test label content</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={false}
            />
        )

        expect(screen.getByText("Test label content")).toBeInTheDocument()
    })

    it("calls onChange with checked value when checkbox is toggled", () => {
        render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept terms</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={false}
            />
        )

        acceptCheckbox("testCheckbox", true)

        expect(mocks.onChange).toHaveBeenCalledTimes(1)
        expect(mocks.onChange).toHaveBeenCalledWith(true)
    })

    it("shows error message when hasError is true", () => {
        render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={true}
            />
        )

        expect(screen.getByText("Debes marcar esta opción para continuar")).toBeInTheDocument()
    })

    it("does not show error message when hasError is false", () => {
        render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={false}
            />
        )

        expect(screen.queryByText("Debes marcar esta opción para continuar")).not.toBeInTheDocument()
    })

    it("shows custom error message when provided", () => {
        render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={true}
                errorMessage="Custom error message"
            />
        )

        expect(screen.getByText("Custom error message")).toBeInTheDocument()
    })

    it("applies error border class when hasError is true", () => {
        const { container } = render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={true}
            />
        )

        const borderedDiv = container.querySelector(".border-error-300")
        expect(borderedDiv).toBeInTheDocument()
    })

    it("applies normal border class when hasError is false", () => {
        const { container } = render(
            <FeeCheckbox
                name="testCheckbox"
                label={<span>Accept</span>}
                checked={false}
                onChange={mocks.onChange}
                hasError={false}
            />
        )

        const borderedDiv = container.querySelector(".border-grayscale-200")
        expect(borderedDiv).toBeInTheDocument()
    })
})
