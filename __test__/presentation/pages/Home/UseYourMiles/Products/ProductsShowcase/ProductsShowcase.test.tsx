import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import Button from "@/presentation/components/Form/components/Button/Button"

const mocks = vi.hoisted(() => {
    const receivedProps: any[] = []
    return {receivedProps}
})

vi.mock("@heroui/theme", () => ({
    cn: (...values: any[]) => values.filter(Boolean).join(" "),
}))

vi.mock("@heroui/react", async () => {
    const React = await import("react")
    return {
        Button: (props: any) => {
            mocks.receivedProps.push(props)
            return (
                <button
                    data-testid="heroui-button"
                    data-props={JSON.stringify({
                        className: props.className,
                        color: props.color,
                        type: props.type,
                        isDisabled: props.isDisabled,
                        isLoading: props.isLoading,
                    })}
                    type={props.type}
                    disabled={props.isDisabled}
                >
                    {props.children}
                </button>
            )
        },
    }
})

describe("BaseButton", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
    })

    describe("when color is primary", () => {
        it("should apply primary styles and forward color", () => {
            render(
                <Button color="primary">
                    Continuar
                </Button>,
            )

            const node = screen.getByTestId("heroui-button")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.color).toBe("primary")
            expect(props.className).toContain(
                "w-full h-12 rounded-sm text-sm leading-6 font-semibold",
            )
            expect(props.className).toContain("bg-yellow-500")
            expect(props.className).toContain("text-blue-500")
        })
    })

    describe("when a custom className is provided", () => {
        it("should merge it into the final className", () => {
            render(
                <Button color="primary" className="custom-class">
                    Continuar
                </Button>,
            )

            const node = screen.getByTestId("heroui-button")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.className).toContain("custom-class")
        })
    })
})

