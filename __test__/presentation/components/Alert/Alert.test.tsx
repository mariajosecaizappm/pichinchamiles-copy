import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const iconCalls: any[] = []
    const iconInfoCalls: any[] = []
    return {iconCalls, iconInfoCalls}
})

vi.mock("@heroui/theme", () => ({
    cn: (...values: any[]) => values.filter(Boolean).join(" "),
}))

vi.mock("@iconify/react", async () => {
    const React = await import("react")
    return {
        Icon: (props: any) => {
            mocks.iconCalls.push(props)
            return (
                <div
                    data-testid="mock-icon"
                    data-icon={props.icon}
                    data-classname={props.className}
                />
            )
        },
    }
})

vi.mock("@/presentation/components/icons/Icon", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.iconInfoCalls.push(props)
            return (
                <div
                    data-testid={`mock-icon-${props.name}`}
                    data-classname={props.className}
                />
            )
        },
    }
})

import Alert from "@/presentation/components/Alert/Alert"

describe("Alert", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.iconCalls.length = 0
        mocks.iconInfoCalls.length = 0
    })

    describe("when variant is warning and icon prop is not provided", () => {
        it("should render warning styles and Icon", () => {
            render(<Alert variant="warning">Contenido</Alert>)

            expect(screen.getByText("Contenido")).toBeInTheDocument()
            expect(screen.getByTestId("mock-icon-icon-info")).toBeInTheDocument()
            expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument()

            const container = screen.getByText("Contenido").closest("div")!
                .parentElement as HTMLElement
            expect(container.className).toContain("bg-warning-50")
            expect(container.className).toContain("border-pureOrange-200")
        })
    })

    describe("when variant is info and icon prop is not provided", () => {
        it("should render default icon and info styles", () => {
            render(<Alert variant="info">Contenido</Alert>)

            expect(screen.getByText("Contenido")).toBeInTheDocument()
            expect(screen.queryByTestId("mock-icon-icon-info")).not.toBeInTheDocument()

            const icon = screen.getByTestId("mock-icon")
            expect(icon).toHaveAttribute("data-icon", "ic:round-info")

            const container = screen.getByText("Contenido").closest("div")!
                .parentElement as HTMLElement
            expect(container.className).toContain("bg-information-50")
            expect(container.className).toContain("border-information-300")
        })
    })

    describe("when icon prop is provided", () => {
        it("should render Icon component with provided icon", () => {
            render(
                <Alert icon="custom:icon" variant="warning">
                    Contenido
                </Alert>,
            )

            expect(screen.queryByTestId("mock-icon-icon-info")).not.toBeInTheDocument()
            const icon = screen.getByTestId("mock-icon")
            expect(icon).toHaveAttribute("data-icon", "custom:icon")
        })
    })
})

