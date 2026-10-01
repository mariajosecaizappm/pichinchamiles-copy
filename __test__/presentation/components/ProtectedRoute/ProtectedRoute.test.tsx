import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ProtectedRoute from "@/presentation/components/ProtectedRoute/ProtectedRoute"

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    useSession: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mocks.replace }),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.useSession.mockReturnValue({
            member: { identificationNumber: "123" },
            isValidatingSession: false,
        })
    })

    it("renders fallback while session is validating", () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: true,
        })

        render(
            <ProtectedRoute fallback={<div data-testid="loading" />}>
                <div data-testid="protected-content" />
            </ProtectedRoute>
        )

        expect(screen.getByTestId("loading")).toBeInTheDocument()
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
    })

    it("redirects unauthenticated users to home", async () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: false,
        })

        render(
            <ProtectedRoute fallback={<div data-testid="loading" />}>
                <div data-testid="protected-content" />
            </ProtectedRoute>
        )

        await waitFor(() => {
            expect(mocks.replace).toHaveBeenCalledWith("/")
        })
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument()
    })

    it("renders children for authenticated users", () => {
        render(
            <ProtectedRoute fallback={<div data-testid="loading" />}>
                <div data-testid="protected-content" />
            </ProtectedRoute>
        )

        expect(screen.getByTestId("protected-content")).toBeInTheDocument()
    })
})
