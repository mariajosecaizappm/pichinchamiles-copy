import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import SecurityPage from "@/app/mi-perfil/seguridad/page"

vi.mock("@/presentation/pages/Profile/Security", () => ({
    default: () => <div data-testid="security-form">Security Form Component</div>,
}))

describe("SecurityPage", () => {
    it("should render SecurityForm component", () => {
        render(<SecurityPage />)
        
        expect(screen.getByTestId("security-form")).toBeInTheDocument()
    })

    it("should render with correct structure", () => {
        const { container } = render(<SecurityPage />)
        
        expect(container).toBeInTheDocument()
        expect(screen.getByText("Security Form Component")).toBeInTheDocument()
    })
})
