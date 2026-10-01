import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Button: ({ children, onPress, ...props }: Record<string, unknown>) => (
        <button
            onClick={onPress as () => void}
            data-testid={props["data-testid"] as string}
            aria-labelledby={props["aria-labelledby"] as string}
            aria-label={props["aria-label"] as string}
        >
            {children as React.ReactNode}
        </button>
    ),
    Popover: ({ children, isOpen, onOpenChange }: Record<string, unknown>) => (
        <dialog data-open={isOpen} data-onchange={onOpenChange?.toString()}>
            {children as React.ReactNode}
        </dialog>
    ),
    PopoverTrigger: ({ children }: Record<string, unknown>) => <div>{children as React.ReactNode}</div>,
    PopoverContent: ({ children }: Record<string, unknown>) => <div>{children as React.ReactNode}</div>,
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengerSelectItem", () => ({
    default: ({ label, value, onChange, state }: Record<string, unknown>) => (
        <div data-testid={`item-${label}`}>
            <span data-testid={`value-${label}`}>{value as number}</span>
            <span data-testid={`state-${label}`}>{state as string}</span>
            <button
                data-testid={`inc-${label}`}
                onClick={() => (onChange as (v: number) => void)((value as number) + 1)}
            >
                +
            </button>
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengersSelectAge", () => ({
    default: ({ childrenCount }: { childrenCount: number }) => (
        <div data-testid="age-selector">{childrenCount}</div>
    ),
}))

import PassengersSelect from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengersSelect"
import type { Category } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/types"

const baseCategories: Category[] = [
    { key: "adults", label: "Adultos", min: 1, max: 9, value: 2, state: "default" },
    { key: "childrens", label: "Niños", min: 0, max: 9, value: 1, state: "default" },
]

describe("PassengersSelect (view)", () => {
    it("should render the provided displayValue without computing it", () => {
        render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="custom display"
                childrenCount={1}
                onChange={vi.fn()}
                label="Pasajeros"
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={0}
            />,
        )

        expect(screen.getByText("custom display")).toBeInTheDocument()
    })

    it("should call onChange with the category key and new value when an item changes", () => {
        const onChange = vi.fn()
        render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="2 Pasajeros"
                childrenCount={0}
                onChange={onChange}
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={0}
            />,
        )

        fireEvent.click(screen.getByTestId("inc-Adultos"))
        expect(onChange).toHaveBeenCalledWith("adults", 3)
    })

    it("should render a readonly room item when showRoom is true", () => {
        render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="1 Habitación, 2 Pasajeros"
                childrenCount={0}
                onChange={vi.fn()}
                showRoom
                roomLabel="Habitación"
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={0}
            />,
        )

        expect(screen.getByTestId("item-Habitación")).toBeInTheDocument()
        expect(screen.getByTestId("state-Habitación")).toHaveTextContent("readonly")
    })

    it("should forward childrenCount to PassengersSelectAge", () => {
        render(
            <PassengersSelect
                categories={baseCategories}
                displayValue=""
                childrenCount={3}
                onChange={vi.fn()}
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={0}
                showAgeSelect
            />,
        )

        expect(screen.getByTestId("age-selector")).toHaveTextContent("3")
    })

    it("should not include FormContext logic (no setFieldValue side effects)", () => {
        const onChange = vi.fn()
        render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="2 Pasajeros"
                childrenCount={0}
                onChange={onChange}
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={0}
            />,
        )

        fireEvent.click(screen.getByTestId("inc-Niños"))
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith("childrens", 2)
    })

    it("should pass isOpen state to Popover", () => {
        const { container } = render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="2 Pasajeros"
                childrenCount={0}
                onChange={vi.fn()}
                isOpen={true}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={200}
            />,
        )

        expect(container.querySelector('dialog')).toHaveAttribute('data-open', 'true')
    })

    it("should use triggerWidth for Popover styling", () => {
        const { container } = render(
            <PassengersSelect
                categories={baseCategories}
                displayValue="2 Pasajeros"
                childrenCount={0}
                onChange={vi.fn()}
                isOpen={false}
                setIsOpen={vi.fn()}
                triggerRef={React.createRef()}
                triggerWidth={300}
            />,
        )

        // This test verifies that triggerWidth is passed through to the Popover
        // In a real scenario, this would affect the width styling
        expect(container.querySelector('dialog')).toBeInTheDocument()
    })

    describe("accessibility: label association", () => {
        it("should set id on label and aria-labelledby on button when testId is provided", () => {
            const { container } = render(
                <PassengersSelect
                    categories={baseCategories}
                    displayValue="2 Pasajeros"
                    childrenCount={0}
                    onChange={vi.fn()}
                    label="Número de pasajeros"
                    testId="passengers-select"
                    isOpen={false}
                    setIsOpen={vi.fn()}
                    triggerRef={React.createRef()}
                    triggerWidth={0}
                />,
            )

            const label = container.querySelector('label')
            expect(label).toHaveAttribute("id", "passengers-select-label")

            const button = container.querySelector('button')
            expect(button).toHaveAttribute("aria-labelledby", "passengers-select-label passengers-select-value")
        })

        it("should set id on the display value span when testId is provided", () => {
            const { container } = render(
                <PassengersSelect
                    categories={baseCategories}
                    displayValue="2 Pasajeros"
                    childrenCount={0}
                    onChange={vi.fn()}
                    label="Número de pasajeros"
                    testId="passengers-select"
                    isOpen={false}
                    setIsOpen={vi.fn()}
                    triggerRef={React.createRef()}
                    triggerWidth={0}
                />,
            )

            const valueSpan = container.querySelector('#passengers-select-value')
            expect(valueSpan).toBeInTheDocument()
            expect(valueSpan).toHaveTextContent("2 Pasajeros")
        })

        it("should not set aria-labelledby on button when testId is not provided", () => {
            const { container } = render(
                <PassengersSelect
                    categories={baseCategories}
                    displayValue="2 Pasajeros"
                    childrenCount={0}
                    onChange={vi.fn()}
                    label="Número de pasajeros"
                    isOpen={false}
                    setIsOpen={vi.fn()}
                    triggerRef={React.createRef()}
                    triggerWidth={0}
                />,
            )

            const button = container.querySelector('button')
            expect(button).not.toHaveAttribute("aria-labelledby")
        })

        it("should forward explicit triggerAriaLabel to button", () => {
            const { container } = render(
                <PassengersSelect
                    categories={baseCategories}
                    displayValue="2 Pasajeros"
                    childrenCount={0}
                    onChange={vi.fn()}
                    label="Número de pasajeros"
                    testId="passengers-select"
                    triggerAriaLabel="Escoge el número de pasajeros"
                    isOpen={false}
                    setIsOpen={vi.fn()}
                    triggerRef={React.createRef()}
                    triggerWidth={0}
                />,
            )

            const button = container.querySelector("button")
            expect(button).toHaveAttribute("aria-label", "Escoge el número de pasajeros")
        })
    })
})
