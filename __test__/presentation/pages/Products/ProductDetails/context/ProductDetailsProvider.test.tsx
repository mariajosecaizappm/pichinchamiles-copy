import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ProductDetailsProvider from "@/presentation/pages/Products/ProductDetails/context/ProductDetailsProvider"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import { ProductVariation } from "@/domain/entity/Product/product"
import { DiscountStatus } from "@/domain/entity/Product/variation"
import { EventName } from "@/presentation/analytics/types"

const activeDiscountFields = {
    discountStatus: DiscountStatus.ACTIVE,
    discountValue: 20,
    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
}

const mocks = vi.hoisted(() => {
    const addProduct = vi.fn()
    return {
        addProduct,
        push: vi.fn(),
        track: vi.fn(),
        containerGet: vi.fn(() => ({
            addProduct,
        })),
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: vi.fn(() => ({
        member: { id: "member-1" },
        balance: { points: 1000, coins: 100 },
        updateBasket: vi.fn(),
        programCurrency: null,
    })),
}))

vi.mock("@/presentation/hooks/useSnackbar", () => ({
    default: vi.fn(() => ({
        addSnackbar: vi.fn(),
    })),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: vi.fn(() => ({
        track: mocks.track,
    })),
}))

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({
        children,
        onPress,
        ...props
    }: {
        children: React.ReactNode
        onPress?: () => void
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onPress} {...props}>
            {children}
        </button>
    ),
}))

vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query")
    return {
        ...actual,
        useQuery: vi.fn(() => ({ data: null, isLoading: false })),
    }
})

const mockProductVariation: ProductVariation = {
    product: {
        id: "prod-1",
        name: "Test Product",
        assets: [
            { id: "asset-1", desktopUrl: "http://example.com/1.jpg", type: "image", order: 1 },
            { id: "asset-2", desktopUrl: "http://example.com/2.jpg", type: "image", order: 2 },
        ],
        tags: [],
    },
    variations: [
        {
            id: "var-1",
            pointsPrice: 500,
            features: [{ name: "Color", option: "Red" }],
            assets: [],
            tags: [],
            copayment: null,
        },
        {
            id: "var-2",
            pointsPrice: 600,
            features: [{ name: "Color", option: "Blue" }],
            assets: [],
            tags: [],
            copayment: null,
        },
    ],
} as unknown as ProductVariation

const TestComponent = () => {
    const context = useProductDetailsContext()
    return (
        <div>
            <div data-testid="variation-id">{context.variation?.id || "no-variation"}</div>
            <div data-testid="isLoading">{context.isLoading ? "loading" : "not-loading"}</div>
            <div data-testid="pointsPrice">{context.pointsPrice}</div>
        </div>
    )
}

