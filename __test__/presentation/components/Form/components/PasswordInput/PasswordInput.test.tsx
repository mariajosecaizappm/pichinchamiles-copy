import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import PasswordInputContainer from "@/presentation/components/Form/components/PasswordInput/PasswordInputContainer"

const mocks = vi.hoisted(() => {
    const receivedProps: Record<string, unknown>[] = []
    return {receivedProps}
})

vi.mock("@heroui/react", async () => {
    const React = await import("react")

    return {
        Input: (props: Record<string, unknown>) => {
            mocks.receivedProps.push(props)
            const hasOnChange = typeof props.onChange === "function"
            return (
                <div
                    data-testid="heroui-input"
                    data-props={JSON.stringify({
                        type: props.type,
                        isInvalid: props.isInvalid,
                        maxLength: props.maxLength,
                        value: props.value,
                        hasOnChange,
                    })}
                    data-onchange-callback={hasOnChange ? "true" : "false"}
                >
                    <div data-testid="end-content-slot">{props.endContent as React.ReactNode}</div>
                </div>
            )
        },
    }
})

const screenReaderMocks = vi.hoisted(() => {
    const announce = vi.fn()
    return { announce }
})

vi.mock("@/presentation/components/providers/ScreenReaderProvider", () => ({
    ScreenReaderContext: { current: null },
    useScreenReader: () => ({ announce: screenReaderMocks.announce })
}))

describe("PasswordInputContainer", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
        screenReaderMocks.announce.mockClear()
    })

    describe("when rendered", () => {
        it("should render as password input by default and allow toggling visibility", () => {
            render(
                <PasswordInputContainer
                    name="password"
                    label="Contraseña"
                    testId="password-input"
                    value="Abc123!@"
                />,
            )

            const node = screen.getByTestId("heroui-input")
            expect(node).toBeInTheDocument()

            const initialProps = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as Record<string, unknown>
            expect(initialProps.type).toBe("password")

            const toggle = screen.getByRole("button", {
                name: "Mostrar contraseña. Muestra los caracteres ingresados.",
            })
            expect(toggle).toHaveTextContent("Mostrar")

            fireEvent.click(toggle)

            const lastCall = mocks.receivedProps[mocks.receivedProps.length - 1]
            expect(lastCall.type).toBe("text")
            expect(toggle).toHaveTextContent("Ocultar")
        })
    })

    describe("when maxLength is provided and value has content", () => {
        it("should show the length indicator", () => {
            render(
                <PasswordInputContainer
                    name="password"
                    label="Contraseña"
                    value="abc"
                    maxLength={16}
                />,
            )

            expect(screen.getByText("3/16")).toBeInTheDocument()
        })
    })

    describe("when default label is provided", () => {
        it("should render label with default styling", () => {
            render(
                <PasswordInputContainer
                    name="password"
                    label="Contraseña"
                    value="abc"
                    maxLength={16}
                />,
            )

            const lastCall = mocks.receivedProps[mocks.receivedProps.length - 1]
            expect((lastCall.classNames as Record<string, unknown>).label).toContain("text-sm font-semibold leading-4")
        })
    })

    describe("when user types characters", () => {
        it("should announce 'carácter oculto' for each character added", () => {
            const onChange = vi.fn()
            render(
                <PasswordInputContainer
                    name="password"
                    label="Contraseña"
                    value=""
                    onChange={onChange}
                />
            )

            // Obtener el onChange directamente de los props guardados en el mock
            const lastProps = mocks.receivedProps[mocks.receivedProps.length - 1]
            const inputOnChange = lastProps.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void

            // Verificar que onChange es una función
            expect(typeof inputOnChange).toBe("function")

            // Simulate typing 3 characters
            inputOnChange({ target: { name: "password", value: "a" } } as React.ChangeEvent<HTMLInputElement>)
            inputOnChange({ target: { name: "password", value: "ab" } } as React.ChangeEvent<HTMLInputElement>)
            inputOnChange({ target: { name: "password", value: "abc" } } as React.ChangeEvent<HTMLInputElement>)

            expect(screenReaderMocks.announce).toHaveBeenCalledTimes(3)
            expect(screenReaderMocks.announce).toHaveBeenCalledWith("carácter oculto")
            expect(onChange).toHaveBeenCalledTimes(3)
        })

        it("should not announce when characters are removed", () => {
            const onChange = vi.fn()
            
            // Render con valor inicial "abc" para establecer el previousLengthRef
            render(
                <PasswordInputContainer
                    name="password"
                    label="Contraseña"
                    value="abc"
                    onChange={onChange}
                />
            )

            // Obtener el onChange del primer render
            const firstProps = mocks.receivedProps[mocks.receivedProps.length - 1]
            const inputOnChange = firstProps.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void

            // Verificar que onChange es una función
            expect(typeof inputOnChange).toBe("function")

            // Primero simular que ya se escribió "abc" para establecer el previousLengthRef
            inputOnChange({ target: { name: "password", value: "abc" } } as React.ChangeEvent<HTMLInputElement>)

            // Limpiar mocks antes de las acciones de prueba
            screenReaderMocks.announce.mockClear()
            onChange.mockClear()

            // Simulate removing 2 characters (de abc a ab, luego de ab a a)
            inputOnChange({ target: { name: "password", value: "ab" } } as React.ChangeEvent<HTMLInputElement>)
            inputOnChange({ target: { name: "password", value: "a" } } as React.ChangeEvent<HTMLInputElement>)

            expect(screenReaderMocks.announce).not.toHaveBeenCalled()
            expect(onChange).toHaveBeenCalledTimes(2)
        })
    })
})

