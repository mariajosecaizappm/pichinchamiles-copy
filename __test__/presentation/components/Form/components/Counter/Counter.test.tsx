import {describe, it, expect, vi} from "vitest"
import {render, screen, fireEvent} from "@testing-library/react"
import Counter from "@/presentation/components/Form/components/Counter/Counter"

vi.mock("@/presentation/components/Form/components/Counter/CounterTrigger", () => ({
    default: ({
        children,
        onPress,
        isDisabled,
        isReadonly: _isReadonly,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
        isDisabled?: boolean
        isReadonly?: boolean
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button disabled={isDisabled} onClick={onPress} {...props}>
            {children}
        </button>
    ),
}))

describe("Counter", () => {
    it("should render count value", () => {
        render(<Counter count={5} min={0} max={10} onChange={vi.fn()} />)
        expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("should call onChange when increment clicked", () => {
        const onChange = vi.fn()
        render(<Counter count={5} min={0} max={10} onChange={onChange} />)

        const buttons = screen.getAllByRole("button")
        fireEvent.click(buttons[1]) // Increment

        expect(onChange).toHaveBeenCalledWith(6)
    })

    it("should call onChange when decrement clicked", () => {
        const onChange = vi.fn()
        render(<Counter count={5} min={0} max={10} onChange={onChange} />)

        const buttons = screen.getAllByRole("button")
        fireEvent.click(buttons[0]) // Decrement

        expect(onChange).toHaveBeenCalledWith(4)
    })

    it("should disable decrement when at min", () => {
        render(<Counter count={0} min={0} max={10} onChange={vi.fn()} />)
        const buttons = screen.getAllByRole("button")
        expect(buttons[0]).toBeDisabled()
    })

    it("should disable increment when at max", () => {
        render(<Counter count={10} min={0} max={10} onChange={vi.fn()} />)
        const buttons = screen.getAllByRole("button")
        expect(buttons[1]).toBeDisabled()
    })

    it("should render label when provided", () => {
        render(<Counter count={1} min={0} max={10} onChange={vi.fn()} label="Quantity" />)
        expect(screen.getByLabelText(/Disminuir Quantity/)).toBeInTheDocument()
    })

    it("should render formatted count when formatValue provided", () => {
        render(
            <Counter
                count={18.3}
                min={0}
                max={100}
                onChange={vi.fn()}
                formatValue={(value) => value.toFixed(2)}
            />
        )
        expect(screen.getByText("18.30")).toBeInTheDocument()
    })
})
