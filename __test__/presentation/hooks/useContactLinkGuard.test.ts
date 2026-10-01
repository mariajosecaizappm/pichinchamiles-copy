import {renderHook, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import useContactLinkGuard from "@/presentation/hooks/useContactLinkGuard"

const mockDispatch = vi.fn()
const mockPush = vi.fn()

const mocks = vi.hoisted(() => ({
    useSession: vi.fn((): Record<string, unknown> => ({
        isLogged: true,
        isValidatingSession: false,
    })),
}))

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({push: mockPush}),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        contact: "/ayuda/contacto",
        home: "/",
    },
}))

describe("useContactLinkGuard", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should do nothing for non-contact links when logged in", () => {
        mocks.useSession.mockReturnValue({isLogged: true, isValidatingSession: false})
        const {result} = renderHook(() => useContactLinkGuard())

        const event = {preventDefault: vi.fn()} as unknown as React.MouseEvent<HTMLAnchorElement>

        act(() => {
            result.current(event, "/other")
        })

        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(mockDispatch).not.toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
    })

    it("should allow navigation when user is logged in and clicks contact link", () => {
        mocks.useSession.mockReturnValue({isLogged: true, isValidatingSession: false})
        const {result} = renderHook(() => useContactLinkGuard())

        const event = {preventDefault: vi.fn()} as unknown as React.MouseEvent<HTMLAnchorElement>

        act(() => {
            result.current(event, "/ayuda/contacto")
        })

        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(mockDispatch).not.toHaveBeenCalled()
    })

    it("should open auth modal with contact navigation callback when not logged", () => {
        mocks.useSession.mockReturnValue({isLogged: false, isValidatingSession: false})
        const {result} = renderHook(() => useContactLinkGuard())

        const event = {preventDefault: vi.fn()} as unknown as React.MouseEvent<HTMLAnchorElement>

        act(() => {
            result.current(event, "/ayuda/contacto")
        })

        expect(event.preventDefault).toHaveBeenCalled()
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "authModal/openAuthModal",
                payload: expect.any(Function),
            }),
        )

        const dispatchedAction = mockDispatch.mock.calls[0][0]
        dispatchedAction.payload()
        expect(mockPush).toHaveBeenCalledWith("/ayuda/contacto")
    })

    it("should open auth modal without callback while validating session", () => {
        mocks.useSession.mockReturnValue({isLogged: false, isValidatingSession: true})
        const {result} = renderHook(() => useContactLinkGuard())

        const event = {preventDefault: vi.fn()} as unknown as React.MouseEvent<HTMLAnchorElement>

        act(() => {
            result.current(event, "/ayuda/contacto")
        })

        expect(event.preventDefault).toHaveBeenCalled()
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "authModal/openAuthModal",
                payload: undefined,
            }),
        )
    })
})
