import { beforeEach, describe, expect, it } from "vitest";
import {
    generateIdempotencyHash,
    productRedemptionAdapter,
    getConsumptionsAdapter,
} from "@/data/adapters/Order/orderAdapter";
import { ShippingAddress, OrderStatus } from "@/domain/entity/Order/order";

const createOrder = () =>
    ({
        basket: {
            buyerId: "buyer-1",
            items: [
                {
                    id: "points-item",
                    brandName: "Brand A",
                    categoryId: "cat-1",
                    categoryName: "Category A",
                    isAvailability: true,
                    paymentTypes: {
                        points: {
                            currencyId: "PM",
                            amount: 1200,
                        },
                    },
                    productId: "product-1",
                    productType: "PRODUCT",
                    quantity: 1,
                    slug: "product-1",
                    storeId: "store-1",
                    supplierId: "supplier-1",
                    variationId: "variation-1",
                },
                {
                    id: "copayment-item",
                    brandName: "Brand B",
                    categoryId: "cat-2",
                    categoryName: "Category B",
                    isAvailability: true,
                    paymentTypes: {
                        points: {
                            currencyId: "PM",
                            amount: 800,
                        },
                        coin: {
                            currencyId: "USD",
                            amount: 12,
                        },
                    },
                    productId: "product-2",
                    productType: "PRODUCT",
                    quantity: 2,
                    slug: "product-2",
                    storeId: "store-2",
                    supplierId: "supplier-2",
                    variationId: "variation-2",
                },
            ],
        },
        mfaRequest: {
            mfaToken: "token-123",
            mfaCode: "456789",
        },
        customer: {
            firstName: "Jane",
            lastName: "Doe",
            identificationType: "CC",
            identificationNumber: "123",
            email: "jane@example.com",
            phone: "0999999999",
            secondPhone: "0888888888",
            companyName: "",
            city: "Quito",
        },
        shippingAddress: {
            customerReceivingFirstName: "Jane",
            customerReceivingLastName: "Doe",
            customerReceivingEmail: "jane@example.com",
            customerReceivingPhone: "0999999999",
            customerReceivingIdentificationNumber: "123",
            customerReceivingIdentificationType: "CC",
            reference: "House",
            street1: "Main",
            street2: "Second",
            number: "123",
            secondPhone: "0888888888",
            postalCode: "170101",
            country: { name: "Ecuador" },
            state: { name: "Pichincha" },
            city: { name: "Quito" },
            zone: { name: "Centro" },
            alias: "Casa",
            isThirdPartyAddress: false,
        },
        billingAddress: {
            customerReceivingFirstName: "Jane",
            customerReceivingLastName: "Doe",
            customerReceivingEmail: "jane@example.com",
            customerReceivingPhone: "0999999999",
            customerReceivingIdentificationNumber: "123",
            customerReceivingIdentificationType: "CC",
            reference: "Office",
            street1: "Billing",
            street2: "Floor 2",
            number: "99",
            companyName: "ACME",
            secondPhone: "0777777777",
            postalCode: "170102",
            country: { name: "Ecuador" },
            state: { name: "Pichincha" },
            city: { name: "Quito" },
            zone: { name: "Norte" },
            alias: "Trabajo",
            isThirdPartyAddress: true,
        },
    }) as any;

