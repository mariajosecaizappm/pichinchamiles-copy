import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {Member} from "@/domain/entity/Member/member"

vi.mock("@/presentation/pages/Help/Contact/Header/ContactHeader", () => ({
    default: () => <div data-testid="contact-header">Header</div>,
}))

vi.mock("@/presentation/pages/Help/Contact/Form", () => ({
    default: () => <div data-testid="contact-form">Form</div>,
}))

vi.mock("@/presentation/pages/Help/Contact/Form/ContactFormWrapper", () => ({
    default: ({children}: {children: (member: Member) => React.ReactNode}) => <div data-testid="form-wrapper">{children({id: "member-1"} as unknown as Member)}</div>,
}))

import Contact from "@/presentation/pages/Help/Contact/Contact"

describe("Contact", () => {
    it("should render the header, form wrapper and form", () => {
        render(<Contact />)
        expect(screen.getByTestId("contact-header")).toBeInTheDocument()
        expect(screen.getByTestId("form-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("contact-form")).toBeInTheDocument()
    })
})
