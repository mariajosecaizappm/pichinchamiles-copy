import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShippingDetail, ShippingStatus, ShippingTracking } from "@/domain/entity/Order/order";
import OrderTrackingContainer from "@/presentation/pages/Orders/components/OrderDetails/OrderTracking/OrderTrackingContainer";

const capturedProps: { getStepsToRender?: () => { step: { status: ShippingStatus; label: string }; trackingEntry: ShippingTracking | undefined }[] }[] = [];

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderTracking/OrderTracking", () => ({
    default: (props: { getStepsToRender: () => { step: { status: ShippingStatus; label: string }; trackingEntry: ShippingTracking | undefined }[] }) => {
        capturedProps.push(props);
        return <div data-testid="order-tracking" />;
    },
}));

describe("OrderTrackingContainer", () => {
    const createTracking = (status: ShippingStatus, date: Date): ShippingTracking => ({
        status,
        trackingDate: date,
    });

    const createShipping = (tracking: ShippingTracking[], status: ShippingStatus = ShippingStatus.ASSIGNED): ShippingDetail => ({
        guidNumber: "GUID-001",
        isOwnDelivery: true,
        shippingStatus: status,
        orderLines: [],
        tracking,
    });

    beforeEach(() => {
        capturedProps.length = 0;
    });

    it("renders without crashing", () => {
        render(<OrderTrackingContainer selectedShipping={createShipping([])} />);
        expect(screen.getByTestId("order-tracking")).toBeInTheDocument();
    });

    it("returns all 4 base steps as upcoming when tracking has no dated entries", () => {
        render(<OrderTrackingContainer selectedShipping={createShipping([])} />);

        const steps = capturedProps[0].getStepsToRender!();
        expect(steps).toHaveLength(4);
        expect(steps.every(({ trackingEntry }) => !trackingEntry)).toBe(true);
    });

    it("hides undated steps that precede the last dated step (gap), keeps undated steps after it (upcoming)", () => {
        const tracking = [
            { status: ShippingStatus.ASSIGNED } as ShippingTracking,
            createTracking(ShippingStatus.WAIT_TO_SEND, new Date("2024-01-11")),
            createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const statuses = steps.map(({ step }) => step.status);
        expect(statuses).not.toContain(ShippingStatus.ASSIGNED);
        expect(statuses).not.toContain(ShippingStatus.ARRIVED_AT_THE_LOCAL);
        expect(statuses).toContain(ShippingStatus.WAIT_TO_SEND);
        expect(statuses).toContain(ShippingStatus.DELIVERED);
    });

    it("shows all steps when only the first step has a date (remaining are upcoming)", () => {
        const tracking = [
            createTracking(ShippingStatus.ASSIGNED, new Date("2024-01-10")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking)} />);

        const steps = capturedProps[0].getStepsToRender!();
        expect(steps).toHaveLength(4);
        const assignedStep = steps.find(({ step }) => step.status === ShippingStatus.ASSIGNED);
        expect(assignedStep?.trackingEntry?.trackingDate).toBeDefined();
        const deliveredStep = steps.find(({ step }) => step.status === ShippingStatus.DELIVERED);
        expect(deliveredStep?.trackingEntry).toBeUndefined();
    });

    it("maintains fixed order (ASSIGNED → WAIT_TO_SEND → ARRIVED_AT_THE_LOCAL → DELIVERED) regardless of input order", () => {
        const tracking = [
            createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15")),
            createTracking(ShippingStatus.ASSIGNED, new Date("2024-01-10")),
            createTracking(ShippingStatus.ARRIVED_AT_THE_LOCAL, new Date("2024-01-12")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const statuses = steps.map(({ step }) => step.status);

        expect(statuses).toEqual([
            ShippingStatus.ASSIGNED,
            ShippingStatus.ARRIVED_AT_THE_LOCAL,
            ShippingStatus.DELIVERED,
        ]);
    });

    it("shows only DELIVERED when only DELIVERED has a date", () => {
        const tracking = [createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15"))];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking)} />);

        const steps = capturedProps[0].getStepsToRender!();
        expect(steps).toHaveLength(1);
        expect(steps[0].step.status).toBe(ShippingStatus.DELIVERED);
    });

    it("shows WAIT_TO_SEND and DELIVERED when only those two have dates", () => {
        const tracking = [
            createTracking(ShippingStatus.WAIT_TO_SEND, new Date("2024-01-11")),
            createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const statuses = steps.map(({ step }) => step.status);
        expect(statuses).toEqual([ShippingStatus.WAIT_TO_SEND, ShippingStatus.DELIVERED]);
    });

    it("adds novelty step when a novelty tracking entry with date exists", () => {
        const tracking = [createTracking(ShippingStatus.NOVELTY, new Date("2024-01-12"))];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking, ShippingStatus.NOVELTY)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const noveltyStep = steps.find(({ step }) => step.status === ShippingStatus.NOVELTY);

        expect(noveltyStep).toBeDefined();
        expect(noveltyStep?.trackingEntry).toBeDefined();
    });

    it("truncates steps after the novelty entry when shipping status is NOVELTY", () => {
        const tracking = [
            createTracking(ShippingStatus.ASSIGNED, new Date("2024-01-10")),
            createTracking(ShippingStatus.NOVELTY, new Date("2024-01-11")),
            createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking, ShippingStatus.NOVELTY)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const noveltyIndex = steps.findIndex(({ step }) => step.status === ShippingStatus.NOVELTY);

        expect(noveltyIndex).toBeGreaterThan(-1);
        expect(steps).toHaveLength(noveltyIndex + 1);
    });

    it("does not truncate when shipping status is not NOVELTY even if novelty entry exists", () => {
        const tracking = [
            createTracking(ShippingStatus.ASSIGNED, new Date("2024-01-10")),
            createTracking(ShippingStatus.NOVELTY, new Date("2024-01-11")),
            createTracking(ShippingStatus.DELIVERED, new Date("2024-01-15")),
        ];

        render(<OrderTrackingContainer selectedShipping={createShipping(tracking, ShippingStatus.DELIVERED)} />);

        const steps = capturedProps[0].getStepsToRender!();
        const statuses = steps.map(({ step }) => step.status);
        expect(statuses).toContain(ShippingStatus.NOVELTY);
        expect(statuses).toContain(ShippingStatus.DELIVERED);
    });
});