describe("orderAdapter", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/carrito-de-compra");
    });

    it("adapts product redemption payload and sorts copayment items first", () => {
        const adaptedOrder = productRedemptionAdapter(
            createOrder(),
            "kount-session-1",
            "program-1"
        );

        expect(adaptedOrder).toMatchObject({
            buyerId: "buyer-1",
            programId: "program-1",
            sess: "kount-session-1",
            customer: {
                firstName: "Jane",
                lastName: "Doe",
            },
            shippingAddress: {
                country: "Ecuador",
                state: "Pichincha",
                city: "Quito",
                zone: "Centro",
                isThirdPartyAddress: false,
            },
            billingAddress: {
                companyName: "ACME",
                isThirdPartyAddress: true,
            },
            paymentUrl: {
                cancelUrl: window.location.href,
                returnUrl: window.location.href,
            },
            mfaRequest: {
                mfaToken: "token-123",
                mfaCode: "456789",
            },
        });

        expect(adaptedOrder.items).toHaveLength(2);
        expect(adaptedOrder.items.map((item: any) => item.id)).toEqual([
            "copayment-item",
            "points-item",
        ]);
        expect(adaptedOrder.items[0]).toMatchObject({
            paymentMethod: "copayment",
            paymentTypes: {
                points: {
                    amount: 800,
                },
                coin: {
                    amount: 12,
                },
            },
            comments: "",
            variationInfo: null,
        });
        expect(adaptedOrder.items[1]).toMatchObject({
            paymentMethod: "points",
            paymentTypes: {
                points: {
                    amount: 1200,
                },
            },
        });
    });

    it("uses the customer email when the shipping address has no email", () => {
        const order = createOrder()
        order.shippingAddress.customerReceivingEmail = ""
        order.shippingAddress.isThirdPartyAddress = true

        const adaptedOrder = productRedemptionAdapter(order, "kount-session-1", "program-1")

        expect(adaptedOrder.shippingAddress.customerReceivingEmail).toBe("jane@example.com")
        expect(adaptedOrder.shippingAddress.isThirdPartyAddress).toBe(true)
    })

    it("generates a stable lowercase idempotency hash", () => {
        const hash = generateIdempotencyHash({ orderId: "1", amount: 12 }, "program-1");

        expect(hash).toMatch(/^[a-f0-9]{32}$/);
        expect(hash).toBe(generateIdempotencyHash({ orderId: "1", amount: 12 }, "program-1"));
        expect(hash).not.toBe(
            generateIdempotencyHash({ orderId: "1", amount: 12 }, "program-2")
        );
    });

    it("does not include mfaRequest when not provided", () => {
        const orderWithoutMfa = createOrder();
        delete orderWithoutMfa.mfaRequest;

        const adaptedOrder = productRedemptionAdapter(
            orderWithoutMfa,
            "kount-session-1",
            "program-1"
        );

        expect(adaptedOrder.mfaRequest).toBeUndefined();
    });

    it("handles null companyName in billingAddress", () => {
        const orderWithNullCompany = createOrder();
        orderWithNullCompany.billingAddress.companyName = null as any;

        const adaptedOrder = productRedemptionAdapter(
            orderWithNullCompany,
            "kount-session-1",
            "program-1"
        );

        expect(adaptedOrder.billingAddress.companyName).toBe("");
    });

    it("sorts items with all copayment items first", () => {
        const order = createOrder();
        order.basket.items = [
            {
                ...order.basket.items[0],
                id: "points-1",
                paymentTypes: {
                    points: { currencyId: "PM", amount: 100 },
                },
            },
            {
                ...order.basket.items[1],
                id: "copay-1",
                paymentTypes: {
                    points: { currencyId: "PM", amount: 200 },
                    coin: { currencyId: "USD", amount: 10 },
                },
            },
            {
                ...order.basket.items[0],
                id: "points-2",
                paymentTypes: {
                    points: { currencyId: "PM", amount: 300 },
                },
            },
            {
                ...order.basket.items[1],
                id: "copay-2",
                paymentTypes: {
                    points: { currencyId: "PM", amount: 400 },
                    coin: { currencyId: "USD", amount: 20 },
                },
            },
        ];

        const adaptedOrder = productRedemptionAdapter(
            order,
            "kount-session-1",
            "program-1"
        );

        expect(adaptedOrder.items.map((item: any) => item.id)).toEqual([
            "copay-1",
            "copay-2",
            "points-1",
            "points-2",
        ]);
    });
});

