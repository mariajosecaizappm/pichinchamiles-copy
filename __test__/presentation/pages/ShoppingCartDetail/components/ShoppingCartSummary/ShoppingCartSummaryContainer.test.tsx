import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShoppingCartSummaryContainer from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartSummary/ShoppingCartSummaryContainer";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import type { UseOtpConfig } from "@/presentation/hooks/useOtp";
import { PaymentStatus } from "@/domain/entity/Payment/payment";

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    containerGet: vi.fn(),
    productRedemptionUseCase: {
        getProductOrderOtp: vi.fn(),
        productRedemption: vi.fn(),
    },
    getOrdersUseCase: {
        getOrderHistory: vi.fn(),
    },
    useSession: vi.fn(),
    useCheckout: vi.fn(),
    openShoppingCartStatusModal: vi.fn(),
    withOtp: vi.fn(),
    useOtp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useCheckout", () => ({
    default: mocks.useCheckout,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartStatusModal", () => ({
    default: () => ({
        openShoppingCartStatusModal: mocks.openShoppingCartStatusModal,
    }),
}));

vi.mock("@/presentation/hooks/useOtp", () => ({
    default: (config: unknown) => {
        mocks.useOtp(config);
        return {
            withOtp: mocks.withOtp,
        };
    },
}));

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartSummary/ShoppingCartSummary",
    () => ({
        default: (props: any) => (
            <div>
                <div data-testid="continue-disabled">{String(props.continueDisabled)}</div>
                <div data-testid="back-label">{props.backLabel}</div>
                <div data-testid="step">{props.step}</div>
                <button onClick={props.onContinue}>continue</button>
                <button onClick={props.onBack}>back</button>
                <button onClick={() => props.onChangeAcceptedTermsAndConditions(true)}>
                    accept-terms
                </button>
                <button onClick={() => props.onChangeAcceptedLopd(true)}>accept-lopd</button>
            </div>
        ),
    })
);

const createBasketState = (overrides: Record<string, unknown> = {}) =>
    ({
        items: [{ quantity: 1 }],
        pointsAmountTotal: 9000,
        copaymentSubtotal: 0,
        copaymentTaxes: 0,
        copaymentTotal: 0,
        hasCopayment: false,
        hasDisabledProducts: false,
        isLoading: false,
        isVerifying: false,
        verifyShoppingCart: vi.fn().mockResolvedValue(true),
        ...overrides,
    }) as any;

const createCheckoutState = (overrides: Record<string, unknown> = {}) => ({
    step: 1,
    onNextStep: vi.fn(),
    onPrevStep: vi.fn(),
    resetCheckout: vi.fn(),
    shippingAddress: { id: "shipping" },
    billingAddress: { id: "billing" },
    sessionId: "session-1",
    ...overrides,
});

