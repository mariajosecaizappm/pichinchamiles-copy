import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import FormContext from "@/presentation/components/Form/context/FormContext"
import ProductVariantSelector from "@/presentation/pages/Products/ProductDetails/components/ProductVariants/ProductVariantSelector"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

const mocks = vi.hoisted(() => ({
    setFieldValue: vi.fn(),
}))

const renderWithFormContext = (
    ui: React.ReactElement,
    features: Record<string, string> = { talla: "S" }
) =>
    render(
        <FormContext.Provider
            value={{
                values: { features },
                errors: {},
                touched: {},
                disabled: false,
                isSubmitting: false,
                submitCount: 0,
                hasErrors: false,
                hasVisibleErrors: false,
                alert: null,
                onInputChange: vi.fn(),
                setFieldValue: mocks.setFieldValue,
                onBlur: vi.fn(),
                validateForm: () => Promise.resolve({}),
            }}
        >
            {ui}
        </FormContext.Provider>
    )

vi.mock("@/presentation/components/Form/components/Select", () => ({
    Select: ({
        label,
        isDisabled,
        isInvalid,
        onSelectionChange,
        children,
    }: {
        label: string
        isDisabled?: boolean
        isInvalid?: boolean
        onSelectionChange: (keys: { currentKey: string | null }) => void
        children: React.ReactNode
    }) => (
        <div data-testid={`select-${label}`} data-disabled={isDisabled} data-invalid={isInvalid}>
            <button
                type="button"
                onClick={() => onSelectionChange({ currentKey: "M" })}
            >
                select-{label}
            </button>
            {children}
        </div>
    ),
}))

vi.mock("@heroui/react", () => ({
    SelectItem: ({ children }: { children: React.ReactNode }) => <option>{children}</option>,
}))

describe("ProductVariantSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: false,
        })
    })

    it("should render select with feature label", () => {
        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-1", name: "talla", options: ["S", "M", "L"], optionsOrdered: [] }}
            />
        )

        expect(screen.getByTestId("select-talla")).toBeInTheDocument()
    })

    it("should disable select when only one option is available", () => {
        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-2", name: "color", options: ["Rojo"], optionsOrdered: [] }}
            />
        )

        expect(screen.getByTestId("select-color")).toHaveAttribute("data-disabled", "true")
    })

    it("should disable select when isLoading is true", () => {
        mockUseProductDetailsContext.mockReturnValue({
            isLoading: true,
        })

        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-3", name: "color", options: ["Rojo", "Azul"], optionsOrdered: [] }}
            />
        )

        expect(screen.getByTestId("select-color")).toHaveAttribute("data-disabled", "true")
    })

    it("should pass isInvalid to select", () => {
        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-4", name: "color", options: ["Rojo", "Azul"], optionsOrdered: [] }}
                isInvalid
            />
        )

        expect(screen.getByTestId("select-color")).toHaveAttribute("data-invalid", "true")
    })

    it("should update feature field on selection change", () => {
        const onChanged = vi.fn()

        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-5", name: "talla", options: ["S", "M", "L"], optionsOrdered: [] }}
                onChanged={onChanged}
            />
        )

        fireEvent.click(screen.getByText("select-talla"))

        expect(onChanged).toHaveBeenCalledTimes(1)
        expect(mocks.setFieldValue).toHaveBeenCalledWith("features.talla", "M")
    })

    it("should replace existing feature option when selecting a new value", () => {
        mockUseProductDetailsContext.mockReturnValue({
            selectedFeatures: [
                { name: "talla", option: "S" },
                { name: "color", option: "Rojo" },
            ],
            setSelectedFeatures: vi.fn(),
            isLoading: false,
        })

        renderWithFormContext(
            <ProductVariantSelector
                feature={{ id: "f-6", name: "talla", options: ["S", "M", "L"], optionsOrdered: [] }}
            />,
            { talla: "S", color: "Rojo" }
        )

        fireEvent.click(screen.getByText("select-talla"))

        expect(mocks.setFieldValue).toHaveBeenCalledWith("features.talla", "M")
    })
})
