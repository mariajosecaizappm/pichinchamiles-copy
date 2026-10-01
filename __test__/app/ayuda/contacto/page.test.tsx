import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@/presentation/pages/Help/Contact", () => ({
    default: () => <div data-testid="contact-page">Contact page</div>,
}))

import ContactoPage from "@/app/ayuda/contacto/page"

describe("ContactoPage", () => {
    it("should render the Contact component", () => {
        render(<ContactoPage />)
        expect(screen.getByTestId("contact-page")).toBeInTheDocument()
    })
})
