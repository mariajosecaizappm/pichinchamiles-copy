import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"

const mockDispatch = vi.fn()
const mockOpenAuthModal = vi.fn(() => ({type: "authModal/openAuthModal"}))

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: unknown) => unknown) => {
        // Return a mock state that satisfies the useSession hook
        const mockState = {
            user: {
                information: null,
                isLogged: false,
                balance: 0,
                isValidatingSession: false,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: '',
            }
        }
        return selector(mockState)
    },
}))

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
    useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/presentation/redux/features/authModalSlice", () => ({
    openAuthModal: () => mockOpenAuthModal(),
}))

import LoginButton from "@/presentation/pages/Home/components/Button/LoginButton"

describe("LoginButton", () => {
    beforeEach(() => {
        mockDispatch.mockClear()
        mockOpenAuthModal.mockClear()
    })

    it("should render with text Ingresar", () => {
        render(<LoginButton />)
        expect(screen.getByText("Ingresar")).toBeInTheDocument()
    })

    it("should dispatch openAuthModal when pressed", () => {
        render(<LoginButton />)
        fireEvent.click(screen.getByTestId("buttonIngresar"))
        expect(mockOpenAuthModal).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledWith({type: "authModal/openAuthModal"})
    })


    it("should forward additional props", () => {
        render(<LoginButton isDisabled />)
        const button = screen.getByTestId("buttonIngresar")
        expect(button).toBeDisabled()
    })

    it("should have proper accessibility aria-label", () => {
        render(<LoginButton />)
        const button = screen.getByTestId("buttonIngresar")
        expect(button).toHaveAttribute("aria-label", "Ingresar, iniciar sesión en Pichincha Miles")
    })

    it("should be accessible by screen readers", () => {
        render(<LoginButton />)
        const button = screen.getByRole("button", { name: "Ingresar, iniciar sesión en Pichincha Miles" })
        expect(button).toBeInTheDocument()
    })
})
