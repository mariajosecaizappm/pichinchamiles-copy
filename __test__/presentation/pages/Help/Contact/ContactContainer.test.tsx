import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

const mockPush = vi.fn()
const mocks = vi.hoisted(() => ({
    useSession: vi.fn((): Record<string, unknown> => ({
        isLogged: true,
        member: {id: "member-1"},
        isValidatingSession: false,
    })),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({push: mockPush}),
}))

vi.mock("@/presentation/pages/Help/Contact/Contact", () => ({
    default: () => <div data-testid="contact-content">Contact content</div>,
}))

import ContactContainer from "@/presentation/pages/Help/Contact/ContactContainer"

describe("ContactContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render loading state while validating session", () => {
        mocks.useSession.mockReturnValue({
            isLogged: false,
            member: null,
            isValidatingSession: true,
        })

        const {container} = render(<ContactContainer />)
        expect(container.firstChild).toBeNull()
        expect(screen.queryByTestId("contact-content")).not.toBeInTheDocument()
    })

    it("should redirect to home when user is not logged", () => {
        mocks.useSession.mockReturnValue({
            isLogged: false,
            member: {id: "member-1"},
            isValidatingSession: false,
        })

        const {container} = render(<ContactContainer />)
        expect(mockPush).toHaveBeenCalledWith("/")
        expect(container.firstChild).toBeNull()
    })

    it("should redirect to home when member is missing", () => {
        mocks.useSession.mockReturnValue({
            isLogged: true,
            member: null,
            isValidatingSession: false,
        })

        const {container} = render(<ContactContainer />)
        expect(mockPush).toHaveBeenCalledWith("/")
        expect(container.firstChild).toBeNull()
    })

    it("should render Contact when session is valid", () => {
        mocks.useSession.mockReturnValue({
            isLogged: true,
            member: {id: "member-1"},
            isValidatingSession: false,
        })

        render(<ContactContainer />)
        expect(screen.getByTestId("contact-content")).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
    })
})
