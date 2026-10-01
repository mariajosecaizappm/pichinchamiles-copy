import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Button: ({ children, onPress, isDisabled, className, ...props }: Record<string, unknown>) => (
        <button
            aria-label={props["aria-label"] as string}
            disabled={isDisabled as boolean}
            onClick={onPress as () => void}
            className={className as string}
        >
            {children as React.ReactNode}
        </button>
    ),
}))

import PassengerSelectItem from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/PassengerSelectItem"

describe("PassengerSelectItem", () => {
    it("should render the label text", () => {
        render(
            <PassengerSelectItem key="adults" label="Adultos (más de 12 años)" min={1} max={7} value={2} onChange={vi.fn()} state="default" />,
        )
        expect(screen.getByText("Adultos (más de 12 años)")).toBeInTheDocument()
    })

    it("should render the current value", () => {
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={1} max={7} value={3} onChange={vi.fn()} state="default" />,
        )
        expect(screen.getByText("3")).toBeInTheDocument()
    })

    it("should call onChange with decremented value when decrease button is pressed", () => {
        const onChange = vi.fn()
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={1} max={7} value={3} onChange={onChange} state="default" />,
        )
        fireEvent.click(screen.getByLabelText("Disminuir Adultos"))
        expect(onChange).toHaveBeenCalledWith(2)
    })

    it("should call onChange with incremented value when increase button is pressed", () => {
        const onChange = vi.fn()
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={1} max={7} value={3} onChange={onChange} state="default" />,
        )
        fireEvent.click(screen.getByLabelText("Aumentar Adultos"))
        expect(onChange).toHaveBeenCalledWith(4)
    })

    it("should disable decrease button when value equals min", () => {
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={1} max={7} value={1} onChange={vi.fn()} state="default" />,
        )
        expect(screen.getByLabelText("Disminuir Adultos")).toBeDisabled()
    })

    it("should disable increase button when value equals max", () => {
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={0} max={3} value={3} onChange={vi.fn()} state="default" />,
        )
        expect(screen.getByLabelText("Aumentar Adultos")).toBeDisabled()
    })

    it("should enable both buttons when value is between min and max", () => {
        render(
            <PassengerSelectItem key="adults" label="Adultos" min={0} max={7} value={3} onChange={vi.fn()} state="default" />,
        )
        expect(screen.getByLabelText("Disminuir Adultos")).not.toBeDisabled()
        expect(screen.getByLabelText("Aumentar Adultos")).not.toBeDisabled()
    })

    it("should disable buttons when state is readonly", () => {
        render(
            <PassengerSelectItem key="room" label="Habitación" min={1} max={1} value={1} onChange={vi.fn()} state="readonly" />,
        )
        expect(screen.getByLabelText("Disminuir Habitación")).toBeDisabled()
        expect(screen.getByLabelText("Aumentar Habitación")).toBeDisabled()
    })

    it("should apply opacity-0 to buttons when state is readonly", () => {
        const { container } = render(
            <PassengerSelectItem key="room" label="Habitación" min={1} max={1} value={1} onChange={vi.fn()} state="readonly" />,
        )
        const buttons = container.querySelectorAll('button')
        buttons.forEach(button => {
            expect(button).toHaveClass('opacity-0')
        })
    })
})
