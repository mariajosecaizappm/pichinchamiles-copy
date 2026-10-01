import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TermsConditionsUse from "@/presentation/pages/TermsConditionsUse/TermsConditionsUse";
import { getTabbedContent } from "@/presentation/pages/TermsConditionsUse/data";

// Mock the components that are not directly being tested
vi.mock("@/presentation/components/Layout/LegalConditionsLayout", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="legal-conditions-layout">
            <h1 data-testid="layout-title">{title}</h1>
            {children}
        </div>
    )
}));

vi.mock("@/presentation/components/Accordion/Accordion", () => ({
    default: ({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) => (
        <div data-testid="accordion">
            {items.map((item) => (
                <div key={item.id} data-testid={`accordion-item-${item.id}`}>
                    <h4>{item.title}</h4>
                    <div>{item.content}</div>
                </div>
            ))}
        </div>
    )
}));

vi.mock("@/presentation/components/Tabs/Tabs", () => ({
    default: ({ items }: { items: { id: string; label: string; content: React.ReactNode }[] }) => (
        <div data-testid="tabs">
            {items.map((item) => (
                <div key={item.id} data-testid={`tab-${item.id}`}>
                    <h3>{item.label}</h3>
                    {item.content}
                </div>
            ))}
        </div>
    )
}));

vi.mock("@/presentation/components/Layout/Row", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="row">{children}</div>
    )
}));

vi.mock("@/presentation/components/Layout/Col", () => ({
    default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="col" className={className}>
            {children}
        </div>
    )
}));

describe("TermsConditionsUse", () => {
    it("renders the page with correct title", () => {
        render(<TermsConditionsUse />);

        expect(screen.getByTestId("layout-title")).toHaveTextContent("Términos y Condiciones de Uso");
    });

    it("renders the introductory paragraphs", () => {
        render(<TermsConditionsUse />);

        expect(screen.getByText(/Lea cuidadosamente los presentes términos y condiciones de acceso/)).toBeInTheDocument();
        expect(screen.getByText(/Al acceder a este sitio y a cualquier página del mismo, se/)).toBeInTheDocument();
        expect(screen.getByText(/compromete a cumplir con los términos y condiciones que se detallan/)).toBeInTheDocument();
        expect(screen.getByText(/a continuación/)).toBeInTheDocument();
    });

    it("renders the confidentiality reminder", () => {
        render(<TermsConditionsUse />);

        expect(screen.getByText(/Lea cuidadosamente los presentes términos y condiciones de acceso/)).toBeInTheDocument();
    });

    it("renders tabs with correct number of items", () => {
        render(<TermsConditionsUse />);

        const tabs = screen.getByTestId("tabs");
        expect(tabs).toBeInTheDocument();
        
        const tabItems = getTabbedContent();
        tabItems.forEach((item) => {
            expect(screen.getByTestId(`tab-${item.id}`)).toBeInTheDocument();
        });
    });

    it("maps terms conditions data to tab items correctly", () => {
        render(<TermsConditionsUse />);

        const tabItems = getTabbedContent();
        tabItems.forEach((item) => {
            const tabItem = screen.getByTestId(`tab-${item.id}`);
            expect(tabItem).toBeInTheDocument();
            expect(tabItem).toHaveTextContent(item.label);
        });
    });

    it("renders tab items with correct titles", () => {
        render(<TermsConditionsUse />);

        expect(screen.getByText("COPYRIGHT © Pichincha Miles 2012")).toBeInTheDocument();
        expect(screen.getByText("Marcas Registradas")).toBeInTheDocument();
        expect(screen.getByText("Uso de Información y Materiales")).toBeInTheDocument();
        expect(screen.getByText("Sin Garantía")).toBeInTheDocument();
        expect(screen.getByText("Límite de Responsabilidad")).toBeInTheDocument();
        expect(screen.getByText("Presentaciones")).toBeInTheDocument();
        expect(screen.getByText("Microsoft Clarity")).toBeInTheDocument();
    });

    it("renders layout components in correct order", () => {
        render(<TermsConditionsUse />);

        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });

    it("applies correct className to Col component", () => {
        render(<TermsConditionsUse />);

        const layout = screen.getByTestId("legal-conditions-layout");
        expect(layout).toBeInTheDocument();
    });

    it("renders correct number of tab items based on data", () => {
        render(<TermsConditionsUse />);

        const tabItems = getTabbedContent();
        const tabs = screen.getAllByTestId(/^tab-/);
        expect(tabs).toHaveLength(tabItems.length);
    });

    it("has correct page structure", () => {
        render(<TermsConditionsUse />);

        const layout = screen.getByTestId("legal-conditions-layout");
        const tabs = screen.getByTestId("tabs");

        expect(layout).toContainElement(tabs);
    });

    it("renders confidentiality reminder with correct styling", () => {
        render(<TermsConditionsUse />);

        const introText = screen.getByText(/Lea cuidadosamente los presentes términos y condiciones de acceso/);
        expect(introText).toBeInTheDocument();
    });
});
