import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, renderHook } from "@testing-library/react"
import { MountTracker } from "@/presentation/analytics/MountTracker"
import { EventName } from "@/presentation/analytics/types"

const mocks = vi.hoisted(() => ({
    track: vi.fn(),
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({
        track: mocks.track,
    }),
}))

describe("MountTracker", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders nothing (returns null)", () => {
        const { container } = render(
            <MountTracker name={EventName.VIEWED_HOME} />,
        )

        expect(container.firstChild).toBeNull()
    })

    it("calls track with the event name and no payload on mount for undefined-payload events", () => {
        render(
            <MountTracker name={EventName.VIEWED_HOME} />,
        )

        expect(mocks.track).toHaveBeenCalledTimes(1)
        expect(mocks.track).toHaveBeenCalledWith(EventName.VIEWED_HOME, undefined)
    })

    it("calls track with the event name and payload for events that require payload", () => {
        render(
            <MountTracker
                name={EventName.VIEWED_PRODUCT}
                payload={{ category: "Tecnologia" }}
            />,
        )

        expect(mocks.track).toHaveBeenCalledTimes(1)
        expect(mocks.track).toHaveBeenCalledWith(
            EventName.VIEWED_PRODUCT,
            { category: "Tecnologia" },
        )
    })

    it("only tracks once even if the component re-renders with same props", () => {
        const { rerender } = render(
            <MountTracker name={EventName.VIEWED_HOME} />,
        )

        rerender(<MountTracker name={EventName.VIEWED_HOME} />)
        rerender(<MountTracker name={EventName.VIEWED_HOME} />)

        expect(mocks.track).toHaveBeenCalledTimes(1)
    })

    it("only tracks once even if the props change after first render", () => {
        const { rerender } = render(
            <MountTracker name={EventName.VIEWED_CHECKOUT_PRODUCTS} />,
        )

        rerender(
            <MountTracker name={EventName.VIEWED_CHECKOUT_SHIPPING} />,
        )

        expect(mocks.track).toHaveBeenCalledTimes(1)
        expect(mocks.track).toHaveBeenCalledWith(
            EventName.VIEWED_CHECKOUT_PRODUCTS,
            undefined,
        )
    })

    it("tracks different event types correctly", () => {
        const testCases: Array<{ name: EventName; payload?: any }> = [
            { name: EventName.VIEWED_IDENTIFICATION_FORM },
            { name: EventName.VIEWED_PASSWORD_FORM },
            {
                name: EventName.VIEWED_REDEEM_STATUS,
                payload: { reference: "ORD-123" },
            },
            {
                name: EventName.LOGIN,
                payload: { status: "success" as const },
            },
        ]

        testCases.forEach(testCase => {
            vi.clearAllMocks()
            const mocksInternal = vi.hoisted ? {} : {}
            render(
                testCase.payload !== undefined
                    ? <MountTracker name={testCase.name} payload={testCase.payload} />
                    : <MountTracker name={testCase.name as any} />,
            )
            expect(mocks.track).toHaveBeenCalledTimes(1)
        })
    })
})
