import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockCloseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        closeSession: mockCloseSession,
    }),
}))


vi.mock("@heroui/react", () => ({
    Button: ({ children, onPress, isLoading, className }: { 
        children: React.ReactNode
        onPress: () => void
        isLoading: boolean
        className: string
    }) => (
        <button 
            onClick={onPress} 
            data-loading={isLoading}
            className={className}
        >
            {children}
        </button>
    ),
}))

import CloseSessionButton from "@/presentation/pages/Home/components/Header/components/Menu/components/CloseSessionButton"

describe("CloseSessionButton", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the button with correct text", () => {
        render(<CloseSessionButton />)
        expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument()
    })

    it("should render the logout icon when not loading", () => {
        const { container } = render(<CloseSessionButton />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should call closeSession when button is clicked", async () => {
        mockCloseSession.mockResolvedValue(undefined)
        
        render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        
        fireEvent.click(button)
        
        await waitFor(() => {
            expect(mockCloseSession).toHaveBeenCalledTimes(1)
        })
    })

    it("should call closeSession when clicked", async () => {
        mockCloseSession.mockResolvedValue(undefined)
        
        render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        
        fireEvent.click(button)
        
        await waitFor(() => {
            expect(mockCloseSession).toHaveBeenCalledTimes(1)
        })
    })

    it("should show loading state while closing session", async () => {
        let resolveCloseSession: () => void
        const closeSessionPromise = new Promise<void>((resolve) => {
            resolveCloseSession = resolve
        })
        mockCloseSession.mockReturnValue(closeSessionPromise)
        
        render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        
        fireEvent.click(button)
        
        await waitFor(() => {
            expect(button).toHaveAttribute("data-loading", "true")
        })
        
        resolveCloseSession!()
    })

    it("should hide icon when loading", async () => {
        let resolveCloseSession: () => void
        const closeSessionPromise = new Promise<void>((resolve) => {
            resolveCloseSession = resolve
        })
        mockCloseSession.mockReturnValue(closeSessionPromise)
        
        const { container } = render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        
        fireEvent.click(button)
        
        await waitFor(() => {
            const svg = container.querySelector("svg")
            expect(svg).not.toBeInTheDocument()
        })
        
        resolveCloseSession!()
    })

    it("should have correct className", () => {
        render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        expect(button).toHaveClass("justify-start")
        expect(button).toHaveClass("gap-3")
        expect(button).toHaveClass("bg-transparent")
        expect(button).toHaveClass("text-blue-500")
        expect(button).toHaveClass("w-full")
    })

    it("should handle closeSession errors gracefully", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
        mockCloseSession.mockRejectedValue(new Error("Logout failed"))
        
        render(<CloseSessionButton />)
        const button = screen.getByText("Cerrar Sesión")
        
        fireEvent.click(button)
        
        await waitFor(() => {
            expect(button).toHaveAttribute("data-loading", "false")
        })
        
        consoleErrorSpy.mockRestore()
    })
})
