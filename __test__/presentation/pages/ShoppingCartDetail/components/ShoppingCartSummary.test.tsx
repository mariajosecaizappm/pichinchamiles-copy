import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ShoppingCartSummary from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartSummary/ShoppingCartSummary";

vi.mock("@/presentation/components/Alert/Alert", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="alert">{children}</div>
    ),
}));

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({ children, onPress, isDisabled, isLoading }: any) => (
        <button onClick={onPress} disabled={isDisabled} data-loading={String(isLoading)}>
            {children}
        </button>
    ),
}));

vi.mock("@/presentation/components/Form/components/Checkbox", () => ({
    Checkbox: ({ id, checked, onChange, label }: any) => (
        <label htmlFor={id}>
            <input id={id} type="checkbox" checked={checked} onChange={onChange} />
            {label}
        </label>
    ),
}));

vi.mock("next/link", () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentAccordion", () => ({
    default: ({ subtotal, taxes, total }: any) => (
        <div data-testid="copayment-accordion">{`${subtotal}-${taxes}-${total}`}</div>
    ),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/PendingPaymentAlert", () => ({
    default: ({ pendingReference }: { pendingReference: string }) => (
        <div data-testid="pending-payment-alert">{pendingReference}</div>
    ),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/CheckoutCopaymentBrands", () => ({
    default: () => <div data-testid="copayment-brands" />,
}));

const baseProps = () => ({
    pointsAmountTotal: 9000,
    itemsLabel: "2 items",
    showMinPointsAlert: false,
    missingMiles: 0,
    hasCopayment: false,
    copaymentSubtotal: 0,
    copaymentTaxes: 0,
    copaymentTotal: 0,
    pendingReference: "",
    acceptedTermsAndConditions: false,
    acceptedLopd: false,
    onChangeAcceptedTermsAndConditions: vi.fn(),
    onChangeAcceptedLopd: vi.fn(),
    onContinue: vi.fn(),
    onBack: vi.fn(),
    continueDisabled: false,
    backDisabled: false,
    isVerifying: false,
    backLabel: "Regresar",
    step: 1,
});

describe("ShoppingCartSummary", () => {
    it("renders totals and action buttons", () => {
        const props = baseProps();
        render(<ShoppingCartSummary {...props} />);

        expect(screen.getByText("Resumen de compra")).toBeInTheDocument();
        expect(screen.getByText("9.000 millas")).toBeInTheDocument();
        expect(screen.getByText("2 items")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Continuar"));
        fireEvent.click(screen.getByText("Regresar"));

        expect(props.onContinue).toHaveBeenCalledTimes(1);
        expect(props.onBack).toHaveBeenCalledTimes(1);
    });

    it("renders copayment helpers outside step 4", () => {
        const props = baseProps();
        render(
            <ShoppingCartSummary
                {...props}
                hasCopayment
                copaymentSubtotal={10}
                copaymentTaxes={2}
                copaymentTotal={12}
                pendingReference="ABC123"
            />
        );

        expect(screen.getByTestId("copayment-accordion")).toHaveTextContent("10-2-12");
        expect(screen.getByTestId("pending-payment-alert")).toHaveTextContent("ABC123");
        expect(screen.getByText("+ $12,00")).toBeInTheDocument();
        expect(screen.queryByTestId("copayment-brands")).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/terminos y condiciones/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/tratamiento de datos personales/i)).not.toBeInTheDocument();
    });

    it("renders copayment step 4 helpers and forwards checkbox changes", () => {
        const props = baseProps();
        render(
            <ShoppingCartSummary
                {...props}
                hasCopayment
                copaymentSubtotal={10}
                copaymentTaxes={2}
                copaymentTotal={12}
                pendingReference="ABC123"
                step={4}
            />
        );

        expect(screen.getByTestId("copayment-brands")).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText(/terminos y condiciones/i));
        fireEvent.click(screen.getByLabelText(/tratamiento de datos personales/i));

        expect(props.onChangeAcceptedTermsAndConditions).toHaveBeenCalledWith(true);
        expect(props.onChangeAcceptedLopd).toHaveBeenCalledWith(true);
    });

    it("shows the minimum miles alert and disables continue when requested", () => {
        render(
            <ShoppingCartSummary
                {...baseProps()}
                showMinPointsAlert
                missingMiles={1500}
                continueDisabled
            />
        );

        expect(screen.getByTestId("alert")).toHaveTextContent(
            "Te faltan 1.500 millas para completar tu compra."
        );
        expect(screen.getByText("Continuar")).toBeDisabled();
    });
});
