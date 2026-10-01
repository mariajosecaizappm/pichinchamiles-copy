import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LegislationSection from "@/presentation/pages/TermsConditionsProgram/components/LegislationSection";

describe("LegislationSection", () => {
    it("renders without crashing", () => {
        render(<LegislationSection />);
    });

    it("renders the legislation content", () => {
        render(<LegislationSection />);
        expect(screen.getByText(/La interpretación y aplicación/)).toBeInTheDocument();
        expect(screen.getByText(/presentes términos y condiciones/)).toBeInTheDocument();
        expect(screen.getByText(/Legislación Vigente de la República del Ecuador/)).toBeInTheDocument();
        expect(screen.getByText(/resolución de cualquier controversia/)).toBeInTheDocument();
    });

    it("contains legal terminology", () => {
        render(<LegislationSection />);
        expect(screen.getByText(/interpretación/)).toBeInTheDocument();
        expect(screen.getByText(/aplicación/)).toBeInTheDocument();
        expect(screen.getByText(/controversia/)).toBeInTheDocument();
    });

    it("has correct container structure", () => {
        render(<LegislationSection />);
        const container = screen.getByText(/La interpretación y aplicación/).parentElement;
        expect(container).toHaveClass("mb-4", "[&>p]:base-paragraph", "[&>p]:font-medium", "[&>p]:leading-body-dropdown", "[&>p]:text-dropdown");
    });

    it("renders paragraph with correct styling", () => {
        render(<LegislationSection />);
        const paragraph = screen.getByText(/La interpretación y aplicación/);
        expect(paragraph).toBeInTheDocument();
    });
});
