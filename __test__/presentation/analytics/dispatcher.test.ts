import { beforeEach, describe, expect, it, vi } from "vitest"
import { EventName } from "@/presentation/analytics/types"

const mocks = vi.hoisted(() => ({
    algoliaTrack: vi.fn(),
    gaTrack: vi.fn(),
    gtmTrack: vi.fn(),
    pixelTrack: vi.fn(),
    error: new Error("provider failed"),
}))

vi.mock("@/presentation/analytics/providers/algoliaProvider", () => ({
    default: {
        name: "algolia",
        track: mocks.algoliaTrack,
    },
}))

vi.mock("@/presentation/analytics/providers/gaProvider", () => ({
    default: {
        name: "gaProvider",
        track: mocks.gaTrack,
    },
}))

vi.mock("@/presentation/analytics/providers/gtmProvider/gtmProvider", () => ({
    default: {
        name: "gtm",
        track: mocks.gtmTrack,
    },
}))

vi.mock("@/presentation/analytics/providers/pixelProvider", () => ({
    default: {
        name: "pixelProvider",
        track: mocks.pixelTrack,
    },
}))

describe("trackEvent", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("dispatches the analytics event to all active providers", async () => {
        const { trackEvent } = await import("@/presentation/analytics/dispatcher")

        const eventPayload = {
            products: [],
            identification: "encrypted-identification",
        }

        trackEvent(EventName.VIEWED_PRODUCTS, eventPayload)

        const expectedEvent = {
            name: EventName.VIEWED_PRODUCTS,
            payload: eventPayload,
        }

        expect(mocks.algoliaTrack).toHaveBeenCalledWith(expectedEvent)
        expect(mocks.gaTrack).toHaveBeenCalledWith(expectedEvent)
        expect(mocks.gtmTrack).toHaveBeenCalledWith(expectedEvent)
        expect(mocks.pixelTrack).toHaveBeenCalledWith(expectedEvent)
    })

    it("logs provider errors without throwing and continues calling other providers", async () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
        mocks.algoliaTrack.mockImplementationOnce(() => {
            throw mocks.error
        })

        const { trackEvent } = await import("@/presentation/analytics/dispatcher")

        expect(() =>
            trackEvent(EventName.VIEWED_FILTER, {
                filters: [],
                identification: undefined,
            }),
        ).not.toThrow()

        expect(consoleError).toHaveBeenCalledWith(mocks.error)
        expect(mocks.gaTrack).toHaveBeenCalled()
        expect(mocks.gtmTrack).toHaveBeenCalled()
        expect(mocks.pixelTrack).toHaveBeenCalled()

        consoleError.mockRestore()
    })

    it("catches errors from each provider independently", async () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
        const algoliaError = new Error("algolia failed")
        const gaError = new Error("ga failed")
        const pixelError = new Error("pixel failed")

        mocks.algoliaTrack.mockImplementationOnce(() => { throw algoliaError })
        mocks.gaTrack.mockImplementationOnce(() => { throw gaError })
        mocks.pixelTrack.mockImplementationOnce(() => { throw pixelError })

        const { trackEvent } = await import("@/presentation/analytics/dispatcher")

        expect(() =>
            trackEvent(EventName.VIEWED_HOME, { identification: undefined }),
        ).not.toThrow()

        expect(consoleError).toHaveBeenCalledWith(algoliaError)
        expect(consoleError).toHaveBeenCalledWith(gaError)
        expect(consoleError).toHaveBeenCalledWith(pixelError)
        expect(mocks.gtmTrack).toHaveBeenCalled()

        consoleError.mockRestore()
    })
})
