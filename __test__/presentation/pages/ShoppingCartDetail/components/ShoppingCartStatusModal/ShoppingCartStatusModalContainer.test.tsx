import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentStatus } from "@/domain/entity/Payment/payment";
import ShoppingCartStatusModalContainer from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/ShoppingCartStatusModalContainer";

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    onClose: vi.fn(),
    useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}));

vi.mock("@/data/provider/crypto/actions", () => ({
    encryptText: (text: string) => Promise.resolve(text),
}));

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/ShoppingCartStatusModal",
    () => ({
        default: ({
            title,
            description,
            secondaryDescription,
            showSupportBox,
            retry,
            onBackToHome,
            onGoToRedemptions,
            onRetry,
            onClose,
        }: any) => (
            <div>
                <div data-testid="title">{title}</div>
                <div data-testid="description">{description}</div>
                <div data-testid="secondary-description">{secondaryDescription}</div>
                <div data-testid="show-support-box">{String(showSupportBox)}</div>
                <div data-testid="retry">{String(retry)}</div>
                <button onClick={onBackToHome}>home</button>
                <button onClick={onGoToRedemptions}>redemptions</button>
                <button onClick={onRetry}>retry</button>
                <button onClick={onClose}>close</button>
            </div>
        ),
    })
);

describe("ShoppingCartStatusModalContainer", () => {
    beforeEach(() => {
        mocks.push.mockReset();
        mocks.onClose.mockReset();
        mocks.useSession.mockReturnValue({
            member: {
                enrollmentEmail: "jane@example.com",
            },
        });
    });

    it("builds redemption success content with masked email and navigates to redemptions", async () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.SUCCESS}
                type="redemption"
                reference="REF-123"
                amount={1200}
                consumptions="5"
            />
        );

        expect(screen.getByTestId("title")).toHaveTextContent("Canje exitoso");
        expect(screen.getByTestId("description")).toHaveTextContent(
            "Tu pedido con un valor de 1.200 millas fue realizado exitosamente"
        );
        expect(screen.getByTestId("description")).not.toHaveTextContent("REF-123");
        expect(screen.getByTestId("secondary-description")).toHaveTextContent(
            "j**e@example.com"
        );
        expect(screen.getByTestId("show-support-box")).toHaveTextContent("false");
        expect(screen.getByTestId("retry")).toHaveTextContent("false");

        fireEvent.click(screen.getByText("redemptions"));

        await waitFor(() => {
            expect(mocks.onClose).toHaveBeenCalledTimes(1);
            expect(mocks.push).toHaveBeenCalledWith("/mis-pedidos?consumptions=5");
        });
    });

    it("builds rejected redemption content and retries by closing only", () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.REJECTED}
                type="redemption"
                reference=""
                amount={2500}
            />
        );

        expect(screen.getByTestId("title")).toHaveTextContent("Canje rechazado");
        expect(screen.getByTestId("description")).toHaveTextContent(
            "Lo sentimos, tu pedido con un valor de 2.500 millas fue rechazado"
        );
        expect(screen.getByTestId("secondary-description")).toHaveTextContent(
            "Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros."
        );
        expect(screen.getByTestId("show-support-box")).toHaveTextContent("true");
        expect(screen.getByTestId("retry")).toHaveTextContent("true");

        fireEvent.click(screen.getByText("retry"));

        expect(mocks.onClose).toHaveBeenCalledTimes(1);
        expect(mocks.push).not.toHaveBeenCalled();
    });

    it("navigates back to products from payment states", () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.PENDING}
                type="payment"
                reference="PAY-1"
                amount={15.5}
            />
        );

        expect(screen.getByTestId("title")).toHaveTextContent("Pago pendiente");
        expect(screen.getByTestId("description")).toHaveTextContent("$15,50 dólares");
        expect(screen.getByTestId("secondary-description")).toHaveTextContent(
            "j**e@example.com"
        );

        fireEvent.click(screen.getByText("home"));

        expect(mocks.onClose).toHaveBeenCalledTimes(1);
        expect(mocks.push).toHaveBeenCalledWith("/utilice-sus-millas/productos");
    });

    it("formats payment success amounts with decimals instead of miles formatting", () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.SUCCESS}
                type="payment"
                reference="productsorder-360000317"
                amount={34.72}
            />
        );

        expect(screen.getByTestId("title")).toHaveTextContent("Pago aprobado");
        expect(screen.getByTestId("description")).toHaveTextContent("$34,72 dólares");
        expect(screen.getByTestId("description")).not.toHaveTextContent("3.472");
        expect(screen.getByTestId("show-support-box")).toHaveTextContent("false");
        expect(screen.getByTestId("retry")).toHaveTextContent("false");
    });

    it("builds rejected payment content with formatted dollars", () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.REJECTED}
                type="payment"
                reference="PAY-REJECTED"
                amount={34.72}
            />
        );

        expect(screen.getByTestId("title")).toHaveTextContent("Pago rechazado");
        expect(screen.getByTestId("description")).toHaveTextContent("PAY-REJECTED");
        expect(screen.getByTestId("description")).toHaveTextContent("$34,72 dólares");
        expect(screen.getByTestId("secondary-description")).toHaveTextContent(
            "Por favor, intenta realizarlo más tarde o ponte en contacto con nosotros."
        );
        expect(screen.getByTestId("show-support-box")).toHaveTextContent("true");
        expect(screen.getByTestId("retry")).toHaveTextContent("false");
    });

    it("closes the modal without navigating", () => {
        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.SUCCESS}
                type="payment"
                reference="PAY-CLOSE"
                amount={10}
            />
        );

        fireEvent.click(screen.getByText("close"));

        expect(mocks.onClose).toHaveBeenCalledTimes(1);
        expect(mocks.push).not.toHaveBeenCalled();
    });

    it("renders empty email when enrollment email is missing or invalid", () => {
        mocks.useSession.mockReturnValue({
            member: {
                enrollmentEmail: "invalid-email",
            },
        });

        render(
            <ShoppingCartStatusModalContainer
                isActive
                modalId="test-modal"
                onClose={mocks.onClose}
                status={PaymentStatus.SUCCESS}
                type="payment"
                reference="PAY-NO-EMAIL"
                amount={10}
            />
        );

        expect(screen.getByTestId("secondary-description")).not.toHaveTextContent("@");
        expect(screen.getByTestId("secondary-description").textContent).toMatch(
            /registrado:\s*$/
        );
    });
});
