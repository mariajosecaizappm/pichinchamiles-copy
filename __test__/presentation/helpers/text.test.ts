import { describe, it, expect } from "vitest"
import { truncateText } from "@/presentation/helpers/text"

describe("text helper", () => {
    describe("truncateText", () => {
        it("returns original text when within max length", () => {
            expect(truncateText("Short title", 35)).toBe("Short title")
        })

        it("truncates text and appends ellipsis when exceeding max length", () => {
            const text = "A".repeat(36)

            expect(truncateText(text, 35)).toBe(`${"A".repeat(35)}...`)
        })

        it("returns original text when length equals max length", () => {
            const text = "A".repeat(35)

            expect(truncateText(text, 35)).toBe(text)
        })
    })
})
