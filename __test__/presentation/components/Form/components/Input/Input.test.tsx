import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import Input from "@/presentation/components/Form/components/Input/Input"

const mocks = vi.hoisted(() => {
    const receivedProps: any[] = []
    return {receivedProps}
})

vi.mock("@heroui/react", async () => {
    const React = await import("react")

    return {
        Input: (props: any) => {
            mocks.receivedProps.push(props)
            return (
                <div
                    data-testid="heroui-input"
                    data-props={JSON.stringify({
                        variant: props.variant,
                        isInvalid: props.isInvalid,
                        classNames: props.classNames,
                        className: props.className,
                        size: props.size,
                        labelPlacement: props.labelPlacement,
                        description: props.description,
                        name: props.name,
                        value: props.value,
                    })}
                >
                    {props.description ? (
                        <div data-testid="description-slot">
                            {props.description}
                        </div>
                    ) : null}
                </div>
            )
        },
    }
})

describe("BaseInput", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.receivedProps.length = 0
    })

    describe("when variant, size and labelPlacement are not provided", () => {
        it("should apply default values and map helpText to description", () => {
            render(
                <Input
                    name="firstName"
                    label="Nombre"
                    helpText={<span>Ayuda</span>}
                />,
            )

            const node = screen.getByTestId("heroui-input")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.variant).toBe("bordered")
            expect(props.size).toBe("lg")
            expect(props.labelPlacement).toBe("outside")
            expect(screen.getByTestId("description-slot")).toHaveTextContent(
                "Ayuda",
            )
        })
    })

    describe("when isInvalid is true", () => {
        it("should apply error styles to input and wrapper", () => {
            render(
                <Input
                    name="firstName"
                    label="Nombre"
                    isInvalid
                />,
            )

            const node = screen.getByTestId("heroui-input")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.isInvalid).toBe(true)
            expect(props.classNames.input).toContain("!text-error-500")
            expect(props.classNames.inputWrapper).toContain("!border-error-500")
        })
    })

    describe("when isInvalid is false", () => {
        it("should apply default styles to input and wrapper", () => {
            render(
                <Input
                    name="firstName"
                    label="Nombre"
                    isInvalid={false}
                />,
            )

            const node = screen.getByTestId("heroui-input")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.isInvalid).toBe(false)
            expect(props.classNames.input).toContain("text-grayscale-500")
            expect(props.classNames.inputWrapper).toContain(
                "data-[focus=true]:!border-grayscale-500",
            )
        })
    })

    describe("when classNames are provided", () => {
        it("should allow overriding default classNames", () => {
            render(
                <Input
                    name="firstName"
                    label="Nombre"
                    classNames={{label: "custom-label"}}
                />,
            )

            const node = screen.getByTestId("heroui-input")
            const props = JSON.parse(
                node.getAttribute("data-props") ?? "{}",
            ) as any

            expect(props.classNames.label).toBe("text-sm font-semibold leading-4 !mb-2 !text-grayscale-500 group-data-[disabled=true]:!text-grayscale-500 group-data-[disabled=true]:!opacity-100 custom-label")
            expect(props.classNames.inputWrapper).toContain("bg-white")
        })
    })
})

