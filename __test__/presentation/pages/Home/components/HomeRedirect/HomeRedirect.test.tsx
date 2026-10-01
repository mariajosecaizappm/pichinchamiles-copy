import {render, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

const mockOnOpenAuthModal = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockIsLogged = false

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: mockIsLogged,
        onOpenAuthModal: mockOnOpenAuthModal,
    }),
}))

import HomeRedirect from "@/presentation/pages/Home/components/HomeRedirect/HomeRedirect"

describe("HomeRedirect", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
        mockIsLogged = false
    })

    it("should not call onOpenAuthModal when flow param is not present and user is not logged", async () => {
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).not.toHaveBeenCalled()
        })
    })

    it("should not call onOpenAuthModal when flow param is not present and user is logged", async () => {
        mockIsLogged = true
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).not.toHaveBeenCalled()
        })
    })

    it("should not call onOpenAuthModal when flow param is different from login and user is not logged", async () => {
        mockSearchParams = new URLSearchParams("flow=register")
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).not.toHaveBeenCalled()
        })
    })

    it("should not call onOpenAuthModal when flow param is different from login and user is logged", async () => {
        mockIsLogged = true
        mockSearchParams = new URLSearchParams("flow=register")
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).not.toHaveBeenCalled()
        })
    })

    it("should call onOpenAuthModal when flow param is login and user is not logged", async () => {
        mockSearchParams = new URLSearchParams("flow=login")
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).toHaveBeenCalledTimes(1)
        })
    })

    it("should not call onOpenAuthModal when flow param is login and user is already logged", async () => {
        mockIsLogged = true
        mockSearchParams = new URLSearchParams("flow=login")
        render(<HomeRedirect />)
        await waitFor(() => {
            expect(mockOnOpenAuthModal).not.toHaveBeenCalled()
        })
    })

    it("should render nothing (return null)", () => {
        const {container} = render(<HomeRedirect />)
        expect(container.firstChild).toBeNull()
    })
})
