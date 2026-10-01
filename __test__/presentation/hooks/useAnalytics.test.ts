import {renderHook, act, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import { EventName } from "@/presentation/analytics/types"

const mocks = vi.hoisted(() => {
    const dispatch = vi.fn()
    let state: any = {
        user: {
            information: null as null | { identificationNumber: string },
        },
    }
    const encryptText = vi.fn()
    const trackEvent = vi.fn()

    return {
        dispatch,
        getState: () => state,
        setState: (next: any) => {
            state = next
        },
        encryptText,
        trackEvent,
    }
})

vi.unmock("@/presentation/hooks/useAnalytics")

vi.mock("react-redux", () => ({
    useDispatch: () => mocks.dispatch,
    useSelector: (selector: any) => selector(mocks.getState()),
}))

vi.mock("@/presentation/hooks/useEncryption", () => ({
    __esModule: true,
    default: () => ({
        encryptText: mocks.encryptText,
    }),
}))

vi.mock("@/presentation/analytics/dispatcher", () => ({
    __esModule: true,
    trackEvent: mocks.trackEvent,
}))

describe("useAnalytics", () => {
    beforeEach(() => {
        mocks.dispatch.mockReset()
        mocks.encryptText.mockReset()
        mocks.trackEvent.mockReset()
        mocks.setState({
            user: {
                information: null,
            },
        })
    })

    it("tracks events without identification when there is no member", async () => {
        const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
        const { result } = renderHook(() => useAnalytics())

        await act(async () => {
            await result.current.track(EventName.VIEWED_PRODUCTS, { products: [] })
        })

        expect(mocks.encryptText).not.toHaveBeenCalled()
        expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.VIEWED_PRODUCTS, {
            products: [],
            identification: undefined,
        })
    })

    it("encrypts the identification number before dispatching analytics", async () => {
        mocks.setState({
            user: {
                information: { identificationNumber: "1717171717" },
            },
        })
        mocks.encryptText.mockResolvedValue("encrypted-identification")

        const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
        const { result } = renderHook(() => useAnalytics())

        await act(async () => {
            await result.current.track(EventName.CLICKED_FILTERS, {
                type: "brand",
                filter: { id: "brand-1", name: "Marca 1", slug: "marca-1" },
            })
        })

        expect(mocks.encryptText).toHaveBeenCalledWith("1717171717")
        expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "brand",
            filter: { id: "brand-1", name: "Marca 1", slug: "marca-1" },
            identification: "encrypted-identification",
        })
    })

    it("tracks events without payload when only global context is needed", async () => {
        const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
        const { result } = renderHook(() => useAnalytics())

        await act(async () => {
            await result.current.track(EventName.VIEWED_HOME)
        })

        expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.VIEWED_HOME, {
            identification: undefined,
        })
    })

    it("adds identification to events that have payload and member exists", async () => {
        mocks.setState({
            user: {
                information: { identificationNumber: "999888777" },
            },
        })
        mocks.encryptText.mockResolvedValue("enc-id-123")

        const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
        const { result } = renderHook(() => useAnalytics())

        await act(async () => {
            await result.current.track(EventName.VIEWED_PRODUCT, { category: "Tecnologia" })
        })

        expect(mocks.encryptText).toHaveBeenCalledWith("999888777")
        expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.VIEWED_PRODUCT, {
            category: "Tecnologia",
            identification: "enc-id-123",
        })
    })

    it("adds identification=undefined to payload events when no member", async () => {
        const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
        const { result } = renderHook(() => useAnalytics())

        await act(async () => {
            await result.current.track(EventName.LOGIN, { status: "success" })
        })

        expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.LOGIN, {
            status: "success",
            identification: undefined,
        })
    })

    describe("session cookie management", () => {
        it("updates browser session cookie when member identification differs from current session cookie", async () => {
            const sessionCookieModule = await import("@/domain/entity/Session/sessionCookie")
            const getSessionSpy = vi.spyOn(sessionCookieModule, "getSessionCookieFromBrowser").mockReturnValue("different-session-id")
            const setSessionSpy = vi.spyOn(sessionCookieModule, "setSessionCookieInBrowser").mockImplementation(() => {})

            mocks.setState({
                user: {
                    information: { identificationNumber: "1717171717" },
                },
            })
            mocks.encryptText.mockResolvedValue("encrypted-identification-17")

            const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
            const { result } = renderHook(() => useAnalytics())

            await act(async () => {
                await result.current.track(EventName.VIEWED_HOME)
            })

            expect(getSessionSpy).toHaveBeenCalled()
            expect(setSessionSpy).toHaveBeenCalledWith("encrypted-identification-17")
        })

        it("does not update browser session cookie when member identification matches current session cookie", async () => {
            const sessionCookieModule = await import("@/domain/entity/Session/sessionCookie")
            const getSessionSpy = vi.spyOn(sessionCookieModule, "getSessionCookieFromBrowser").mockReturnValue("encrypted-identification-17")
            const setSessionSpy = vi.spyOn(sessionCookieModule, "setSessionCookieInBrowser").mockImplementation(() => {})

            mocks.setState({
                user: {
                    information: { identificationNumber: "1717171717" },
                },
            })
            mocks.encryptText.mockResolvedValue("encrypted-identification-17")

            const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
            const { result } = renderHook(() => useAnalytics())

            await act(async () => {
                await result.current.track(EventName.VIEWED_HOME)
            })

            expect(getSessionSpy).toHaveBeenCalled()
            expect(setSessionSpy).not.toHaveBeenCalled()
        })

        it("ignores cookie errors without breaking event tracking", async () => {
            const sessionCookieModule = await import("@/domain/entity/Session/sessionCookie")
            vi.spyOn(sessionCookieModule, "getSessionCookieFromBrowser").mockImplementation(() => {
                throw new Error("Cookie access blocked in sandbox")
            })

            mocks.setState({
                user: {
                    information: { identificationNumber: "1717171717" },
                },
            })
            mocks.encryptText.mockResolvedValue("encrypted-id")

            const { default: useAnalytics } = await import("@/presentation/hooks/useAnalytics")
            const { result } = renderHook(() => useAnalytics())

            await act(async () => {
                await result.current.track(EventName.VIEWED_HOME)
            })

            expect(mocks.trackEvent).toHaveBeenCalledWith(EventName.VIEWED_HOME, {
                identification: "encrypted-id",
            })
        })
    })
})
