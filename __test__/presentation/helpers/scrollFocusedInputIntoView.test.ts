import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
    handleScrollFocusedInputIntoView,
    isFocusableInput,
    scrollFocusedInputIntoView,
} from "@/presentation/helpers/scrollFocusedInputIntoView"

vi.mock("@/presentation/helpers/device", () => ({
    isMobileDevice: vi.fn(() => true),
}))

describe("scrollFocusedInputIntoView", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it("should identify focusable inputs", () => {
        const input = document.createElement("input")
        const button = document.createElement("button")

        expect(isFocusableInput(input)).toBe(true)
        expect(isFocusableInput(button)).toBe(false)
    })

    it("should scroll the focused input into view on mobile", () => {
        const scrollIntoView = vi.fn()
        const input = document.createElement("input")
        input.scrollIntoView = scrollIntoView

        scrollFocusedInputIntoView(input)

        expect(scrollIntoView).not.toHaveBeenCalled()

        vi.runAllTimers()

        expect(scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center",
        })
    })

    it("should scroll when a focus event targets an input", () => {
        const scrollIntoView = vi.fn()
        const input = document.createElement("input")
        input.scrollIntoView = scrollIntoView

        handleScrollFocusedInputIntoView({
            target: input,
        } as React.FocusEvent<HTMLElement>)

        vi.runAllTimers()

        expect(scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center",
        })
    })

    it("should ignore focus events on non-input elements", () => {
        const scrollIntoView = vi.fn()
        const button = document.createElement("button")
        button.scrollIntoView = scrollIntoView

        handleScrollFocusedInputIntoView({
            target: button,
        } as React.FocusEvent<HTMLElement>)

        vi.runAllTimers()

        expect(scrollIntoView).not.toHaveBeenCalled()
    })
})
