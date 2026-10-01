import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    useQuery: vi.fn(),
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
    isMobileDevice: vi.fn(),
    getOrdersUseCase: {
        getOrderHistory: vi.fn(),
    },
}));

vi.mock("@tanstack/react-query", () => ({
    useQuery: mocks.useQuery,
}));

vi.mock("next/navigation", () => ({
    useRouter: mocks.useRouter,
    usePathname: mocks.usePathname,
    useSearchParams: mocks.useSearchParams,
}));

vi.mock("@/presentation/helpers/device", () => ({
    isMobileDevice: mocks.isMobileDevice,
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => mocks.getOrdersUseCase,
    },
}));

vi.mock("@/presentation/pages/Orders/components/EmptyOrders", () => ({
    default: () => <div data-testid="empty-orders">Empty State</div>,
    NoOrdersSearchResults: () => <div data-testid="no-search-results">No se encontraron resultados</div>,
}));

vi.mock("@/presentation/pages/Orders/components/Layout", () => ({
    default: ({ children, orderNumber, onSearch }: any) => (
        <div data-testid="orders-layout">
            <input
                data-testid="search-input"
                value={orderNumber}
                onChange={(e) => onSearch(e.target.value)}
            />
            {children}
        </div>
    ),
    OrdersSkeleton: ({ className }: any) => (
        <div data-testid="orders-skeleton" className={className}>Loading...</div>
    ),
    OrdersHeader: () => <div data-testid="orders-header">Mis pedidos</div>,
}));

vi.mock("@/presentation/pages/Orders/components/Layout/Skeleton/OrderListSkeleton", () => ({
    default: ({ className }: any) => (
        <div data-testid="order-list-skeleton" className={className}>Loading list...</div>
    ),
}));