describe("getConsumptionsAdapter", () => {
    it("transforms API response with correct pagination calculation", () => {
        const apiResponse = {
            entities: [
                {
                    estimatedDeliveredDate: "2024-01-15T00:00:00Z",
                    orderCreatedAt: "2024-01-10T10:30:00Z",
                    orderNumber: 123456,
                    orderStatus: "delivered",
                    totalCoins: 50,
                    totalPoints: 1000,
                    shippingDetails: [
                        {
                            guidNumber: "GUID-001",
                            shippingStatus: "delivered",
                            isOwnDelivery: true,
                            orderLines: [
                                {
                                    productImageUrl: "https://example.com/desktop.jpg",
                                    mobileImageUrl: "https://example.com/mobile.jpg",
                                    productName: "Product A",
                                    totalCoins: 25,
                                    totalPoints: 500,
                                    quantity: 1,
                                }
                            ],
                            courierStatus: [
                                {
                                    status: "pending",
                                    date: "2024-01-11T00:00:00Z",
                                },
                                {
                                    status: "delivered",
                                    date: "2024-01-15T00:00:00Z",
                                }
                            ]
                        }
                    ]
                }
            ],
            pagination: {
                page: 0,
                total: 25
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 10);

        expect(result.pagination).toEqual({
            page: 1,
            pageSize: 10,
            total: 25,
            totalPages: 3
        });
        expect(result.data).toHaveLength(1);
    });

    it("adapts order entity with date parsing and type conversions", () => {
        const apiResponse = {
            entities: [
                {
                    estimatedDeliveredDate: "2024-02-20T00:00:00Z",
                    orderCreatedAt: "2024-02-15T14:30:00Z",
                    orderNumber: 789012,
                    orderStatus: "approved",
                    totalCoins: 100,
                    totalPoints: 2000,
                    shippingDetails: []
                }
            ],
            pagination: {
                page: 2,
                total: 50
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 20);

        expect(result.data[0]).toMatchObject({
            orderNumber: "789012",
            orderStatus: "approved",
            totalCoins: 100,
            totalPoints: 2000
        });
        expect(result.data[0].estimatedDeliveredDate).toBeInstanceOf(Date);
        expect(result.data[0].orderCreatedAt).toBeInstanceOf(Date);
        expect(result.data[0].estimatedDeliveredDate.toISOString()).toBe("2024-02-20T00:00:00.000Z");
        expect(result.data[0].orderCreatedAt.toISOString()).toBe("2024-02-15T14:30:00.000Z");
    });

    it("adapts shipping details with order lines and tracking", () => {
        const apiResponse = {
            entities: [
                {
                    estimatedDeliveredDate: "2024-03-01T00:00:00Z",
                    orderCreatedAt: "2024-02-25T00:00:00Z",
                    orderNumber: 111222,
                    orderStatus: "pending",
                    totalCoins: 0,
                    totalPoints: 1500,
                    shippingDetails: [
                        {
                            guidNumber: "GUID-123",
                            shippingStatus: "waitingtosend",
                            isOwnDelivery: false,
                            orderLines: [
                                {
                                    productImageUrl: "https://example.com/product1-desktop.jpg",
                                    mobileImageUrl: "https://example.com/product1-mobile.jpg",
                                    productName: "Product 1",
                                    totalCoins: 0,
                                    totalPoints: 750,
                                    quantity: 2,
                                },
                                {
                                    productImageUrl: "https://example.com/product2-desktop.jpg",
                                    mobileImageUrl: "https://example.com/product2-mobile.jpg",
                                    productName: "Product 2",
                                    totalCoins: 0,
                                    totalPoints: 750,
                                    quantity: 1,
                                }
                            ],
                            courierStatus: [
                                {
                                    status: "pending",
                                    date: "2024-02-26T00:00:00Z",
                                }
                            ]
                        }
                    ]
                }
            ],
            pagination: {
                page: 0,
                total: 1
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 10);

        expect(result.data[0].shippingDetails).toHaveLength(1);
        expect(result.data[0].shippingDetails[0]).toMatchObject({
            guidNumber: "GUID-123",
            shippingStatus: "waitingtosend",
            isOwnDelivery: false
        });
        expect(result.data[0].shippingDetails[0].orderLines).toHaveLength(2);
        expect(result.data[0].shippingDetails[0].orderLines[0]).toEqual({
            image: {
                desktopUrl: "https://example.com/product1-desktop.jpg",
                mobileUrl: "https://example.com/product1-mobile.jpg"
            },
            productName: "Product 1",
            totalCoins: 0,
            totalPoints: 750,
            quantity: 2
        });
        expect(result.data[0].shippingDetails[0].tracking).toHaveLength(1);
        expect(result.data[0].shippingDetails[0].tracking[0].status).toBe("pending");
        expect(result.data[0].shippingDetails[0].tracking[0].trackingDate).toBeInstanceOf(Date);
    });

    it("handles empty entities array", () => {
        const apiResponse = {
            entities: [],
            pagination: {
                page: 0,
                total: 0
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 10);

        expect(result.data).toEqual([]);
        expect(result.pagination).toEqual({
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0
        });
    });

    it("calculates totalPages correctly for various pageSize values", () => {
        const apiResponse = {
            entities: [],
            pagination: {
                page: 0,
                total: 25
            }
        };

        expect(getConsumptionsAdapter(apiResponse, 10).pagination.totalPages).toBe(3);
        expect(getConsumptionsAdapter(apiResponse, 12).pagination.totalPages).toBe(3);
        expect(getConsumptionsAdapter(apiResponse, 20).pagination.totalPages).toBe(2);
        expect(getConsumptionsAdapter(apiResponse, 25).pagination.totalPages).toBe(1);
        expect(getConsumptionsAdapter(apiResponse, 30).pagination.totalPages).toBe(1);
    });

    it("increments page number from 0-indexed to 1-indexed", () => {
        const apiResponse = {
            entities: [],
            pagination: {
                page: 0,
                total: 10
            }
        };

        expect(getConsumptionsAdapter(apiResponse, 10).pagination.page).toBe(1);

        apiResponse.pagination.page = 2;
        expect(getConsumptionsAdapter(apiResponse, 10).pagination.page).toBe(3);

        apiResponse.pagination.page = 5;
        expect(getConsumptionsAdapter(apiResponse, 10).pagination.page).toBe(6);
    });

    it("handles multiple shipping details with mixed delivery types", () => {
        const apiResponse = {
            entities: [
                {
                    estimatedDeliveredDate: "2024-04-01T00:00:00Z",
                    orderCreatedAt: "2024-03-25T00:00:00Z",
                    orderNumber: 333444,
                    orderStatus: "delivered",
                    totalCoins: 150,
                    totalPoints: 3000,
                    shippingDetails: [
                        {
                            guidNumber: "GUID-OWN",
                            shippingStatus: "delivered",
                            isOwnDelivery: true,
                            orderLines: [
                                {
                                    productImageUrl: "https://example.com/own.jpg",
                                    mobileImageUrl: "https://example.com/own-mobile.jpg",
                                    productName: "Own Delivery Product",
                                    totalCoins: 50,
                                    totalPoints: 1000,
                                    quantity: 1,
                                }
                            ],
                            courierStatus: []
                        },
                        {
                            guidNumber: "GUID-THIRD",
                            shippingStatus: "delivered",
                            isOwnDelivery: false,
                            orderLines: [
                                {
                                    productImageUrl: "https://example.com/third.jpg",
                                    mobileImageUrl: "https://example.com/third-mobile.jpg",
                                    productName: "Third Party Product",
                                    totalCoins: 100,
                                    totalPoints: 2000,
                                    quantity: 1,
                                }
                            ],
                            courierStatus: [
                                {
                                    status: "delivered",
                                    date: "2024-04-01T00:00:00Z",
                                }
                            ]
                        }
                    ]
                }
            ],
            pagination: {
                page: 0,
                total: 1
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 10);

        expect(result.data[0].shippingDetails).toHaveLength(2);
        expect(result.data[0].shippingDetails[0].isOwnDelivery).toBe(true);
        expect(result.data[0].shippingDetails[1].isOwnDelivery).toBe(false);
        expect(result.data[0].shippingDetails[0].tracking).toHaveLength(0);
        expect(result.data[0].shippingDetails[1].tracking).toHaveLength(1);
    });

    it("sorts orders by creation date descending", () => {
        const apiResponse = {
            entities: [
                {
                    estimatedDeliveredDate: "2024-01-10T00:00:00Z",
                    orderCreatedAt: "2024-01-01T00:00:00Z",
                    orderNumber: 111,
                    orderStatus: OrderStatus.DELIVERED,
                    totalCoins: 0,
                    totalPoints: 100,
                    shippingDetails: [],
                    shippingAddress: {} as unknown as ShippingAddress
                },
                {
                    estimatedDeliveredDate: "2024-01-10T00:00:00Z",
                    orderCreatedAt: "2024-01-15T00:00:00Z",
                    orderNumber: 222,
                    orderStatus: OrderStatus.DELIVERED,
                    totalCoins: 0,
                    totalPoints: 100,
                    shippingDetails: [],
                    shippingAddress: {} as unknown as ShippingAddress
                },
                {
                    estimatedDeliveredDate: "2024-01-10T00:00:00Z",
                    orderCreatedAt: "2024-01-10T00:00:00Z",
                    orderNumber: 333,
                    orderStatus: OrderStatus.DELIVERED,
                    totalCoins: 0,
                    totalPoints: 100,
                    shippingDetails: [],
                    shippingAddress: {} as unknown as ShippingAddress
                }
            ],
            pagination: {
                page: 0,
                total: 3
            }
        };

        const result = getConsumptionsAdapter(apiResponse, 10);

        expect(result.data.map((o) => o.orderNumber)).toEqual(["222", "333", "111"]);
    });
});
