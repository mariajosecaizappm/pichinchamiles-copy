"use client"

import { List } from "@/domain/entity/List/list";
import { Order } from "@/domain/entity/Order/order";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetOrdersUseCase from "@/domain/interactors/Order/GetOrdersUseCase";
import container from "@/presentation/config/inversify.config";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import EmptyOrders, { NoOrdersSearchResults } from "./components/EmptyOrders";
import OrdersLayout from "./components/Layout";
import OrderListSkeleton from "./components/Layout/Skeleton/OrderListSkeleton";
import OrderDetails from "./components/OrderDetails";
import Orders from "./Orders";
import { CONSUMPTIONS_PARAM, PENDING_ORDER_PARAM, sanitizeOrderNumber } from "./OrdersConfig";

type Props = {
    orderNumber?: string;
    consumptions?: string;
    pendingOrder?: string;
}
const DEFAULT_PAGE_SIZE = 6

const OrdersContainer = ({ orderNumber, consumptions, pendingOrder }: Props) => {
    const ordersUseCase = container.get<GetOrdersUseCase>(UseCaseTypes.GetOrdersUseCase);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1)
    const [allOrders, setAllOrders] = useState<List<Order> | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isClearingSearch, startClearSearchTransition] = useTransition();
    const isPendingOrder = !!consumptions || !!pendingOrder;
    const sanitizedOrderNumber = sanitizeOrderNumber(orderNumber || "");
    const isValidOrderNumber = !!orderNumber && orderNumber === sanitizedOrderNumber;
    const searchOrderNumber = isValidOrderNumber ? sanitizedOrderNumber : undefined;

    const handleSearch = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const normalizedValue = sanitizeOrderNumber(value);

        if (normalizedValue !== sanitizedOrderNumber) {
            setPage(1);
        }

        if (normalizedValue) {
            params.set("orderNumber", normalizedValue);
        } else {
            params.delete("orderNumber");
        }

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [sanitizedOrderNumber, pathname, router, searchParams]);

    const handleCleanSearch = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("orderNumber");
        const query = params.toString();

        startClearSearchTransition(() => {
            setPage(1);
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        });
    }, [searchParams, pathname, router]);

    const { data: orders, isLoading, isFetching } = useQuery({
        queryKey: ['orders', searchOrderNumber, page, DEFAULT_PAGE_SIZE],
        queryFn: () => ordersUseCase.getOrderHistory({
            page: page,
            pageSize: DEFAULT_PAGE_SIZE,
            orderNumber: searchOrderNumber
        }),
        placeholderData: (previousData, previousQuery) => (
            previousQuery?.queryKey[1] === searchOrderNumber ? previousData : undefined
        ),
    })

    const displayOrders = useMemo(() => {
        if (!orders) return allOrders

        if (orders.pagination.page === 1) return orders

        if (allOrders && orders.pagination.page > allOrders.pagination.page) {
            return {
                ...orders,
                data: [...allOrders.data, ...orders.data],
            }
        }

        return allOrders || orders
    }, [orders, allOrders])

    useEffect(() => {
        if (!orders || isFetching) return

        if (orders.pagination.page === 1) {
            setAllOrders(orders)
            return
        }

        setAllOrders(prev => {
            if (prev && orders.pagination.page > prev.pagination.page) {
                return {
                    ...orders,
                    data: [...prev.data, ...orders.data],
                }
            }
            return prev
        })
    }, [orders, isFetching])



    const deleteParams = useCallback((...keys: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        keys.forEach(key => params.delete(key));
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [searchParams, pathname, router]);

    useEffect(() => {
        if (consumptions) {
            const isOrderLoaded = parseInt(consumptions) < (orders?.pagination.total || 0);
            if (isOrderLoaded) {
                deleteParams(CONSUMPTIONS_PARAM);
            }
        }

    }, [consumptions, orders, deleteParams]);

    useEffect(() => {
        if (pendingOrder) {
            const orderExists = orders?.data.some(order => order.orderNumber === pendingOrder.split("-")[1]);
            if (orderExists) {
                deleteParams(PENDING_ORDER_PARAM);
            }
        }
    }, [pendingOrder, orders, deleteParams]);

    useEffect(() => {
        if (!orderNumber || isValidOrderNumber) return
        deleteParams("orderNumber")
    }, [orderNumber, isValidOrderNumber, deleteParams]);

    if (selectedOrder) {
        return (
            <OrderDetails order={selectedOrder} onPressBack={() => setSelectedOrder(null)} />
        )
    }

    let content;

    if (isLoading) {
        content = <OrderListSkeleton />;
    } else if (!displayOrders || displayOrders.pagination.total === 0) {
        if (searchOrderNumber) {
            content = (
                <NoOrdersSearchResults />
            );
        } else {
            content = <EmptyOrders />;
        }
    } else {
        content = <Orders orders={displayOrders} isLoadingMore={isFetching} onLoadMore={() => {
            setPage(prev => prev + 1);
        }} onSelectOrder={setSelectedOrder} isPendingOrder={isPendingOrder} />;
    }

    return (
        <OrdersLayout
            orderNumber={searchOrderNumber || ""}
            onSearch={handleSearch}
            onClearSearch={handleCleanSearch}
            isClearingSearch={isClearingSearch}
        >
            {content}
        </OrdersLayout>
    )
}

export default OrdersContainer