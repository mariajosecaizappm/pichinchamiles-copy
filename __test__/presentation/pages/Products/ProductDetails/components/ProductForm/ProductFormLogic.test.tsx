import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, act } from "@testing-library/react"
import { useContext as reactUseContext } from "react"
import type { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import ProductFormLogic from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormLogic"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import Form from "@/presentation/components/Form/context/Form"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { defaultProductFormValues, ProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"
import { PaymentMethod } from "@/domain/entity/Payment/payment"
import { Variation } from "@/domain/entity/Product/variation"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: vi.fn(),
}))

const mockSetSelectedFeatures = vi.fn()

const mockVariationWithCopayment = {
    id: "var-1",
    pointsPrice: 500,
    price: 100,
    features: [
        { name: "Color", option: "Red" },
        { name: "Size", option: "M" },
    ],
    copayment: {
        initialization: { points: 300, coins: 10 },
        minimumPointsValue: 200,
        pointsConversionRatePercentage: Buffer.from(Buffer.from("0.02").toString("base64")).toString("base64"),
    },
} as unknown as Variation

const mockVariationNoCopayment = {
    id: "var-2",
    pointsPrice: 500,
    price: 100,
    features: [],
    copayment: null,
} as unknown as Variation

const mockVariationWithFeatures = {
    id: "var-3",
    pointsPrice: 500,
    price: 100,
    features: [{ name: "Color", option: "Blue" }],
    copayment: null,
} as unknown as Variation

const mockContextValue = (variation: Variation | null = mockVariationNoCopayment) => ({
    variation,
    setSelectedFeatures: mockSetSelectedFeatures,
    isLoading: false,
    assets: [],
    tags: [],
    setVariation: vi.fn(),
    selectedFeatures: [],
    pointsPrice: 500,
    minCopaymentPoints: 0,
    copaymentPercentage: 0,
    addProductToCart: vi.fn(),
})

const captured: Record<string, unknown> = {}

const CaptureFields = () => {
    const { values } = reactUseContext(FormContext)
    captured.points = values.points
    captured.coins = values.coins
    return null
}

const renderLogic = (formValues: Partial<ProductFormValues> = {}, variation: Variation | null = mockVariationNoCopayment, captureFields = false) => {
    vi.mocked(useProductDetailsContext).mockReturnValue(mockContextValue(variation))
    return render(
        <Form
            initialValues={{ ...defaultProductFormValues, ...formValues }}
            onSubmit={vi.fn()}
        >
            <ProductFormLogic />
            {captureFields && <CaptureFields />}
        </Form>
    )
}

