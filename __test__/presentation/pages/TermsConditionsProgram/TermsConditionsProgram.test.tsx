import { render, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TermsConditionsProgram from "@/presentation/pages/TermsConditionsProgram/TermsConditionsProgram";
import { getTabbedContent } from "@/presentation/pages/TermsConditionsProgram/content";

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

// Mock all the section components individually
vi.mock("@/presentation/pages/TermsConditionsProgram/components/RegisterSection", () => ({
    default: () => <div data-testid="RegisterSection">RegisterSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/ValiditySection", () => ({
    default: () => <div data-testid="ValiditySection">ValiditySection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/MilesAccumulationSection", () => ({
    default: () => <div data-testid="MilesAccumulationSection">MilesAccumulationSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/MilesRedemptionSection", () => ({
    default: () => <div data-testid="MilesRedemptionSection">MilesRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/MilesTransferSection", () => ({
    default: () => <div data-testid="MilesTransferSection">MilesTransferSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/MilesNullitySection", () => ({
    default: () => <div data-testid="MilesNullitySection">MilesNullitySection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/OtherBenefitsSection", () => ({
    default: () => <div data-testid="OtherBenefitsSection">OtherBenefitsSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/ProgramChangesSection", () => ({
    default: () => <div data-testid="ProgramChangesSection">ProgramChangesSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/LegislationSection", () => ({
    default: () => <div data-testid="LegislationSection">LegislationSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/OtherObligationsSection", () => ({
    default: () => <div data-testid="OtherObligationsSection">OtherObligationsSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/IrrevocableMandateSection", () => ({
    default: () => <div data-testid="IrrevocableMandateSection">IrrevocableMandateSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/TravelsRedemptionSection", () => ({
    default: () => <div data-testid="TravelsRedemptionSection">TravelsRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/FlightsRedemptionSection", () => ({
    default: () => <div data-testid="FlightsRedemptionSection">FlightsRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/HotelsRedemptionSection", () => ({
    default: () => <div data-testid="HotelsRedemptionSection">HotelsRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/CarRedemptionSection", () => ({
    default: () => <div data-testid="CarRedemptionSection">CarRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/ActivitiesRedemptionSection", () => ({
    default: () => <div data-testid="ActivitiesRedemptionSection">ActivitiesRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/ProductsRedemptionSection", () => ({
    default: () => <div data-testid="ProductsRedemptionSection">ProductsRedemptionSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/PaymentButtonSection", () => ({
    default: () => <div data-testid="PaymentButtonSection">PaymentButtonSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/DiscountsSection", () => ({
    default: () => <div data-testid="DiscountsSection">DiscountsSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/AdditionalTermsSection", () => ({
    default: () => <div data-testid="AdditionalTermsSection">AdditionalTermsSection</div>
}));

vi.mock("@/presentation/pages/TermsConditionsProgram/components/PqrTermsSection", () => ({
    default: () => <div data-testid="PqrTermsSection">PqrTermsSection</div>
}));

const mockUseSession = vi.fn(() => ({
    member: null,
    consent: null,
    isLogged: false,
    cif: "",
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}));

vi.mock("@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm", () => ({
    default: () => <div data-testid="lopd-consent-form">LopdForm</div>,
}));

vi.mock("@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers", () => ({
    needsTermsConsent: (member: { acceptedTermsAndCondition?: boolean } | null) =>
        Boolean(member && !member.acceptedTermsAndCondition),
}));

describe("TermsConditionsProgram", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({
            member: null,
            consent: null,
            isLogged: false,
            cif: "",
        });
    });

    it("renders the page with correct title", () => {
        render(<TermsConditionsProgram />);

        expect(screen.getByTestId("layout-title")).toHaveTextContent("Términos y Condiciones del Programa");
    });

    it("renders the introductory paragraphs", () => {
        render(<TermsConditionsProgram />);

        expect(screen.getByText(/Pichincha Miles® es el programa de lealtad del Banco Pichincha en Ecuador/)).toBeInTheDocument();
        expect(screen.getByText(/otorga la acumulación de Millas por consumo y que posteriormente se pueden canjear/)).toBeInTheDocument();
        expect(screen.getByText(/Estos términos y condiciones modifican y sustituyen cualquier versión anterior/)).toBeInTheDocument();
        expect(screen.getByText(/delimitan y aclaran las condiciones bajo las cuales los Clientes pueden registrarse/)).toBeInTheDocument();
    });

    it("renders tabs with correct number of items", () => {
        render(<TermsConditionsProgram />);

        const tabs = screen.getByTestId("tabs");
        expect(tabs).toBeInTheDocument();
        
        const tabItems = getTabbedContent();
        tabItems.forEach((item) => {
            expect(screen.getByTestId(`tab-${item.id}`)).toBeInTheDocument();
        });
    });

    it("maps program content to tab items correctly", () => {
        render(<TermsConditionsProgram />);

        const tabItems = getTabbedContent();
        tabItems.forEach((item) => {
            const tabItem = screen.getByTestId(`tab-${item.id}`);
            expect(tabItem).toBeInTheDocument();
            expect(tabItem).toHaveTextContent(item.label);
        });
    });

    it("renders tab items with correct titles", () => {
        render(<TermsConditionsProgram />);

        expect(screen.getByText("Membresía y millas")).toBeInTheDocument();
        expect(screen.getByText("Condiciones de canje")).toBeInTheDocument();
        expect(screen.getByText("Programa y legal")).toBeInTheDocument();
    });

    it("renders all section components within accordion", () => {
        render(<TermsConditionsProgram />);

        // Check that all section components are rendered
        expect(screen.getByTestId("RegisterSection")).toBeInTheDocument();
        expect(screen.getByTestId("ValiditySection")).toBeInTheDocument();
        expect(screen.getByTestId("MilesAccumulationSection")).toBeInTheDocument();
        expect(screen.getByTestId("MilesRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("MilesTransferSection")).toBeInTheDocument();
        expect(screen.getByTestId("MilesNullitySection")).toBeInTheDocument();
        expect(screen.getByTestId("OtherBenefitsSection")).toBeInTheDocument();
        expect(screen.getByTestId("ProgramChangesSection")).toBeInTheDocument();
        expect(screen.getByTestId("LegislationSection")).toBeInTheDocument();
        expect(screen.getByTestId("OtherObligationsSection")).toBeInTheDocument();
        expect(screen.getByTestId("IrrevocableMandateSection")).toBeInTheDocument();
        expect(screen.getByTestId("TravelsRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("FlightsRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("HotelsRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("CarRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("ActivitiesRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("ProductsRedemptionSection")).toBeInTheDocument();
        expect(screen.getByTestId("PaymentButtonSection")).toBeInTheDocument();
        expect(screen.getByTestId("DiscountsSection")).toBeInTheDocument();
        expect(screen.getByTestId("AdditionalTermsSection")).toBeInTheDocument();
        expect(screen.getByTestId("PqrTermsSection")).toBeInTheDocument();
    });

    it("renders layout components in correct order", () => {
        render(<TermsConditionsProgram />);

        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });

    it("applies correct className to layout", () => {
        render(<TermsConditionsProgram />);

        const layout = screen.getByTestId("legal-conditions-layout");
        expect(layout).toBeInTheDocument();
    });

    it("renders correct number of tab items based on content", () => {
        render(<TermsConditionsProgram />);

        const tabItems = getTabbedContent();
        const tabs = screen.getAllByTestId(/^tab-/);
        expect(tabs).toHaveLength(tabItems.length);
    });

    it("has correct page structure", () => {
        render(<TermsConditionsProgram />);

        const layout = screen.getByTestId("legal-conditions-layout");
        const tabs = screen.getByTestId("tabs");

        expect(layout).toContainElement(tabs);
    });

    it("sets hasHtml to false for all tab items", () => {
        render(<TermsConditionsProgram />);

        expect(screen.getByTestId("RegisterSection")).toBeInTheDocument();
        expect(screen.getByTestId("ValiditySection")).toBeInTheDocument();
    });

    it("renders program description with correct formatting", () => {
        render(<TermsConditionsProgram />);

        const paragraphs = screen.getAllByText(/Pichincha Miles®/);
        expect(paragraphs.length).toBeGreaterThanOrEqual(1);
        
        // Check for specific key phrases
        expect(screen.getByText(/www\.pichinchamiles\.com\.ec/)).toBeInTheDocument();
    });

    it("when logged user has pending terms consent, should render inline consent form", () => {
        mockUseSession.mockReturnValue({
            member: { acceptedTermsAndCondition: false, acceptLopd: true },
            consent: null,
            isLogged: true,
            cif: "cif-123",
        });

        render(<TermsConditionsProgram />);

        expect(screen.getByTestId("lopd-consent-form")).toBeInTheDocument();
    });

    it("when user has accepted terms, should not render inline consent form", () => {
        mockUseSession.mockReturnValue({
            member: { acceptedTermsAndCondition: true, acceptLopd: true },
            consent: null,
            isLogged: true,
            cif: "cif-123",
        });

        render(<TermsConditionsProgram />);

        expect(screen.queryByTestId("lopd-consent-form")).not.toBeInTheDocument();
    });

    it("when user is not logged in, should not render inline consent form", () => {
        mockUseSession.mockReturnValue({
            member: null,
            consent: null,
            isLogged: false,
            cif: "",
        });

        render(<TermsConditionsProgram />);

        expect(screen.queryByTestId("lopd-consent-form")).not.toBeInTheDocument();
    });
});
