import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    useSession: vi.fn(),
    useRouter: vi.fn(),
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}));

vi.mock("next/navigation", () => ({
    useRouter: mocks.useRouter,
}));

vi.mock("@/presentation/pages/Orders/components/Layout", () => ({
    OrdersSkeleton: () => <div data-testid="orders-skeleton">Loading...</div>,
}));

vi.mock("@/presentation/config/links", () => ({
    default: {
        home: "/",
    },
}));

import OrdersWrapper from "@/presentation/pages/Orders/OrdersWrapper";

describe("OrdersWrapper", () => {
    const mockReplace = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useRouter.mockReturnValue({
            replace: mockReplace,
            push: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    it("shows skeleton during session validation", () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: true,
        });

        render(
            <OrdersWrapper>
                <div data-testid="children">Content</div>
            </OrdersWrapper>
        );

        const skeleton = screen.getByTestId("orders-skeleton");
        expect(skeleton).toBeInTheDocument();
        expect(skeleton.parentElement).toHaveClass("min-h-85");
        expect(screen.queryByTestId("children")).not.toBeInTheDocument();
    });

    it("redirects to home when no member and not validating", () => {
        mocks.useSession.mockReturnValue({
            member: null,
            isValidatingSession: false,
        });

        render(
            <OrdersWrapper>
                <div data-testid="children">Content</div>
            </OrdersWrapper>
        );

        expect(mockReplace).toHaveBeenCalledWith("/");
        expect(screen.queryByTestId("children")).not.toBeInTheDocument();
        expect(screen.queryByTestId("orders-skeleton")).not.toBeInTheDocument();
    });

    it("renders children when member is authenticated", () => {
        mocks.useSession.mockReturnValue({
            member: {
                id: "member-123",
                firstName: "John",
                lastName: "Doe",
            },
            isValidatingSession: false,
        });

        render(
            <OrdersWrapper>
                <div data-testid="children">Content</div>
            </OrdersWrapper>
        );

        const children = screen.getByTestId("children");
        expect(children).toBeInTheDocument();
        expect(children.parentElement).toHaveClass("min-h-85");
        expect(screen.queryByTestId("orders-skeleton")).not.toBeInTheDocument();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("does not redirect when member exists even if validating", () => {
        mocks.useSession.mockReturnValue({
            member: {
                id: "member-456",
                firstName: "Jane",
                lastName: "Smith",
            },
            isValidatingSession: true,
        });

        render(
            <OrdersWrapper>
                <div data-testid="children">Content</div>
            </OrdersWrapper>
        );

        expect(screen.getByTestId("orders-skeleton")).toBeInTheDocument();
        expect(mockReplace).not.toHaveBeenCalled();
    });
});
