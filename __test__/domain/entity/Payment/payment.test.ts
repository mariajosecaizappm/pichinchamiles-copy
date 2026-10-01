import {describe, it, expect} from "vitest"
import {PaymentMethod, PaymentStatus} from "@/domain/entity/Payment/payment"

describe("PaymentMethod enum", () => {
    it("should have POINTS value", () => {
        expect(PaymentMethod.POINTS).toBe("points")
    })

    it("should have COPAYMENT value", () => {
        expect(PaymentMethod.COPAYMENT).toBe("copayment")
    })
})

describe("PaymentStatus enum", () => {
    it("should have SUCCESS value", () => {
        expect(PaymentStatus.SUCCESS).toBe("APPROVED")
    })

    it("should have PENDING value", () => {
        expect(PaymentStatus.PENDING).toBe("PENDING")
    })

    it("should have REJECTED value", () => {
        expect(PaymentStatus.REJECTED).toBe("REJECTED")
    })
})
