import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import ShoppingCartRecommendedProducts from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartRecommendedProducts";

const mocks = vi.hoisted(() => ({
    useQuery: vi.fn(),
    containerGet: vi.fn(),
    useSession: vi.fn(() => ({ isLogged: false })),
}));

vi.mock("@tanstack/react-query", () => ({
    useQuery: (options: any) => mocks.useQuery(options),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}));

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: vi.fn(() => ({ isDesktop: true })),
}));

vi.mock(
    "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper",
    () => ({
        default: ({ items }: { items: any[] }) => (
            <div data-testid="recommended-slider">{items.length}</div>
        ),
    })
);

describe("ShoppingCartRecommendedProducts", () => {
    it("should render null when no products exist", () => {
        mocks.useQuery.mockReturnValue({ data: [] });
        const { container } = render(<ShoppingCartRecommendedProducts />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should render carousel when products exist", () => {
        mocks.useQuery.mockReturnValue({
            data: [{ id: "1", assets: [{ desktopUrl: "url" }] }],
        });

        render(<ShoppingCartRecommendedProducts />);
        expect(screen.getByText("Productos recomendados")).toBeInTheDocument();
        expect(screen.getByTestId("recommended-slider")).toHaveTextContent("1");
    });

    it("should configure useQuery and fetch public recommended products from use case", async () => {
        const getPublicRecommendedProducts = vi.fn().mockResolvedValue([
            { id: "1", assets: [{ desktopUrl: "a" }] },
            { id: "2", assets: [] },
        ]);
        mocks.containerGet.mockReturnValue({ getPublicRecommendedProducts });
        mocks.useQuery.mockImplementation(() => ({ data: [] }));

        render(<ShoppingCartRecommendedProducts />);

        const options = mocks.useQuery.mock.calls[0][0];
        const result = await options.queryFn();

        expect(options.queryKey).toEqual(["shopping-cart-recommended-products", false]);
        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetRecommendedProductsUseCase);
        expect(getPublicRecommendedProducts).toHaveBeenCalled();
        expect(result).toEqual([{ id: "1", assets: [{ desktopUrl: "a" }] }]);
    });
});
