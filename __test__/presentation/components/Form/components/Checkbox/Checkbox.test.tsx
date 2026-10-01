import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import Checkbox from "@/presentation/components/Form/components/Checkbox/Checkbox"

const mocks = vi.hoisted(() => {
    const receivedProps: any[] = []
    return {receivedProps}
})

vi.mock("@heroui/theme", () => ({
    cn: (...values: any[]) => values.filter(Boolean).join(" "),
}))

vi.mock("@heroui/react", async () => {
    return {
        Checkbox: (props: any) => {
            mocks.receivedProps.push(props)
            return (
                <label>
                    <input
                        data-testid={props["data-testid"] ?? "heroui-checkbox"}
                        aria-label={props["aria-label"] || props.name}
                    />
                    {props.children}
                </label>
            )
        },
    }
})

describe("BaseCheckbox", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
    })

    describe("when rendered with label", () => {
        it("should render the label as a sibling, NOT as children of the underlying Checkbox", () => {
            render(
                <Checkbox
                    name="accept"
                    testId="acceptTerms"
                    label={<span>He leído y acepto <a href="/terms">términos</a></span>}
                />,
            )

            expect(screen.getByTestId("acceptTerms")).toBeInTheDocument()
            expect(screen.getByText("términos")).toBeInTheDocument()

            const lastProps = mocks.receivedProps[mocks.receivedProps.length - 1]
            expect(lastProps.children).toBeUndefined()
        })

        it("should NOT invoke onValueChange when clicking on the label (label is passive)", () => {
            const onValueChange = vi.fn()
            render(
                <Checkbox
                    name="accept"
                    testId="acceptTerms"
                    isSelected={false}
                    onValueChange={onValueChange}
                    label={<span>He leído y acepto</span>}
                />,
            )

            fireEvent.click(screen.getByText("He leído y acepto"))
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it("should NOT invoke onValueChange when clicking on a link inside the label", () => {
            const onValueChange = vi.fn()
            render(
                <Checkbox
                    name="accept"
                    testId="acceptTerms"
                    isSelected={false}
                    onValueChange={onValueChange}
                    label={<span>He leído y acepto los <a href="/terms">términos</a></span>}
                />,
            )

            fireEvent.click(screen.getByText("términos"))
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it("should forward onValueChange to the underlying HeroUI Checkbox", () => {
            const onValueChange = vi.fn()
            render(
                <Checkbox
                    name="accept"
                    testId="acceptTerms"
                    isSelected={false}
                    onValueChange={onValueChange}
                    label={<span>He leído y acepto</span>}
                />,
            )

            const lastProps = mocks.receivedProps[mocks.receivedProps.length - 1]
            expect(lastProps.onValueChange).toBe(onValueChange)
        })
    })

    describe("when className is provided", () => {
        it("should merge it into the wrapper", () => {
            const {container} = render(
                <Checkbox
                    name="accept"
                    className="custom-class"
                    isSelected={false}
                />,
            )

            expect(container.firstChild).toHaveClass("custom-class")
        })
    })

    describe("when ariaLabel prop is provided", () => {
        it("should use ariaLabel instead of name for aria-label", () => {
            render(
                <Checkbox
                    name="accept"
                    aria-label="Acepto los términos y condiciones"
                    isSelected={false}
                />,
            )

            const checkbox = screen.getByTestId("heroui-checkbox")
            expect(checkbox).toHaveAttribute("aria-label", "Acepto los términos y condiciones Casilla no seleccionada.")
        })
    })

    describe("when no aria-label is provided but label is a string", () => {
        it("should use the label string as base for aria-label", () => {
            render(
                <Checkbox
                    name="advanced"
                    label="Opciones avanzadas"
                    isSelected={false}
                />,
            )

            const checkbox = screen.getByTestId("heroui-checkbox")
            expect(checkbox).toHaveAttribute("aria-label", "Opciones avanzadas Casilla no seleccionada.")
        })

        it("should reflect selected state in aria-label when label is a string", () => {
            render(
                <Checkbox
                    name="advanced"
                    label="Opciones avanzadas"
                    isSelected={true}
                />,
            )

            const checkbox = screen.getByTestId("heroui-checkbox")
            expect(checkbox).toHaveAttribute("aria-label", "Opciones avanzadas Casilla seleccionada.")
        })

        it("should prefer explicit aria-label over label string", () => {
            render(
                <Checkbox
                    name="advanced"
                    label="Opciones avanzadas"
                    aria-label="Mostrar opciones avanzadas"
                    isSelected={false}
                />,
            )

            const checkbox = screen.getByTestId("heroui-checkbox")
            expect(checkbox).toHaveAttribute("aria-label", "Mostrar opciones avanzadas Casilla no seleccionada.")
        })
    })

    describe("when label is a ReactNode (not a string)", () => {
        it("should not use label node as aria-label base", () => {
            render(
                <Checkbox
                    name="accept"
                    label={<span>He leído los <a href="/terms">términos</a></span>}
                    isSelected={false}
                />,
            )

            const checkbox = screen.getByTestId("heroui-checkbox")
            expect(checkbox).toHaveAttribute("aria-label", "Casilla no seleccionada.")
        })
    })
})

