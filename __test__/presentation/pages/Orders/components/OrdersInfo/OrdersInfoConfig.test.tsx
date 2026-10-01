import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ordersInfo } from "@/presentation/pages/Orders/components/OrdersInfo/OrdersInfoConfig";

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe("OrdersInfoConfig", () => {
    it("exports an array of info items", () => {
        expect(Array.isArray(ordersInfo)).toBe(true);
        expect(ordersInfo.length).toBeGreaterThan(0);
    });

    it("each item has required fields", () => {
        ordersInfo.forEach((item) => {
            expect(item.id).toBeDefined();
            expect(item.icon).toBeDefined();
            expect(item.text).toBeDefined();
        });
    });

    it("contains max-days info", () => {
        const item = ordersInfo.find((i) => i.id === "max-days");
        expect(item).toBeDefined();
    });

    it("contains report-duration info", () => {
        const item = ordersInfo.find((i) => i.id === "report-duration");
        expect(item).toBeDefined();
    });

    it("contains warranty info", () => {
        const item = ordersInfo.find((i) => i.id === "warranty");
        expect(item).toBeDefined();
    });

    it("contains more-information info", () => {
        const item = ordersInfo.find((i) => i.id === "more-information");
        expect(item).toBeDefined();
    });

    it("renders more-information text with link", () => {
        const item = ordersInfo.find((i) => i.id === "more-information");
        const { container } = render(item!.text as React.ReactElement);
        const link = container.querySelector("a");
        expect(link).toBeInTheDocument();
    });
});
