import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const onCloseAuthModal = vi.fn()
    return {onCloseAuthModal}
})

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        onCloseAuthModal: mocks.onCloseAuthModal,
    }),
}))

vi.mock("@/presentation/components/Form/components/Button", async () => {
    const React = await import("react")
    return {
        Button: (props: any) => (
            <button
                type={props.type}
                data-testid={props.testId ?? "mock-button"}
                onClick={() => props.onPress?.()}
            >
                {props.children}
            </button>
        ),
    }
})

vi.mock("@/presentation/components/icons/Icon", async () => {
    const React = await import("react")
    return {
        default: (props: any) => (
            <div data-testid="mock-icon" data-name={props.name} aria-hidden={props['aria-hidden']} />
        ),
    }
})

import ResetPasswordAlert from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordAlert/ResetPasswordAlert"

describe("ResetPasswordAlert", () => {
    beforeEach(() => {
        mocks.onCloseAuthModal.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should show success content and accept button", () => {
            render(<ResetPasswordAlert />)

            expect(screen.getByTestId("mock-icon")).toHaveAttribute(
                "data-name",
                "icon-success",
            )
            expect(
                screen.getByRole("heading", {name: "Actualizacion exitosa"}),
            ).toBeInTheDocument()
            expect(
                screen.getByText("Tu nueva contraseña se a guardado correctamente."),
            ).toBeInTheDocument()
            expect(
                screen.getByRole("button", {name: "Entendido"}),
            ).toBeInTheDocument()
            expect(screen.getByTestId("acceptButton")).toBeInTheDocument()

            const container = screen.getByText("Actualizacion exitosa").closest("div")
            expect(container).toHaveAttribute("aria-labelledby", "reset-password-alert-title")
            expect(container).toHaveAttribute("aria-describedby", "reset-password-alert-description")

            const icon = screen.getByTestId("mock-icon")
            expect(icon).toHaveAttribute("aria-hidden", "true")
        })
    })

    describe("when accept button is clicked", () => {
        it("should close auth modal", () => {
            render(<ResetPasswordAlert />)

            fireEvent.click(screen.getByTestId("acceptButton"))

            expect(mocks.onCloseAuthModal).toHaveBeenCalledTimes(1)
        })
    })
})

