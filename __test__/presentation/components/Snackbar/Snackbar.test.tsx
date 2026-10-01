import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import Snackbar from "@/presentation/components/Snackbar/Snackbar"

vi.mock("@heroui/react", () => ({
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
    Divider: () => <hr data-testid="divider" />,
}))

vi.mock("@/presentation/components/icons/Icon", () => ({
    Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}))

const MockIcon = () => <svg data-testid="mock-icon" />

describe("Snackbar", () => {
    it("should render with required props", () => {
        const onClose = vi.fn()
        render(
            <Snackbar
                icon={MockIcon}
                content={<p>Content text</p>}
                onClose={onClose}
            />
        )
        expect(screen.getByTestId("mock-icon")).toBeInTheDocument()
        expect(screen.getByText("Content text")).toBeInTheDocument()
    })

    it("should render title when provided", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                title="Snackbar Title"
                onClose={vi.fn()}
            />
        )
        expect(screen.getByText("Snackbar Title")).toBeInTheDocument()
    })

    it("should not render title element when title is not provided", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
            />
        )
        const titleEl = document.getElementById("snackbar-title")
        expect(titleEl?.textContent).toBe("")
    })

    it("should call onClose when close button is clicked", () => {
        const onClose = vi.fn()
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={onClose}
            />
        )
        fireEvent.click(screen.getByTestId("closeModal"))
        expect(onClose).toHaveBeenCalledOnce()
    })

    it("should render footer when provided", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
                footer={<div data-testid="footer-content">Footer</div>}
            />
        )
        expect(screen.getByTestId("footer-content")).toBeInTheDocument()
    })

    it("should not render footer section when footer is not provided", () => {
        const { container } = render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
            />
        )
        expect(container.querySelectorAll("[data-testid='divider']")).toHaveLength(1)
    })

    it("should have role alertdialog", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
            />
        )
        expect(screen.getByRole("alertdialog")).toBeInTheDocument()
    })

    it("should apply custom className", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
                className="my-custom-class"
            />
        )
        expect(screen.getByRole("alertdialog").className).toContain("my-custom-class")
    })

    it("should render content as React node", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content={<div data-testid="custom-content">Custom Node</div>}
                onClose={vi.fn()}
            />
        )
        expect(screen.getByTestId("custom-content")).toBeInTheDocument()
    })

    it("close button has correct aria-label", () => {
        render(
            <Snackbar
                icon={MockIcon}
                content="Content"
                onClose={vi.fn()}
            />
        )
        expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
    })
})
