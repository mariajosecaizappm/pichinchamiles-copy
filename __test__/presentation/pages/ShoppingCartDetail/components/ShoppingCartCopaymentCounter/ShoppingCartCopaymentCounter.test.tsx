import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import ShoppingCartCopaymentCounter from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentCounter/ShoppingCartCopaymentCounter";

const mocks = vi.hoisted(() => ({
    getCopaymentMaxMin: vi.fn(() => ({ min: 1, max: 999 })),
    getCopaymentPoints: vi.fn(() => 321),
    getCopaymentCoins: vi.fn(() => 4.5),
}));

vi.mock("@/domain/services/CopaymentCalculatorService", () => ({
    default: vi.fn().mockImplementation(() => ({
        getCopaymentMaxMin: mocks.getCopaymentMaxMin,
        getCopaymentPoints: mocks.getCopaymentPoints,
        getCopaymentCoins: mocks.getCopaymentCoins,
    })),
}));

vi.mock(
    "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartCopaymentCounter/CopaymentCounter",
    () => ({
        default: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
            <div>
                <span data-testid="counter-value">{value}</span>
                <button onClick={() => onChange(111)}>change</button>
            </div>
        ),
    }),
);

const createBasketItem = (overrides: Record<string, unknown> = {}) =>
    ({
        quantity: 2,
        paymentTypes: {
            points: { amount: 200, currencyId: "PTS" },
            coin: { amount: 20, currencyId: "USD" },
        },
        variationInfo: { pointsPrice: 1000, price: 20 },
        ...overrides,
    }) as any;

const copayment = {
    initialization: { points: 100, coins: 5 },
    minimumPointsValue: 50,
    pointsConversionRatePercentage: "x",
} as any;

describe("ShoppingCartCopaymentCounter", () => {
    it("returns null when basket item has no coin payment", () => {
        const { container } = render(
            <ShoppingCartCopaymentCounter
                type={CurrencyType.POINTS}
                basketItem={createBasketItem({ paymentTypes: { points: { amount: 100, currencyId: "PTS" } } })}
                copayment={copayment}
                onUpdateBasketItem={vi.fn()}
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    it("uses copayment calculation and updates points", () => {
        const onUpdateBasketItem = vi.fn().mockResolvedValue(undefined);
        render(
            <ShoppingCartCopaymentCounter
                type={CurrencyType.POINTS}
                basketItem={createBasketItem()}
                copayment={copayment}
                onUpdateBasketItem={onUpdateBasketItem}
            />,
        );

        fireEvent.click(screen.getByText("change"));
        expect(mocks.getCopaymentMaxMin).toHaveBeenCalledWith(CurrencyType.POINTS);
        expect(onUpdateBasketItem).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentTypes: expect.objectContaining({
                    points: expect.objectContaining({ amount: 111 }),
                    coin: expect.objectContaining({ amount: 4.5 }),
                }),
            }),
        );
    });

});