describe("ProductDetailsProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.addProduct.mockResolvedValue({ buyerId: "b", items: [] })
        mocks.containerGet.mockImplementation(() => ({
            addProduct: mocks.addProduct,
        }))
    })

    it("should initialize with first variation", () => {
        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should initialize with default values", () => {
        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("isLoading").textContent).toBe("not-loading")
    })

    it("should update selected features", () => {
        const TestFeatureComponent = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="features-count">{context.selectedFeatures.length}</div>
                    <button onClick={() => context.setSelectedFeatures([{ name: "Color", option: "Red" }])}>
                        Set Feature
                    </button>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestFeatureComponent />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByText("Set Feature"))

        expect(screen.getByTestId("features-count").textContent).toBe("1")
    })

    it("should provide addProductToCart function", () => {
        const TestCartComponent = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="has-add-to-cart">
                        {typeof context.addProductToCart === "function" ? "yes" : "no"}
                    </div>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCartComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-add-to-cart").textContent).toBe("yes")
    })

    it("should calculate pointsPrice from variation", () => {
        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("pointsPrice").textContent).toBe("500")
    })

    it("should expose hasDiscount as true for active variation discount", () => {
        const productWithDiscount = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                },
            ],
        } as unknown as ProductVariation

        const HasDiscountComponent = () => {
            const { hasDiscount } = useProductDetailsContext()
            return <div data-testid="has-discount">{hasDiscount ? "yes" : "no"}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithDiscount}>
                <HasDiscountComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-discount").textContent).toBe("yes")
    })

    it("sets variation to null when selected features match no variation", async () => {
        const FeatureMismatch = () => {
            const { variation, setSelectedFeatures } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="variation-id">{variation?.id ?? "none"}</div>
                    <button
                        onClick={() =>
                            setSelectedFeatures([{ name: "Color", option: "Green" }])
                        }
                    >
                        Select Green
                    </button>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <FeatureMismatch />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
        fireEvent.click(screen.getByText("Select Green"))
        await waitFor(() => {
            expect(screen.getByTestId("variation-id").textContent).toBe("none")
        })
    })

    it("returns hasDiscount false when variation is null", async () => {
        const noVariations = {
            ...mockProductVariation,
            variations: [],
        } as unknown as ProductVariation

        const Comp = () => {
            const { hasDiscount } = useProductDetailsContext()
            return <div data-testid="has-discount">{hasDiscount ? "yes" : "no"}</div>
        }

        render(
            <ProductDetailsProvider productVariation={noVariations}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-discount").textContent).toBe("no")
    })

    it("returns hasDiscount false when discountValue is missing", () => {
        const product = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    discountStatus: DiscountStatus.ACTIVE,
                    discountValue: null,
                    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
                },
            ],
        } as unknown as ProductVariation

        const Comp = () => {
            const { hasDiscount } = useProductDetailsContext()
            return <div data-testid="has-discount">{hasDiscount ? "yes" : "no"}</div>
        }

        render(
            <ProductDetailsProvider productVariation={product}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-discount").textContent).toBe("no")
    })

    it("sorts assets when higher order comes first", () => {
        const product = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                assets: [
                    {
                        id: "a2",
                        desktopUrl: "http://example.com/2.jpg",
                        type: "image",
                        order: 2,
                    },
                    {
                        id: "a1",
                        desktopUrl: "http://example.com/1.jpg",
                        type: "image",
                        order: 1,
                    },
                ],
            },
            variations: [{ ...mockProductVariation.variations[0], assets: [] }],
        } as unknown as ProductVariation

        const Comp = () => {
            const { assets } = useProductDetailsContext()
            return (
                <div>
                    {assets.map((a, i) => (
                        <div key={a.id} data-testid={`asset-${i}-id`}>
                            {a.id}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={product}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("asset-0-id").textContent).toBe("a1")
        expect(screen.getByTestId("asset-1-id").textContent).toBe("a2")
    })

    it("does not prepend discount tag when tag colors are incomplete", () => {
        const product = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                    discountTag: "20% OFF",
                    discountTagBackgroundColor: null,
                    discountTagTextColor: null,
                    tags: [{ tag: "Sale", backgroundColor: "#00FF00", textColor: "#000" }],
                },
            ],
        } as unknown as ProductVariation

        const Comp = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    <div data-testid="tag-0">{tags[0]?.tag}</div>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={product}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("1")
        expect(screen.getByTestId("tag-0").textContent).toBe("Sale")
    })

    it("returns null tags when variation tags empty and has variations", () => {
        const product = {
            ...mockProductVariation,
            product: { ...mockProductVariation.product, tags: [] },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        const Comp = () => {
            const { tags } = useProductDetailsContext()
            return <div data-testid="tags-count">{tags.length}</div>
        }

        render(
            <ProductDetailsProvider productVariation={product}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("0")
    })

    it("calls error snackbar when programCurrency is null", async () => {
        const { default: useSnackbar } = await import(
            "@/presentation/hooks/useSnackbar"
        )
        const { default: useSession } = await import(
            "@/presentation/hooks/useSession"
        )
        const mockAddSnackbar = vi.fn()
        vi.mocked(useSnackbar).mockReturnValue({ addSnackbar: mockAddSnackbar })
        vi.mocked(useSession).mockReturnValue({
            updateBasket: vi.fn(),
            programCurrency: null,
        } as unknown as ReturnType<typeof useSession>)

        const TestCart = () => {
            const context = useProductDetailsContext()
            return (
                <button
                    onClick={() =>
                        context.addProductToCart({
                            quantity: 1,
                            points: 500,
                            coins: 0,
                            paymentType: "POINTS" as never,
                        })
                    }
                >
                    Add
                </button>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCart />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByText("Add"))
        await waitFor(() => {
            expect(mockAddSnackbar).toHaveBeenCalled()
        })
    })

    it("exposes hasVariants false when no variations", () => {
        const product = {
            ...mockProductVariation,
            variations: [],
        } as unknown as ProductVariation

        const Comp = () => {
            const { hasVariants } = useProductDetailsContext()
            return (
                <div data-testid="has-variants">{hasVariants ? "yes" : "no"}</div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={product}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-variants").textContent).toBe("no")
    })

    it("exposes hasVariants true when variations exist", () => {
        const Comp = () => {
            const { hasVariants } = useProductDetailsContext()
            return (
                <div data-testid="has-variants">{hasVariants ? "yes" : "no"}</div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <Comp />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-variants").textContent).toBe("yes")
    })

    it("syncs selectedFeatures from variation features on init", async () => {
        const Comp = () => {
            const { selectedFeatures } = useProductDetailsContext()
            return (
                <div data-testid="feature-0">
                    {selectedFeatures[0]
                        ? `${selectedFeatures[0].name}:${selectedFeatures[0].option}`
                        : "none"}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <Comp />
            </ProductDetailsProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("feature-0").textContent).toBe("Color:Red")
        })
    })

    it("should expose hasDiscount as false for expired discount", () => {
        const productWithExpiredDiscount = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    discountStatus: DiscountStatus.ACTIVE,
                    discountValue: 20,
                    discountValidTo: new Date(Date.now() - 86400000).toISOString(),
                },
            ],
        } as unknown as ProductVariation

        const HasDiscountComponent = () => {
            const { hasDiscount } = useProductDetailsContext()
            return <div data-testid="has-discount">{hasDiscount ? "yes" : "no"}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithExpiredDiscount}>
                <HasDiscountComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-discount").textContent).toBe("no")
    })

    it("should expose hasDiscount as false when discount is inactive", () => {
        const productWithInactiveDiscount = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    discountStatus: DiscountStatus.INACTIVE,
                    discountValue: 20,
                    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
                },
            ],
        } as unknown as ProductVariation

        const HasDiscountComponent = () => {
            const { hasDiscount } = useProductDetailsContext()
            return <div data-testid="has-discount">{hasDiscount ? "yes" : "no"}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithInactiveDiscount}>
                <HasDiscountComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-discount").textContent).toBe("no")
    })

    it("should handle product with no variations", () => {
        const noVariationsProduct = {
            ...mockProductVariation,
            variations: [],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={noVariationsProduct}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("no-variation")
    })

    it("should handle variation with discount tags", () => {
        const productWithDiscount = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                    discountTag: "20% OFF",
                    discountTagBackgroundColor: "#FF0000",
                    discountTagTextColor: "#FFFFFF",
                    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
                    tags: [{ tag: "Sale", backgroundColor: "#00FF00", textColor: "#000000" }],
                },
            ],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithDiscount}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should handle expired discount", () => {
        const productWithExpiredDiscount = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                    discountTag: "20% OFF",
                    discountTagBackgroundColor: "#FF0000",
                    discountTagTextColor: "#FFFFFF",
                    discountValidTo: new Date(Date.now() - 86400000).toISOString(),
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithExpiredDiscount}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should handle variation with video assets", () => {
        const productWithVideo = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                assets: [
                    { id: "asset-1", desktopUrl: "http://example.com/1.jpg", type: "image", order: 1 },
                    { id: "video-1", desktopUrl: "http://example.com/video.mp4", type: "video", order: 2 },
                ],
            },
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithVideo}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should use product assets when variation has no assets", () => {
        const productWithVariationAssets = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    assets: [],
                },
            ],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithVariationAssets}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should handle product with only tags (no variation tags)", () => {
        const productWithProductTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [{ tag: "New", backgroundColor: "#0000FF", textColor: "#FFFFFF" }],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithProductTags}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should handle product variation changes", () => {
        const { rerender } = render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        const differentVariation = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    id: "var-different",
                    features: [{ name: "Size", option: "Large" }],
                },
            ],
        } as unknown as ProductVariation

        rerender(
            <ProductDetailsProvider productVariation={differentVariation}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id")).toBeInTheDocument()
    })

    it("should handle null discountValidTo", () => {
        const productWithNullDiscountDate = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    discountTag: "10% OFF",
                    discountTagBackgroundColor: "#FF0000",
                    discountTagTextColor: "#FFFFFF",
                    discountValidTo: null,
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={productWithNullDiscountDate}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
    })

    it("should provide setSelectedFeatures function", () => {
        const TestComponentWithFeatureSelection = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="has-setter">
                        {typeof context.setSelectedFeatures === "function" ? "yes" : "no"}
                    </div>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponentWithFeatureSelection />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-setter").textContent).toBe("yes")
    })

    it("should provide selectedFeatures in context", () => {
        const TestComponentWithFeatures = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="has-features">
                        {Array.isArray(context.selectedFeatures) ? "yes" : "no"}
                    </div>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestComponentWithFeatures />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-features").textContent).toBe("yes")
    })

    it("should expose tags from variation in context", () => {
        const productWithTags = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [{ tag: "Hot", backgroundColor: "#FF0000", textColor: "#FFFFFF" }],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return <div data-testid="tags-count">{tags.length}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("1")
    })

    it("should provide minCopaymentPoints as 0 when variation has no copayment", () => {
        const TestCopayment = () => {
            const context = useProductDetailsContext()
            return <div data-testid="min-copayment">{context.minCopaymentPoints}</div>
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCopayment />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("min-copayment").textContent).toBe("0")
    })

    it("should provide minCopaymentPoints from variation copayment", () => {
        const productWithCopayment = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    copayment: { minimumPointsValue: 200 },
                },
            ],
        } as unknown as ProductVariation

        const TestCopayment = () => {
            const context = useProductDetailsContext()
            return <div data-testid="min-copayment">{context.minCopaymentPoints}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithCopayment}>
                <TestCopayment />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("min-copayment").textContent).toBe("200")
    })

    it("should provide assets from product when variation has no assets", () => {
        const TestAssets = () => {
            const context = useProductDetailsContext()
            return <div data-testid="assets-count">{context.assets.length}</div>
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestAssets />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("assets-count").textContent).toBe("2")
    })

    it("should provide setVariation function", () => {
        const TestSetVariation = () => {
            const context = useProductDetailsContext()
            return (
                <div data-testid="has-set-variation">
                    {typeof context.setVariation === "function" ? "yes" : "no"}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestSetVariation />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("has-set-variation").textContent).toBe("yes")
    })

    it("should switch variation when selected features change", async () => {
        const FeatureSwitchComponent = () => {
            const { variation, setSelectedFeatures } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="variation-id">{variation?.id ?? "none"}</div>
                    <button
                        onClick={() => setSelectedFeatures([{ name: "Color", option: "Blue" }])}
                    >
                        Select Blue
                    </button>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <FeatureSwitchComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("variation-id").textContent).toBe("var-1")
        fireEvent.click(screen.getByText("Select Blue"))
        await waitFor(() => {
            expect(screen.getByTestId("variation-id").textContent).toBe("var-2")
        })
    })

    it("should call addSnackbar with error when variation is null on addProductToCart", async () => {
        const { default: useSnackbar } = await import("@/presentation/hooks/useSnackbar")
        const mockAddSnackbar = vi.fn()
        vi.mocked(useSnackbar).mockReturnValue({ addSnackbar: mockAddSnackbar })

        const noVariationsProduct = {
            ...mockProductVariation,
            variations: [],
        } as unknown as ProductVariation

        const TestCart = () => {
            const context = useProductDetailsContext()
            return (
                <button
                    onClick={() =>
                        context.addProductToCart({
                            quantity: 1,
                            points: 500,
                            coins: 0,
                            paymentType: "POINTS" as never,
                        })
                    }
                >
                    Add
                </button>
            )
        }

        render(
            <ProductDetailsProvider productVariation={noVariationsProduct}>
                <TestCart />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByText("Add"))
        await vi.waitFor(() => {
            expect(mockAddSnackbar).toHaveBeenCalled()
        })

        const close = vi.fn()
        const footer = mockAddSnackbar.mock.calls[0][0].footer as (close: () => void) => React.ReactElement
        const { unmount } = render(<>{footer(close)}</>)

        fireEvent.click(screen.getByText("Entendido"))
        expect(close).toHaveBeenCalledTimes(1)
        unmount()
    })

    it("should use variation assets when variation has assets", () => {
        const productWithVariationAssets = {
            ...mockProductVariation,
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    assets: [
                        {
                            id: "var-asset-1",
                            desktopUrl: "http://example.com/var.jpg",
                            type: "image",
                            order: 1,
                        },
                    ],
                },
            ],
        } as unknown as ProductVariation

        const TestAssets = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="assets-count">{context.assets.length}</div>
                    <div data-testid="first-asset-url">{context.assets[0]?.desktopUrl}</div>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithVariationAssets}>
                <TestAssets />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("assets-count").textContent).toBe("1")
        expect(screen.getByTestId("first-asset-url").textContent).toBe("http://example.com/var.jpg")
    })

    it("should sort assets by order with video appended at end", () => {
        const productWithMixedAssets = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                assets: [
                    { id: "v1", desktopUrl: "http://example.com/video.mp4", type: "video", order: 1 },
                    { id: "a1", desktopUrl: "http://example.com/img2.jpg", type: "image", order: 2 },
                    { id: "a2", desktopUrl: "http://example.com/img1.jpg", type: "image", order: 1 },
                ],
            },
            variations: [{ ...mockProductVariation.variations[0], assets: [] }],
        } as unknown as ProductVariation

        const TestAssets = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    {context.assets.map((a, i) => (
                        <div key={i} data-testid={`asset-${i}-type`}>
                            {a.type}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithMixedAssets}>
                <TestAssets />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("asset-2-type").textContent).toBe("video")
    })

    it("should fall back pointsPrice to product.minPointsPrice when variation is null", () => {
        const noVariationsProduct = {
            ...mockProductVariation,
            product: { ...mockProductVariation.product, minPointsPrice: 750 },
            variations: [],
        } as unknown as ProductVariation

        render(
            <ProductDetailsProvider productVariation={noVariationsProduct}>
                <TestComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("pointsPrice").textContent).toBe("750")
    })

    it("should call addSnackbar with error when addProduct use case throws", async () => {
        const { default: useSnackbar } = await import("@/presentation/hooks/useSnackbar")
        const { default: useSession } = await import("@/presentation/hooks/useSession")
        const mockAddSnackbar = vi.fn()
        vi.mocked(useSnackbar).mockReturnValue({ addSnackbar: mockAddSnackbar })
        vi.mocked(useSession).mockReturnValue({
            updateBasket: vi.fn(),
            programCurrency: { coinsCurrencyId: "coins", pointsCurrencyId: "points" },
        } as unknown as ReturnType<typeof useSession>)

        mocks.addProduct.mockRejectedValue(new Error("Network error"))

        const TestCart = () => {
            const context = useProductDetailsContext()
            return (
                <button
                    onClick={() =>
                        context.addProductToCart({
                            quantity: 1,
                            points: 500,
                            coins: 0,
                            paymentType: "POINTS" as never,
                        })
                    }
                >
                    Add
                </button>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCart />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByText("Add"))
        await vi.waitFor(() => {
            expect(mockAddSnackbar).toHaveBeenCalled()
        })
    })

    it("should call addSnackbar with success when addProduct resolves", async () => {
        const { default: useSnackbar } = await import("@/presentation/hooks/useSnackbar")
        const { default: useSession } = await import("@/presentation/hooks/useSession")
        const mockAddSnackbar = vi.fn()
        const mockUpdateBasket = vi.fn()
        vi.mocked(useSnackbar).mockReturnValue({ addSnackbar: mockAddSnackbar })
        vi.mocked(useSession).mockReturnValue({
            updateBasket: mockUpdateBasket,
            programCurrency: { coinsCurrencyId: "coins", pointsCurrencyId: "points" },
        } as unknown as ReturnType<typeof useSession>)

        mocks.addProduct.mockResolvedValue({ buyerId: "b", items: [] })

        const TestCart = () => {
            const context = useProductDetailsContext()
            return (
                <button
                    onClick={() =>
                        context.addProductToCart({
                            quantity: 1,
                            points: 500,
                            coins: 0,
                            paymentType: "POINTS" as never,
                        })
                    }
                >
                    Add
                </button>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCart />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByText("Add"))
        await vi.waitFor(() => {
            expect(mockAddSnackbar).toHaveBeenCalled()
        })

        const close = vi.fn()
        const footer = mockAddSnackbar.mock.calls[0][0].footer as (close: () => void) => React.ReactElement
        const { unmount } = render(<>{footer(close)}</>)

        fireEvent.click(screen.getByText("Ver carrito"))
        expect(close).toHaveBeenCalledTimes(1)
        expect(mocks.push).toHaveBeenCalledWith("/carrito-de-compra")
        expect(mocks.track).toHaveBeenCalledWith(EventName.GO_TO_CHECKOUT, { category: "" })
        unmount()
    })

    it("should use updated rootCategory in success snackbar footer (rootCategory in useCallback deps)", async () => {
        const { default: useSnackbar } = await import("@/presentation/hooks/useSnackbar")
        const { default: useSession } = await import("@/presentation/hooks/useSession")
        const mockAddSnackbar = vi.fn()
        vi.mocked(useSnackbar).mockReturnValue({ addSnackbar: mockAddSnackbar })
        vi.mocked(useSession).mockReturnValue({
            updateBasket: vi.fn(),
            programCurrency: { coinsCurrencyId: "coins", pointsCurrencyId: "points" },
        } as unknown as ReturnType<typeof useSession>)

        mocks.addProduct.mockResolvedValue({ buyerId: "b", items: [] })

        const TestCart = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    <button
                        data-testid="set-category"
                        onClick={() => context.setRootCategory("Tecnologia")}
                    >
                        Set Category
                    </button>
                    <button
                        data-testid="add-btn"
                        onClick={() =>
                            context.addProductToCart({
                                quantity: 1,
                                points: 500,
                                coins: 0,
                                paymentType: "POINTS" as never,
                            })
                        }
                    >
                        Add
                    </button>
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={mockProductVariation}>
                <TestCart />
            </ProductDetailsProvider>
        )

        fireEvent.click(screen.getByTestId("set-category"))
        fireEvent.click(screen.getByTestId("add-btn"))
        await vi.waitFor(() => {
            expect(mockAddSnackbar).toHaveBeenCalled()
        })

        const close = vi.fn()
        const footer = mockAddSnackbar.mock.calls[0][0].footer as (close: () => void) => React.ReactElement
        const { unmount } = render(<>{footer(close)}</>)

        mocks.track.mockClear()
        fireEvent.click(screen.getByText("Ver carrito"))
        expect(mocks.track).toHaveBeenCalledWith(EventName.GO_TO_CHECKOUT, { category: "Tecnologia" })
        unmount()
    })

    it("should keep equal-order assets stable when sorting", () => {
        const productWithEqualOrderAssets = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                assets: [
                    { id: "a1", desktopUrl: "http://example.com/img1.jpg", type: "image", order: 1 },
                    { id: "a2", desktopUrl: "http://example.com/img2.jpg", type: "image", order: 1 },
                ],
            },
            variations: [{ ...mockProductVariation.variations[0], assets: [] }],
        } as unknown as ProductVariation

        const TestAssets = () => {
            const context = useProductDetailsContext()
            return (
                <div>
                    {context.assets.map((a, i) => (
                        <div key={a.id} data-testid={`asset-${i}-id`}>
                            {a.id}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithEqualOrderAssets}>
                <TestAssets />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("asset-0-id").textContent).toBe("a1")
        expect(screen.getByTestId("asset-1-id").textContent).toBe("a2")
    })

    it("should return only variation tags when product tags are null", () => {
        const productWithNullProductTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: null,
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [{ tag: "Hot", backgroundColor: "#FF0000", textColor: "#FFFFFF" }],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return <div data-testid="tags-count">{tags.length}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithNullProductTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("1")
    })

    it("should remove duplicate tags between variation and product (same tag text)", () => {
        const productWithDuplicateTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [{ tag: "Hot", backgroundColor: "#0000FF", textColor: "#FFFFFF" }],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [{ tag: "Hot", backgroundColor: "#FF0000", textColor: "#FFFFFF" }],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithDuplicateTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("1")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Hot")
    })

    it("should expose only variation tags in context", () => {
        const productWithMixedTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [{ tag: "New", backgroundColor: "#0000FF", textColor: "#FFFFFF" }],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [{ tag: "Hot", backgroundColor: "#FF0000", textColor: "#FFFFFF" }],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithMixedTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("1")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Hot")
    })

    it("should remove duplicate tags within the same variation tags array", () => {
        const productWithDuplicateVariationTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [
                        { tag: "Sale", backgroundColor: "#FF0000", textColor: "#FFFFFF" },
                        { tag: "Sale", backgroundColor: "#00FF00", textColor: "#000000" },
                        { tag: "New", backgroundColor: "#0000FF", textColor: "#FFFFFF" },
                    ],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithDuplicateVariationTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("2")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Sale")
        expect(screen.getByTestId("tag-1-text").textContent).toBe("New")
    })

    it("should not expose product tags when variation tags are empty", () => {
        const productWithDuplicateProductTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [
                    { tag: "Eco", backgroundColor: "#00FF00", textColor: "#000000" },
                    { tag: "Eco", backgroundColor: "#0000FF", textColor: "#FFFFFF" },
                    { tag: "Premium", backgroundColor: "#FFD700", textColor: "#000000" },
                ],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithDuplicateProductTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("0")
    })

    it("should expose product tags when product has no variations", () => {
        const productWithoutVariations = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [
                    { tag: "Eco", backgroundColor: "#00FF00", textColor: "#000000" },
                    { tag: "Premium", backgroundColor: "#FFD700", textColor: "#000000" },
                ],
            },
            variations: [],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithoutVariations}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("2")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Eco")
        expect(screen.getByTestId("tag-1-text").textContent).toBe("Premium")
    })

    it("should deduplicate product tags when product has no variations", () => {
        const productWithoutVariations = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [
                    { tag: "Eco", backgroundColor: "#00FF00", textColor: "#000000" },
                    { tag: "Eco", backgroundColor: "#0000FF", textColor: "#FFFFFF" },
                    { tag: "Premium", backgroundColor: "#FFD700", textColor: "#000000" },
                ],
            },
            variations: [],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithoutVariations}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("2")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Eco")
        expect(screen.getByTestId("tag-1-text").textContent).toBe("Premium")
    })

    it("should remove duplicate discountTag when same tag exists in variation tags", () => {
        const productWithDuplicateDiscountTag = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                    discountTag: "20% OFF",
                    discountTagBackgroundColor: "#FF0000",
                    discountTagTextColor: "#FFFFFF",
                    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
                    tags: [
                        { tag: "20% OFF", backgroundColor: "#0000FF", textColor: "#FFFFFF" },
                        { tag: "Hot", backgroundColor: "#FFA500", textColor: "#000000" },
                    ],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithDuplicateDiscountTag}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("2")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("20% OFF")
        expect(screen.getByTestId("tag-1-text").textContent).toBe("Hot")
    })

    it("should remove duplicates across discountTag and variation tags", () => {
        const productWithAllDuplicates = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [
                    { tag: "Hot", backgroundColor: "#0000FF", textColor: "#FFFFFF" },
                    { tag: "New", backgroundColor: "#00FF00", textColor: "#000000" },
                ],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    ...activeDiscountFields,
                    discountTag: "Hot",
                    discountTagBackgroundColor: "#FF0000",
                    discountTagTextColor: "#FFFFFF",
                    discountValidTo: new Date(Date.now() + 86400000).toISOString(),
                    tags: [
                        { tag: "New", backgroundColor: "#FFA500", textColor: "#000000" },
                        { tag: "Premium", backgroundColor: "#FFD700", textColor: "#000000" },
                    ],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return (
                <div>
                    <div data-testid="tags-count">{tags.length}</div>
                    {tags.map((tag, i) => (
                        <div key={i} data-testid={`tag-${i}-text`}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )
        }

        render(
            <ProductDetailsProvider productVariation={productWithAllDuplicates}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("3")
        expect(screen.getByTestId("tag-0-text").textContent).toBe("Hot")
        expect(screen.getByTestId("tag-1-text").textContent).toBe("New")
        expect(screen.getByTestId("tag-2-text").textContent).toBe("Premium")
    })

    it("should handle empty arrays gracefully when filtering duplicates", () => {
        const productWithEmptyTags = {
            ...mockProductVariation,
            product: {
                ...mockProductVariation.product,
                tags: [],
            },
            variations: [
                {
                    ...mockProductVariation.variations[0],
                    tags: [],
                },
            ],
        } as unknown as ProductVariation

        const TagsComponent = () => {
            const { tags } = useProductDetailsContext()
            return <div data-testid="tags-count">{tags.length}</div>
        }

        render(
            <ProductDetailsProvider productVariation={productWithEmptyTags}>
                <TagsComponent />
            </ProductDetailsProvider>
        )

        expect(screen.getByTestId("tags-count").textContent).toBe("0")
    })
})
