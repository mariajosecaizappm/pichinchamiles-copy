import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => ({
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@heroui/react", () => ({
    extendVariants: () => {
        const MockButton = ({ children, href, ...rest }: Record<string, unknown>) =>
            href ? (
                <a href={href as string} {...rest}>{children as React.ReactNode}</a>
            ) : (
                <button {...rest}>{children as React.ReactNode}</button>
            )
        return MockButton
    },
    Button: ({ children, href, ...rest }: Record<string, unknown>) =>
        href ? (
            <a href={href as string} {...rest}>{children as React.ReactNode}</a>
        ) : (
            <button {...rest}>{children as React.ReactNode}</button>
        ),
}))

vi.mock("@/presentation/assets/404.svg", () => ({ default: "/404.svg" }))

import NotFound, { metadata } from "@/app/not-found"
import links from "@/presentation/config/links"

describe("NotFound", () => {
    it("should export metadata with the 404 page title", () => {
        expect(metadata.title).toBe("No existe esta página")
    })

    it("should render the 404 illustration image", () => {
        render(<NotFound />)

        const img = screen.getByRole("img", { name: /ilustración página no encontrada/i })
        expect(img).toBeInTheDocument()
    })

    it("should render the page title", () => {
        render(<NotFound />)

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            "Esta página no existe",
        )
    })

    it("should render the descriptive subtitle", () => {
        render(<NotFound />)

        expect(
            screen.getByText(/es posible que el enlace no exista o se haya eliminado la página/i),
        ).toBeInTheDocument()
    })

    it("should render the CTA button with the correct label", () => {
        render(<NotFound />)

        expect(screen.getByRole("link", { name: /ir al inicio/i })).toBeInTheDocument()
    })

    it("should point the CTA button to the products link", () => {
        render(<NotFound />)

        expect(screen.getByRole("link", { name: /ir al inicio/i })).toHaveAttribute(
            "href",
            links.products,
        )
    })
})
