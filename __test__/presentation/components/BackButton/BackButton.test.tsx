import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BackButton from "@/presentation/components/BackButton/BackButton";

// Mock Next.js router
const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
};

vi.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
}));

// Mock Icon
vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: any) => <span data-testid={name}>←</span>,
}));

// Mock window.history
const originalHistory = window.history;

describe("BackButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'history', {
            value: {
                length: 2,
            },
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'history', {
            value: originalHistory,
        });
    });

    it("renders with default text", () => {
        render(<BackButton />);
        expect(screen.getByText("Regresar")).toBeInTheDocument();
        expect(screen.getByTestId("icon-back-arrow")).toBeInTheDocument();
    });

    it("renders with custom children", () => {
        render(<BackButton>Volver al inicio</BackButton>);
        expect(screen.getByText("Volver al inicio")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<BackButton className="custom-class" />);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("custom-class");
    });

    it("calls router.back when history length > 1", () => {
        Object.defineProperty(window, 'history', {
            value: { length: 2 },
            writable: true,
        });

        render(<BackButton />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockRouter.back).toHaveBeenCalledTimes(1);
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("calls router.push with fallbackHref when history length <= 1", () => {
        Object.defineProperty(window, 'history', {
            value: { length: 1 },
            writable: true,
        });

        render(<BackButton fallbackHref="/custom-path" />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockRouter.push).toHaveBeenCalledWith("/custom-path");
        expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it("calls customGoBack function when provided", () => {
        const customGoBack = vi.fn();
        render(<BackButton customGoBack={customGoBack} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(customGoBack).toHaveBeenCalledTimes(1);
        expect(mockRouter.back).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("has correct default classes", () => {
        render(<BackButton />);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("cursor-pointer", "flex", "items-center", "base-paragraph", "font-normal", "leading-normal", "text-blue-500");
    });

    it("renders as a button element", () => {
        render(<BackButton />);
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
    });
});
