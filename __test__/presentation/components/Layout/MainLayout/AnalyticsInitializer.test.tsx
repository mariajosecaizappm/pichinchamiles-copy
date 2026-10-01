import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, getAllByTestId } from "@testing-library/react"
import AnalyticsInitializer from "@/presentation/components/Layout/MainLayout/AnalyticsInitializer"

const mocks = vi.hoisted(() => ({
    aa: vi.fn(),
}))

vi.mock("search-insights", () => ({
    default: mocks.aa,
}))

vi.mock("next/script", () => ({
    default: ({
        id,
        src,
        strategy,
        dangerouslySetInnerHTML,
    }: {
        id?: string
        src?: string
        strategy?: string
        dangerouslySetInnerHTML?: { __html: string }
    }) => (
        <script
            id={id}
            data-src={src}
            data-strategy={strategy}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
    ),
}))

vi.mock("@next/third-parties/google", () => ({
    GoogleTagManager: ({ gtmId }: { gtmId: string }) => (
        <div data-testid="google-tag-manager" data-gtm-id={gtmId} />
    ),
    GoogleAnalytics: ({ gaId }: { gaId: string }) => (
        <div data-testid="google-analytics" data-ga-id={gaId} />
    ),
}))

describe("AnalyticsInitializer", () => {
    const originalEnv = process.env

    beforeEach(() => {
        vi.clearAllMocks()
        process.env = { ...originalEnv }
    })

    it("initializes Algolia search-insights with appId and apiKey from env vars", () => {
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app-id"
        process.env.NEXT_PUBLIC_ALGOLIA_API_KEY = "test-api-key"

        render(<AnalyticsInitializer />)

        expect(mocks.aa).toHaveBeenCalledWith("init", {
            appId: "test-app-id",
            apiKey: "test-api-key",
        })
    })

    it("initializes window.dataLayer early so events can be queued before GTM loads", () => {
        process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123"
        window.dataLayer = undefined

        render(<AnalyticsInitializer />)

        expect(window.dataLayer).toBeDefined()
        expect(Array.isArray(window.dataLayer)).toBe(true)
    })

    it("calls Algolia init exactly once on mount", () => {
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app-id"
        process.env.NEXT_PUBLIC_ALGOLIA_API_KEY = "test-api-key"

        const { rerender } = render(<AnalyticsInitializer />)
        rerender(<AnalyticsInitializer />)
        rerender(<AnalyticsInitializer />)

        expect(mocks.aa).toHaveBeenCalledTimes(1)
    })

    it("renders first GoogleTagManager with GTM_ID from env vars", () => {
        process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123"
        process.env.NEXT_PUBLIC_SECONDARY_GTM_ID = "GTM-SECONDARY"

        const { container } = render(<AnalyticsInitializer />)

        const gtms = getAllByTestId(container, "google-tag-manager")
        expect(gtms).toHaveLength(2)
        expect(gtms[0]).toHaveAttribute("data-gtm-id", "GTM-TEST123")
    })

    it("renders second GoogleTagManager with SECONDARY_GTM_ID from env vars", () => {
        process.env.NEXT_PUBLIC_GTM_ID = "GTM-TEST123"
        process.env.NEXT_PUBLIC_SECONDARY_GTM_ID = "GTM-SECONDARY-456"

        const { container } = render(<AnalyticsInitializer />)

        const gtms = getAllByTestId(container, "google-tag-manager")
        expect(gtms).toHaveLength(2)
        expect(gtms[1]).toHaveAttribute("data-gtm-id", "GTM-SECONDARY-456")
    })

    it("renders GoogleAnalytics with GA4_ID from env vars", () => {
        process.env.NEXT_PUBLIC_GA4_ID = "G-TEST456"

        const { getByTestId } = render(<AnalyticsInitializer />)

        const ga = getByTestId("google-analytics")
        expect(ga).toBeInTheDocument()
        expect(ga).toHaveAttribute("data-ga-id", "G-TEST456")
    })

    it("renders both GTMs and GA components together with correct IDs", () => {
        process.env.NEXT_PUBLIC_GTM_ID = "GTM-1"
        process.env.NEXT_PUBLIC_SECONDARY_GTM_ID = "GTM-2"
        process.env.NEXT_PUBLIC_GA4_ID = "G-1"

        const { container, getByTestId } = render(<AnalyticsInitializer />)

        const gtms = getAllByTestId(container, "google-tag-manager")
        expect(gtms).toHaveLength(2)
        expect(gtms[0]).toHaveAttribute("data-gtm-id", "GTM-1")
        expect(gtms[1]).toHaveAttribute("data-gtm-id", "GTM-2")
        expect(getByTestId("google-analytics")).toBeInTheDocument()
    })

    it("does not render GoogleTagManager when GTM IDs are undefined", () => {
        delete process.env.NEXT_PUBLIC_GTM_ID
        delete process.env.NEXT_PUBLIC_SECONDARY_GTM_ID

        const { queryAllByTestId } = render(<AnalyticsInitializer />)

        const gtms = queryAllByTestId("google-tag-manager")
        expect(gtms).toHaveLength(0)
    })

    it("does not render GoogleAnalytics when GA4 ID is undefined", () => {
        delete process.env.NEXT_PUBLIC_GA4_ID

        const { queryByTestId } = render(<AnalyticsInitializer />)

        expect(queryByTestId("google-analytics")).not.toBeInTheDocument()
    })

    it("passes Algolia env vars correctly even when GTM and GA vars are missing", () => {
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "algolia-app"
        process.env.NEXT_PUBLIC_ALGOLIA_API_KEY = "algolia-key"
        delete process.env.NEXT_PUBLIC_GTM_ID
        delete process.env.NEXT_PUBLIC_SECONDARY_GTM_ID
        delete process.env.NEXT_PUBLIC_GA4_ID

        render(<AnalyticsInitializer />)

        expect(mocks.aa).toHaveBeenCalledWith("init", {
            appId: "algolia-app",
            apiKey: "algolia-key",
        })
    })

    it("renders Facebook Pixel script and noscript with NEXT_PUBLIC_FACEBOOK_PIXEL_ID", () => {
        process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = "PIXEL-987654"

        const { container } = render(<AnalyticsInitializer />)

        const script = container.querySelector("#facebook-pixel")
        expect(script).toBeInTheDocument()
        expect(script).toHaveAttribute("data-strategy", "afterInteractive")
        expect(script?.innerHTML).toContain("fbq('init', 'PIXEL-987654')")
        expect(script?.innerHTML).toContain("fbq('track', 'PageView')")

        const noscript = container.querySelector("noscript")
        expect(noscript).toBeInTheDocument()
    })
})
