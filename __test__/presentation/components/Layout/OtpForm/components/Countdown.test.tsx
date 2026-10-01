import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import Countdown from "@/presentation/components/Layout/OtpForm/components/Countdown/Countdown"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    let lastCountdownProps: any = null

    const zeroPad = vi.fn((value: number) => String(value).padStart(2, "0"))

    return {
        zeroPad,
        getCountdownProps: () => lastCountdownProps,
        setCountdownProps: (props: any) => (lastCountdownProps = props),
        reset: () => {
            lastCountdownProps = null
        },
    }
})

vi.mock("react-countdown", async () => {
    const React = await import("react")

    return {
        default: (props: any) => {
            mocks.setCountdownProps(props)
            return (
                <div data-testid="mock-react-countdown">
                    <div data-testid="renderer-output">
                        {props.renderer({minutes: 1, seconds: 2})}
                    </div>
                    <button
                        type="button"
                        data-testid="complete"
                        onClick={() => props.onComplete?.()}
                    >
                        complete
                    </button>
                </div>
            )
        },
        zeroPad: mocks.zeroPad,
    }
})

describe("Countdown", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.reset()
    })

    describe("when rendered", () => {
        it("should render zero padded minutes and seconds", () => {
            render(
                <ScreenReaderProvider>
                    <Countdown date={new Date("2030-01-01T00:00:00.000Z")} />
                </ScreenReaderProvider>,
            )

            expect(screen.getByTestId("renderer-output")).toHaveTextContent(
                "01:02",
            )

            expect(mocks.zeroPad).toHaveBeenCalledWith(1)
            expect(mocks.zeroPad).toHaveBeenCalledWith(2)
        })

        it("should pass the expected props to react-countdown", () => {
            const date = new Date("2030-01-01T00:00:00.000Z")
            render(
                <ScreenReaderProvider>
                    <Countdown date={date} />
                </ScreenReaderProvider>,
            )

            const props = mocks.getCountdownProps()
            expect(props).toBeTruthy()
            expect(props.zeroPadTime).toBe(2)
            expect(props.date).toBe(date)
            expect(props.onComplete).toBeUndefined()
            expect(typeof props.renderer).toBe("function")
        })
    })

    describe("when countdown completes and onComplete is provided", () => {
        it("should call onComplete", () => {
            const onComplete = vi.fn()
            render(
                <ScreenReaderProvider>
                    <Countdown
                        date={new Date("2030-01-01T00:00:00.000Z")}
                        onComplete={onComplete}
                    />
                </ScreenReaderProvider>,
            )

            fireEvent.click(screen.getByTestId("complete"))

            expect(onComplete).toHaveBeenCalledTimes(1)
        })
    })
})

