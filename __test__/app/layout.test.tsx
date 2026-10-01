import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest"
import "@testing-library/jest-dom"

vi.mock("../../src/app/globals.css", () => ({}))

vi.mock("next/font/google", () => ({
    Inter: () => ({ variable: "--font-inter" }),
}))

vi.mock("next/font/local", () => ({
    default: () => ({ variable: "--font-local" }),
}))

vi.mock("next/script", () => ({
    default: ({
        id,
        src,
        strategy,
        "data-cbid": dataCbid,
    }: {
        id?: string
        src?: string
        strategy?: string
        "data-cbid"?: string
    }) => (
        <div
            id={id}
            data-src={src}
            data-strategy={strategy}
            data-cbid={dataCbid}
        />
    ),
}))

vi.mock("@/presentation/components/providers/Providers", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="providers">{children}</div>
    ),
}))

vi.mock("@/presentation/components/Layout/MainLayout", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="main-layout">{children}</div>
    ),
}))

vi.mock("@/presentation/components/ScrollToTopOnRouteChange", () => ({
    default: () => <div data-testid="scroll-to-top" />,
}))

// Silence React's warning about rendering <html>/<body> inside jsdom's existing document
const originalError = console.error
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        const msg = String(args[0] ?? "")
        if (
            msg.includes("<html>") ||
            msg.includes("<body>") ||
            msg.includes("cannot appear as a child") ||
            msg.includes("cannot contain a nested")
        ) {
            return
        }
        originalError(...(args as []))
    }
})
afterAll(() => {
    console.error = originalError
})

import RootLayout, { metadata, viewport } from "@/app/layout"

describe("RootLayout (src/app/layout.tsx)", () => {
    describe("metadata export", () => {
        it("should export a metadata object with title and description", () => {
            expect(metadata).toBeDefined()
            expect(metadata.title).toEqual({
                default: "Pichincha Miles",
                template: "%s | Pichincha Miles",
            })
            expect(metadata.description).toBe(
                "Es el programa de recompensas de Banco Pichincha que te permite acumular millas con tus tarjetas Visa y MasterCards"
            )
        })
    })

    describe("viewport export", () => {
        it("should export a viewport configuration", () => {
            expect(viewport).toBeDefined()
        })

        it("should set width to device-width", () => {
            expect(viewport.width).toBe("device-width")
        })

        it("should set initialScale to 1", () => {
            expect(viewport.initialScale).toBe(1)
        })

    })

    describe("rendering", () => {
        it("should render children inside Providers and MainLayout", () => {
            render(
                <RootLayout>
                    <div data-testid="page-children">Page</div>
                </RootLayout>
            )

            expect(screen.getByTestId("providers")).toBeInTheDocument()
            expect(screen.getByTestId("scroll-to-top")).toBeInTheDocument()
            expect(screen.getByTestId("main-layout")).toBeInTheDocument()
            expect(screen.getByTestId("page-children")).toBeInTheDocument()
        })

        it("should render without throwing when given children", () => {
            expect(() =>
                render(
                    <RootLayout>
                        <div>child</div>
                    </RootLayout>
                )
            ).not.toThrow()
        })

        it("should render Cookiebot script when NEXT_PUBLIC_COOKIEBOT_ID is set", () => {
            vi.stubEnv("NEXT_PUBLIC_COOKIEBOT_ID", "test-cookiebot-id")

            const { container } = render(
                <RootLayout>
                    <div>child</div>
                </RootLayout>
            )

            const cookiebotScript = container.querySelector("#Cookiebot")
            expect(cookiebotScript).toBeInTheDocument()
            expect(cookiebotScript).toHaveAttribute("data-src", "https://consent.cookiebot.com/uc.js")
            expect(cookiebotScript).toHaveAttribute("data-cbid", "test-cookiebot-id")
            expect(cookiebotScript).toHaveAttribute("data-strategy", "afterInteractive")
        })

        it("should not render Cookiebot script when NEXT_PUBLIC_COOKIEBOT_ID is not set", () => {
            vi.stubEnv("NEXT_PUBLIC_COOKIEBOT_ID", "")

            const { container } = render(
                <RootLayout>
                    <div>child</div>
                </RootLayout>
            )

            expect(container.querySelector("#Cookiebot")).not.toBeInTheDocument()
        })
    })
})