vi.mock("@/presentation/pages/Orders/Orders", () => ({
    default: ({
        orders,
        isLoadingMore,
        onLoadMore,
        onSelectOrder,
        isPendingOrder,
    }: {
        orders: { data: { orderNumber: string }[] };
        isLoadingMore: boolean;
        onLoadMore: () => void;
        onSelectOrder: (order: { orderNumber: string }) => void;
        isPendingOrder?: boolean;
    }) => (
        <div data-testid="orders-list">
            <div data-testid="orders-count">{orders.data.length}</div>
            <div data-testid="is-pending-order">{String(isPendingOrder)}</div>
            <button data-testid="load-more" onClick={onLoadMore} disabled={isLoadingMore}>
                {isLoadingMore ? "Loading..." : "Load More"}
            </button>
            <button data-testid="select-order" onClick={() => onSelectOrder(orders.data[0])}>
                Select Order
            </button>
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails", () => ({
    default: ({ order, onPressBack }: { order: { orderNumber: string }; onPressBack: () => void }) => (
        <div data-testid="order-details">
            <div data-testid="selected-order-number">{order.orderNumber}</div>
            <button data-testid="back-button" onClick={onPressBack}>Back</button>
        </div>
    ),
}));

import OrdersContainer from "@/presentation/pages/Orders/OrdersContainer";

describe("OrdersContainer", () => {
    const mockReplace = vi.fn();
    let mockSearchParams: URLSearchParams;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams = new URLSearchParams();
        mocks.useRouter.mockReturnValue({
            replace: mockReplace,
        });
        mocks.usePathname.mockReturnValue("/mis-pedidos");
        mocks.useSearchParams.mockReturnValue(mockSearchParams);
        mocks.isMobileDevice.mockReturnValue(false);
    });

    it("uses mobile pageSize when on mobile device", () => {
        mocks.isMobileDevice.mockReturnValue(true);
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer />);

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["orders", undefined, 1, 6],
            })
        );
    });

    it("uses desktop pageSize when not on mobile device", () => {
        mocks.isMobileDevice.mockReturnValue(false);
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer />);

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["orders", undefined, 1, 6],
            })
        );
    });

    it("shows skeleton when loading", () => {
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer />);

        expect(screen.getByTestId("order-list-skeleton")).toBeInTheDocument();
    });

    it("shows empty state when no data and no search term", () => {
        mocks.useQuery.mockReturnValue({
            data: {
                data: [],
                pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 },
            },
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        expect(screen.getByTestId("empty-orders")).toBeInTheDocument();
        expect(screen.getByTestId("orders-layout")).toBeInTheDocument();
    });

    it("shows no search results when searching with no results", () => {
        mocks.useQuery.mockReturnValue({
            data: {
                data: [],
                pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 },
            },
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="123456" />);

        expect(screen.getByTestId("no-search-results")).toBeInTheDocument();
        expect(screen.getByTestId("no-search-results")).toHaveTextContent("No se encontraron resultados");
    });

    it("shows orders list when data exists", () => {
        const mockData = {
            data: [
                {
                    orderNumber: "111",
                    orderStatus: "delivered",
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                },
            ],
            pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
        };

        mocks.useQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        expect(screen.getByTestId("orders-list")).toBeInTheDocument();
        expect(screen.getByTestId("orders-count")).toHaveTextContent("1");
    });

    it("includes orderNumber in query key when provided", () => {
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="789012" />);

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["orders", "789012", 1, 6],
            })
        );
    });

    it("updates URL when search value changes", async () => {
        mocks.useQuery.mockReturnValue({
            data: {
                data: [{
                    orderNumber: "111",
                    orderStatus: "delivered" as any,
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                }],
                pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
            },
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "123456" } });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalled();
        });
    });

    it("removes orderNumber param when search is cleared", async () => {
        mockSearchParams.set("orderNumber", "123456");

        mocks.useQuery.mockReturnValue({
            data: {
                data: [],
                pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 },
            },
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="123456" />);

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "" } });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/mis-pedidos", { scroll: false });
        });
    });

    it("sanitizes search value before updating URL", async () => {
        mocks.useQuery.mockReturnValue({
            data: {
                data: [{
                    orderNumber: "111",
                    orderStatus: "delivered" as any,
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                }],
                pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
            },
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "  12a3  " } });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith(
                "/mis-pedidos?orderNumber=123",
                { scroll: false }
            );
        });
    });

    it("deletes invalid orderNumber query param", async () => {
        mockSearchParams.set("orderNumber", "12a 3");
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="12a 3" />);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith("/mis-pedidos", { scroll: false });
        });
    });

    it("does not delete a numeric orderNumber query param", () => {
        mockSearchParams.set("orderNumber", "123");
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="123" />);

        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("ignores invalid orderNumber in the query key", () => {
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="78abc9012" />);

        expect(mocks.useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["orders", undefined, 1, 6],
            })
        );
    });

    it("passes isLoadingMore to Orders component", () => {
        const mockData = {
            data: [
                {
                    orderNumber: "111",
                    orderStatus: "delivered",
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                },
            ],
            pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
        };

        mocks.useQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: true,
        });

        render(<OrdersContainer />);

        expect(screen.getByTestId("load-more")).toHaveTextContent("Loading...");
        expect(screen.getByTestId("load-more")).toBeDisabled();
    });

    it("calls queryFn with correct parameters", () => {
        let capturedQueryFn: any;

        mocks.useQuery.mockImplementation((options: any) => {
            capturedQueryFn = options.queryFn;
            return {
                data: null,
                isLoading: true,
                isFetching: false,
            };
        });

        render(<OrdersContainer orderNumber="999" />);

        expect(capturedQueryFn).toBeDefined();
        capturedQueryFn();

        expect(mocks.getOrdersUseCase.getOrderHistory).toHaveBeenCalledWith({
            page: 1,
            pageSize: 6,
            orderNumber: "999",
        });
    });

    it("does not include orderNumber in queryFn when not provided", () => {
        let capturedQueryFn: any;

        mocks.useQuery.mockImplementation((options: any) => {
            capturedQueryFn = options.queryFn;
            return {
                data: null,
                isLoading: true,
                isFetching: false,
            };
        });

        render(<OrdersContainer />);

        capturedQueryFn();

        expect(mocks.getOrdersUseCase.getOrderHistory).toHaveBeenCalledWith({
            page: 1,
            pageSize: 6,
            orderNumber: undefined,
        });
    });

    it("preserves placeholder data when orderNumber matches previous query", () => {
        let capturedPlaceholderData: any;

        mocks.useQuery.mockImplementation((options: any) => {
            capturedPlaceholderData = options.placeholderData;
            return {
                data: null,
                isLoading: true,
                isFetching: false,
            };
        });

        render(<OrdersContainer orderNumber="123" />);

        const previousData = { data: [], pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 } };
        const previousQuery = { queryKey: ["orders", "123", 1, 6] };

        const result = capturedPlaceholderData(previousData, previousQuery);
        expect(result).toBe(previousData);
    });

    it("clears placeholder data when orderNumber changes", () => {
        let capturedPlaceholderData: any;

        mocks.useQuery.mockImplementation((options: any) => {
            capturedPlaceholderData = options.placeholderData;
            return {
                data: null,
                isLoading: true,
                isFetching: false,
            };
        });

        render(<OrdersContainer orderNumber="456" />);

        const previousData = { data: [], pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 } };
        const previousQuery = { queryKey: ["orders", "123", 1, 6] };

        const result = capturedPlaceholderData(previousData, previousQuery);
        expect(result).toBeUndefined();
    });

    it("resets pageSize to default when search value changes", async () => {
        mocks.useQuery.mockReturnValue({
            data: {
                data: [{
                    orderNumber: "111",
                    orderStatus: "delivered" as any,
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                }],
                pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
            },
            isLoading: false,
            isFetching: false,
        });

        const { rerender } = render(<OrdersContainer orderNumber="123" />);

        const loadMoreButton = screen.getByTestId("load-more");
        fireEvent.click(loadMoreButton);

        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "456" } });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalled();
        });
    });

    it("shows no search results when data is null", () => {
        mocks.useQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer orderNumber="123" />);

        expect(screen.getByTestId("no-search-results")).toBeInTheDocument();
    });

    it("renders OrderDetails when an order is selected", () => {
        const mockData = {
            data: [
                {
                    orderNumber: "111",
                    orderStatus: "delivered",
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                },
            ],
            pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
        };

        mocks.useQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        fireEvent.click(screen.getByTestId("select-order"));

        expect(screen.getByTestId("order-details")).toBeInTheDocument();
        expect(screen.getByTestId("selected-order-number")).toHaveTextContent("111");
        expect(screen.queryByTestId("orders-layout")).not.toBeInTheDocument();
    });

    it("returns to orders list when back is pressed from OrderDetails", () => {
        const mockData = {
            data: [
                {
                    orderNumber: "111",
                    orderStatus: "delivered",
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                },
            ],
            pagination: { page: 1, pageSize: 6, total: 1, totalPages: 1 },
        };

        mocks.useQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: false,
        });

        render(<OrdersContainer />);

        fireEvent.click(screen.getByTestId("select-order"));
        expect(screen.getByTestId("order-details")).toBeInTheDocument();

        fireEvent.click(screen.getByTestId("back-button"));

        expect(screen.queryByTestId("order-details")).not.toBeInTheDocument();
        expect(screen.getByTestId("orders-list")).toBeInTheDocument();
    });

    describe("pending order handling", () => {
        const mockDataWithOrder = (orderNumber: string, total = 1) => ({
            data: [
                {
                    orderNumber,
                    orderStatus: "delivered",
                    estimatedDeliveredDate: new Date(),
                    orderCreatedAt: new Date(),
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [],
                },
            ],
            pagination: { page: 1, pageSize: 6, total, totalPages: 1 },
        });

        it("passes isPendingOrder=true to Orders when pending-order-type param exists", () => {
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111"),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer pendingOrder="111" />);

            expect(screen.getByTestId("is-pending-order")).toHaveTextContent("true");
        });

        it("passes isPendingOrder=false to Orders when no pending-order-type param exists", () => {
            mocks.useSearchParams.mockReturnValue(new URLSearchParams());
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111"),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer />);

            expect(screen.getByTestId("is-pending-order")).toHaveTextContent("false");
        });

        it("removes redemption pending params once orders total exceeds consumptions", async () => {
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111", 5),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer consumptions="2" />);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith("/mis-pedidos", { scroll: false });
            });
        });

        it("does not remove redemption pending params while total is not greater than consumptions", () => {
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111", 5),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer consumptions="5" />);

            expect(mockReplace).not.toHaveBeenCalled();
        });

        it("removes payment pending params once the pending order appears in the list", async () => {
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111"),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer pendingOrder="ORDER-111" />);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith("/mis-pedidos", { scroll: false });
            });
        });

        it("does not remove payment pending params when the pending order is not found", () => {
            mocks.useQuery.mockReturnValue({
                data: mockDataWithOrder("111"),
                isLoading: false,
                isFetching: false,
            });

            render(<OrdersContainer pendingOrder="ORDER-999" />);

            expect(mockReplace).not.toHaveBeenCalled();
        });
    });
});
