import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import LegalConditionsLayout from "@/presentation/components/Layout/LegalConditionsLayout/LegalConditionsLayout";

describe("LegalConditionsLayout", () => {
    it("should render title and children", () => {
        render(
            <LegalConditionsLayout title="Condiciones">
                <p>Contenido de condiciones</p>
            </LegalConditionsLayout>,
        );

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Condiciones");
        expect(screen.getByText("Contenido de condiciones")).toBeInTheDocument();
    });

    it("should render breadcrumb by default", () => {
        render(
            <LegalConditionsLayout title="Condiciones">
                <p>Test</p>
            </LegalConditionsLayout>,
        );

        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Condiciones");
    });

    it("should not render breadcrumb when showBreadcrumb is false", () => {
        render(
            <LegalConditionsLayout title="Condiciones" showBreadcrumb={false}>
                <p>Test</p>
            </LegalConditionsLayout>,
        );

        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
        expect(screen.queryByRole("navigation")).toBeNull();
    });
});
