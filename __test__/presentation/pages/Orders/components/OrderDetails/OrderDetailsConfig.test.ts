import { describe, it, expect } from "vitest";
import {
    ORDERS_BREAKPOINT,
    getShippingKey,
    formatOrderDate,
    formatOrderDateLong,
    formatLocationName,
    baseTrackingSteps,
    noveltyStep,
} from "@/presentation/pages/Orders/components/OrderDetails/OrderDetailsConfig";
import { ShippingStatus } from "@/domain/entity/Order/order";

describe("OrderDetailsConfig", () => {
    describe("ORDERS_BREAKPOINT", () => {
        it("is set to 1000", () => {
            expect(ORDERS_BREAKPOINT).toBe(1000);
        });
    });

    describe("getShippingKey", () => {
        it("generates a key from the first order line and index", () => {
            const shipping = {
                guidNumber: "GUID-1",
                isOwnDelivery: true,
                shippingStatus: ShippingStatus.ASSIGNED,
                orderLines: [
                    {
                        image: { desktopUrl: "", mobileUrl: "" },
                        productName: "Product A",
                        quantity: 1,
                        totalCoins: 0,
                        totalPoints: 100,
                    },
                ],
                tracking: [],
            };

            const key = getShippingKey(shipping, 2);
            expect(key).toContain("Product A");
            expect(key).toContain("2");
        });
    });

    describe("formatOrderDate", () => {
        it("formats date as DD/MM/YYYY", () => {
            const date = new Date(2024, 0, 15);
            expect(formatOrderDate(date)).toBe("15/01/2024");
        });

        it("returns undefined when date is null or undefined", () => {
            expect(formatOrderDate(null)).toBeUndefined();
            expect(formatOrderDate(undefined)).toBeUndefined();
        });
    });

    describe("formatOrderDateLong", () => {
        it("formats date with long month name", () => {
            const date = new Date(2024, 0, 15);
            expect(formatOrderDateLong(date)).toBe("15 de enero de 2024");
        });

        it("returns undefined when date is null or undefined", () => {
            expect(formatOrderDateLong(null)).toBeUndefined();
            expect(formatOrderDateLong(undefined)).toBeUndefined();
        });
    });

    describe("formatLocationName", () => {
        it("capitalizes each word", () => {
            expect(formatLocationName("quito")).toBe("Quito");
            expect(formatLocationName("new york")).toBe("New York");
        });

        it("returns empty string when value is undefined", () => {
            expect(formatLocationName(undefined)).toBe("");
        });

        it("handles empty strings", () => {
            expect(formatLocationName("")).toBe("");
        });
    });

    describe("baseTrackingSteps", () => {
        it("contains the expected tracking statuses", () => {
            const statuses = baseTrackingSteps.map((step) => step.status);
            expect(statuses).toEqual([
                ShippingStatus.ASSIGNED,
                ShippingStatus.WAIT_TO_SEND,
                ShippingStatus.ARRIVED_AT_THE_LOCAL,
                ShippingStatus.DELIVERED,
            ]);
        });
    });

    describe("noveltyStep", () => {
        it("defines novelty tracking step", () => {
            expect(noveltyStep.status).toBe(ShippingStatus.NOVELTY);
            expect(noveltyStep.label).toBe("Con novedad");
        });
    });
});