describe("ShoppingCartSummaryContainer", () => {
    beforeEach(() => {
        mocks.push.mockReset();
        mocks.containerGet.mockReset();
        mocks.useSession.mockReset();
        mocks.useCheckout.mockReset();
        mocks.openShoppingCartStatusModal.mockReset();
        mocks.withOtp.mockReset();
        mocks.productRedemptionUseCase.getProductOrderOtp.mockReset();
        mocks.productRedemptionUseCase.productRedemption.mockReset();
        mocks.getOrdersUseCase.getOrderHistory.mockReset();
        mocks.useOtp.mockReset();
        mocks.containerGet.mockImplementation((type: symbol) =>
            type === UseCaseTypes.GetOrdersUseCase
                ? mocks.getOrdersUseCase
                : mocks.productRedemptionUseCase
        );
        mocks.withOtp.mockResolvedValue(false);
        mocks.useSession.mockReturnValue({
            balance: 10000,
            basket: { buyerId: "buyer-1", items: [] },
            member: {
                memberType: "PERSONAL",
                firstName: "Jane",
                firstLastName: "Doe",
                enrollmentEmail: "jane@example.com",
                identificationNumber: "123",
                cellPhone: "0999999999",
                identificationType: "CC",
                city: "Quito",
            },
            clearBasket: vi.fn(),
            updateBalance: vi.fn(),
        });
        mocks.useCheckout.mockReturnValue(createCheckoutState());
    });

    it("goes to the next step after a successful verification on step 1", async () => {
        const onNextStep = vi.fn();
        const verifyShoppingCart = vi.fn().mockResolvedValue(true);
        mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 1, onNextStep }));

        render(
            <ShoppingCartSummaryContainer
                basketState={createBasketState({ verifyShoppingCart })}
                pendingReference=""
                billingFormRef={{ current: null }}
            />
        );

        expect(screen.getByTestId("step")).toHaveTextContent("1");

        fireEvent.click(screen.getByText("continue"));

        await waitFor(() => {
            expect(verifyShoppingCart).toHaveBeenCalledTimes(1);
            expect(onNextStep).toHaveBeenCalledTimes(1);
        });
    });

    it("submits the billing form on step 3", async () => {
        const submitForm = vi.fn();
        const onNextStep = vi.fn();
        mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 3, onNextStep }));

        render(
            <ShoppingCartSummaryContainer
                basketState={createBasketState()}
                pendingReference=""
                billingFormRef={{ current: { submitForm } as any }}
            />
        );

        expect(screen.getByTestId("step")).toHaveTextContent("3");

        fireEvent.click(screen.getByText("continue"));

        await waitFor(() => {
            expect(submitForm).toHaveBeenCalledTimes(1);
        });
        expect(onNextStep).not.toHaveBeenCalled();
    });

    it("navigates back to the catalog from the first step", () => {
        render(
            <ShoppingCartSummaryContainer
                basketState={createBasketState()}
                pendingReference=""
                billingFormRef={{ current: null }}
            />
        );

        expect(screen.getByTestId("back-label")).toHaveTextContent("Regresar al catálogo");

        fireEvent.click(screen.getByText("back"));

        expect(mocks.push).toHaveBeenCalledWith("/productos");
    });

    it("requires both copayment checkboxes on step 4", () => {
        mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 4 }));

        render(
            <ShoppingCartSummaryContainer
                basketState={createBasketState({
                    hasCopayment: true,
                    copaymentTotal: 12,
                })}
                pendingReference="ABC123"
                billingFormRef={{ current: null }}
            />
        );

        expect(screen.getByTestId("step")).toHaveTextContent("4");
        expect(screen.getByTestId("continue-disabled")).toHaveTextContent("true");

        fireEvent.click(screen.getByText("accept-terms"));
        expect(screen.getByTestId("continue-disabled")).toHaveTextContent("true");

        fireEvent.click(screen.getByText("accept-lopd"));
        expect(screen.getByTestId("continue-disabled")).toHaveTextContent("false");
    });

    it("stops the flow when shopping cart verification fails", async () => {
        const onNextStep = vi.fn();
        const verifyShoppingCart = vi.fn().mockResolvedValue(false);
        mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 1, onNextStep }));

        render(
            <ShoppingCartSummaryContainer
                basketState={createBasketState({ verifyShoppingCart })}
                pendingReference=""
                billingFormRef={{ current: null }}
            />
        );

        fireEvent.click(screen.getByText("continue"));

        await waitFor(() => {
            expect(verifyShoppingCart).toHaveBeenCalledTimes(1);
        });
        expect(onNextStep).not.toHaveBeenCalled();
    });

    describe("redemption success flow", () => {
        const getLatestOtpConfig = (): UseOtpConfig<void> => {
            const lastCall = mocks.useOtp.mock.calls.at(-1);
            return lastCall?.[0] as UseOtpConfig<void>;
        };

        it("opens the redemption success modal using paymentGatewayReference and orders total", async () => {
            mocks.useCheckout.mockReturnValue(createCheckoutState({
                step: 4,
                orders: {
                    data: [],
                    pagination: { page: 1, pageSize: 20, total: 7, totalPages: 1 },
                },
            }));
            mocks.productRedemptionUseCase.productRedemption.mockResolvedValue({
                balanceAfterOperation: 500,
                paymentGatewayReference: "REF-123",
                placeToPayUrl: "",
            });

            render(
                <ShoppingCartSummaryContainer
                    basketState={createBasketState()}
                    pendingReference=""
                    billingFormRef={{ current: null }}
                />
            );

            await act(async () => {
                await getLatestOtpConfig().onContinue(undefined as unknown as void);
            });

            expect(mocks.openShoppingCartStatusModal).toHaveBeenCalledWith({
                status: PaymentStatus.SUCCESS,
                type: "redemption",
                reference: "REF-123",
                amount: 9000,
                consumptions: "7",
            });
        });

        it("uses empty reference when paymentGatewayReference is empty", async () => {
            mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 4 }));
            mocks.productRedemptionUseCase.productRedemption.mockResolvedValue({
                balanceAfterOperation: 500,
                paymentGatewayReference: "",
                orderId: "ORDER-99",
                placeToPayUrl: "",
            });
            mocks.getOrdersUseCase.getOrderHistory.mockResolvedValue({
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            });

            render(
                <ShoppingCartSummaryContainer
                    basketState={createBasketState()}
                    pendingReference=""
                    billingFormRef={{ current: null }}
                />
            );

            await act(async () => {
                await getLatestOtpConfig().onContinue(undefined as unknown as void);
            });

            expect(mocks.openShoppingCartStatusModal).toHaveBeenCalledWith(
                expect.objectContaining({ reference: "", consumptions: "0" })
            );
        });

        it("redirects to place to pay instead of opening the redemption modal when placeToPayUrl is present", async () => {
            mocks.useCheckout.mockReturnValue(createCheckoutState({ step: 4 }));
            mocks.productRedemptionUseCase.productRedemption.mockResolvedValue({
                balanceAfterOperation: 500,
                paymentGatewayReference: "REF-PTP",
                placeToPayUrl: "https://placetopay.example.com",
            });

            render(
                <ShoppingCartSummaryContainer
                    basketState={createBasketState()}
                    pendingReference=""
                    billingFormRef={{ current: null }}
                />
            );

            await act(async () => {
                await getLatestOtpConfig().onContinue(undefined as unknown as void);
            });

            expect(mocks.getOrdersUseCase.getOrderHistory).not.toHaveBeenCalled();
            expect(mocks.openShoppingCartStatusModal).not.toHaveBeenCalled();
        });
    });
});
