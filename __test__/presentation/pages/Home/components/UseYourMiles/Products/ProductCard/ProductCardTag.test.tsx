import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCardTag from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTag";

// Mock the colors module
vi.mock("@/presentation/style/colors", () => ({
    default: {
        yellow: {
            500: "#fbbf24"
        },
        blue: {
            500: "#3b82f6"
        }
    }
}));

describe("ProductCardTag", () => {
    it("renders tag text correctly", () => {
        render(<ProductCardTag tag="NEW" />);
        
        const tagElement = screen.getByText("NEW");
        expect(tagElement).toBeInTheDocument();
    });

    it("has correct accessibility label", () => {
        render(<ProductCardTag tag="SALE" />);
        
        const tagElement = screen.getByLabelText("SALE");
        expect(tagElement).toBeInTheDocument();
    });

    it("applies default styles when no colors are provided", () => {
        render(<ProductCardTag tag="HOT" />);
        
        const tagElement = screen.getByText("HOT");
        expect(tagElement).toHaveClass(
            "uppercase",
            "py-1",
            "px-1.5",
            "rounded-lg",
            "text-xs",
            "font-sans",
            "font-bold",
            "leading-2.75"
        );
    });

    it("uses default background color when empty string is provided", () => {
        render(<ProductCardTag tag="TEST" backgroundColor="" />);
        
        const tagElement = screen.getByText("TEST");
        expect(tagElement).toHaveStyle("background-color: #fbbf24");
    });

    it("uses default text color when empty string is provided", () => {
        render(<ProductCardTag tag="TEST" textColor="" />);
        
        const tagElement = screen.getByText("TEST");
        expect(tagElement).toHaveStyle("color: #3b82f6");
    });

    it("applies custom background color when provided", () => {
        render(<ProductCardTag tag="CUSTOM" backgroundColor="#ff0000" />);
        
        const tagElement = screen.getByText("CUSTOM");
        expect(tagElement).toHaveStyle("background-color: #ff0000");
    });

    it("applies custom text color when provided", () => {
        render(<ProductCardTag tag="CUSTOM" textColor="#00ff00" />);
        
        const tagElement = screen.getByText("CUSTOM");
        expect(tagElement).toHaveStyle("color: #00ff00");
    });

    it("applies both custom background and text colors when provided", () => {
        render(<ProductCardTag 
            tag="BOTH" 
            backgroundColor="#ff0000" 
            textColor="#00ff00" 
        />);
        
        const tagElement = screen.getByText("BOTH");
        expect(tagElement).toHaveStyle("background-color: #ff0000");
        expect(tagElement).toHaveStyle("color: #00ff00");
    });

    it("renders as span element", () => {
        render(<ProductCardTag tag="SPAN" />);
        
        const tagElement = screen.getByText("SPAN");
        expect(tagElement.tagName).toBe("SPAN");
    });

    it("handles special characters in tag text", () => {
        render(<ProductCardTag tag="50% OFF" />);
        
        const tagElement = screen.getByText("50% OFF");
        expect(tagElement).toBeInTheDocument();
        expect(tagElement).toHaveAttribute("aria-label", "50% OFF");
    });

    it("handles empty tag text", () => {
        render(<ProductCardTag tag="" />);
        
        const tagElement = screen.getByLabelText("");
        expect(tagElement).toBeInTheDocument();
        expect(tagElement).toHaveTextContent("");
    });

    it("uses default colors when color props are undefined", () => {
        render(<ProductCardTag tag="DEFAULTS" />);
        
        const tagElement = screen.getByText("DEFAULTS");
        // When props are undefined, no explicit style is applied
        expect(tagElement).not.toHaveStyle("background-color: #fbbf24");
        expect(tagElement).not.toHaveStyle("color: #3b82f6");
    });
});