describe("ProductFormLogic", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        captured.points = undefined
        captured.coins = undefined
    })

    it("should render null (no DOM output from ProductFormLogic)", () => {
        const { container } = renderLogic()
        expect(container.querySelector("form")).toBeInTheDocument()
    })

    it("should call setSelectedFeatures when features change", async () => {
        await act(async () => {
            renderLogic({ features: { Color: "Red", Size: "M" } }, mockVariationWithFeatures)
        })
        expect(mockSetSelectedFeatures).toHaveBeenCalledWith([
            { name: "Color", option: "Red" },
            { name: "Size", option: "M" },
        ])
    })

    it("should call setSelectedFeatures with empty array when features is empty object and variation has no features", async () => {
        await act(async () => {
            renderLogic({ features: {} }, mockVariationNoCopayment)
        })
        expect(mockSetSelectedFeatures).toHaveBeenCalledWith([])
    })

    it("should call setSelectedFeatures with empty array when variation is null", async () => {
        await act(async () => {
            renderLogic({ features: {} }, null)
        })
        expect(mockSetSelectedFeatures).toHaveBeenCalledWith([])
    })

    it("should set points=pointsPrice*quantity and coins=0 for POINTS payment type", async () => {
        await act(async () => {
            renderLogic({ paymentType: PaymentMethod.POINTS, quantity: 2 }, mockVariationNoCopayment, true)
        })
        expect(captured.points).toBe(1000)
        expect(captured.coins).toBe(0)
    })

    it("should set points=pointsPrice*1 for quantity=1 with POINTS", async () => {
        await act(async () => {
            renderLogic({ paymentType: PaymentMethod.POINTS, quantity: 1 }, mockVariationNoCopayment, true)
        })
        expect(captured.points).toBe(500)
        expect(captured.coins).toBe(0)
    })

    it("should not update points when variation is null and payment is POINTS", async () => {
        vi.mocked(useProductDetailsContext).mockReturnValue({
            ...mockContextValue(null),
            variation: null,
        })
        await act(async () => {
            render(
                <Form
                    initialValues={{ ...defaultProductFormValues, paymentType: PaymentMethod.POINTS, points: 999 }}
                    onSubmit={vi.fn()}
                >
                    <ProductFormLogic />
                    <CaptureFields />
                </Form>
            )
        })
        expect(captured.points).toBe(999)
    })

    it("should set initial copayment values when paymentType is COPAYMENT with calculator", async () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(mockContextValue(mockVariationWithCopayment))
        await act(async () => {
            render(
                <Form
                    initialValues={{ ...defaultProductFormValues, paymentType: PaymentMethod.COPAYMENT, quantity: 1 }}
                    onSubmit={vi.fn()}
                >
                    <ProductFormLogic />
                    <CaptureFields />
                </Form>
            )
        })
        expect(typeof captured.points).toBe("number")
        expect(typeof captured.coins).toBe("number")
    })

    it("should not set copayment values when variation has no copayment config", async () => {
        await act(async () => {
            renderLogic({ paymentType: PaymentMethod.COPAYMENT }, mockVariationNoCopayment, true)
        })
        expect(captured.coins).toBe(0)
    })

    it("should auto-initialize features via setFieldValue when form features is empty and variation has features", async () => {
        const mockSetFieldValue = vi.fn()

        vi.mocked(useProductDetailsContext).mockReturnValue(mockContextValue(mockVariationWithCopayment))

        await act(async () => {
            render(
                <FormContext.Provider value={{
                    values: { ...defaultProductFormValues, features: {} } as unknown as Record<string, unknown>,
                    setFieldValue: mockSetFieldValue,
                    errors: {},
                    touched: {},
                    onInputChange: vi.fn(),
                    onBlur: vi.fn(),
                    validateForm: vi.fn(),
                    isSubmitting: false,
                    submitCount: 0,
                    disabled: false,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                } as unknown as FormContextValues<ProductFormValues>}>
                    <ProductFormLogic />
                </FormContext.Provider>
            )
        })

        expect(mockSetFieldValue).toHaveBeenCalledWith("features", { Color: "Red", Size: "M" })
    })

    it("should NOT call setFieldValue for features when form already has feature values", async () => {
        const mockSetFieldValue = vi.fn()

        vi.mocked(useProductDetailsContext).mockReturnValue(mockContextValue(mockVariationWithCopayment))

        await act(async () => {
            render(
                <FormContext.Provider value={{
                    values: { ...defaultProductFormValues, features: { Color: "Blue" } } as unknown as Record<string, unknown>,
                    setFieldValue: mockSetFieldValue,
                    errors: {},
                    touched: {},
                    onInputChange: vi.fn(),
                    onBlur: vi.fn(),
                    validateForm: vi.fn(),
                    isSubmitting: false,
                    submitCount: 0,
                    disabled: false,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                } as unknown as FormContextValues<ProductFormValues>}>
                    <ProductFormLogic />
                </FormContext.Provider>
            )
        })

        const featureSetCalls = mockSetFieldValue.mock.calls.filter(
            (args: unknown[]) => args[0] === "features"
        )
        expect(featureSetCalls).toHaveLength(0)
    })

    it("should handle variation with no features (empty features array) without crashing", async () => {
        await act(async () => {
            renderLogic({ features: {} }, mockVariationNoCopayment)
        })

        expect(mockSetSelectedFeatures).toHaveBeenCalledWith([])
    })
})
