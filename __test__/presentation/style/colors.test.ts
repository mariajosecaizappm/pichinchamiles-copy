import { describe, it, expect } from "vitest"
import colors from "@/presentation/style/colors"

describe("colors tokens", () => {
    it("should export a default color palette object", () => {
        expect(colors).toBeDefined()
        expect(typeof colors).toBe("object")
    })

    it("should contain all expected top-level color families", () => {
        const families = [
            "yellow",
            "blue",
            "yellowGold",
            "darkCyan",
            "pureOrange",
            "purple",
            "darkGrayishBlue",
            "grayscale",
            "success",
            "information",
            "warning",
            "error",
            "neutral",
            "helper",
        ]

        families.forEach((family) => {
            expect(colors).toHaveProperty(family)
            expect(typeof colors[family as keyof typeof colors]).toBe("object")
        })
    })

    it("should expose the correct hex values for brand colors", () => {
        expect(colors.yellow[500]).toBe("#FFDD00")
        expect(colors.blue[500]).toBe("#0F265C")
        expect(colors.yellowGold[500]).toBe("#FFC108")
        expect(colors.darkCyan[500]).toBe("#009688")
        expect(colors.pureOrange[500]).toBe("#FF9800")
        expect(colors.purple[500]).toBe("#A800E3")
    })

    it("should expose the correct grayscale and utility colors", () => {
        expect(colors.grayscale[50]).toBe("#F6F6F6")
        expect(colors.grayscale[500]).toBe("#2C2C30")
        expect(colors.success[500]).toBe("#31A451")
        expect(colors.information[500]).toBe("#2F7ABF")
        expect(colors.warning[500]).toBe("#F76800")
        expect(colors.error[500]).toBe("#D50707")
        expect(colors.neutral[100]).toBe("#F1F3F7")
        expect(colors.helper[500]).toBe("#7E8394")
    })
})
