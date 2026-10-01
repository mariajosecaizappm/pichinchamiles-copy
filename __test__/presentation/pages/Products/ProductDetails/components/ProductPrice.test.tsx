import {describe, it, expect, vi, beforeEach} from "vitest"
import {render, screen} from "@testing-library/react"
import ProductPrice from "@/presentation/pages/Products/ProductDetails/components/ProductPrice/ProductPrice"
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

const mockContext = (overrides = {}) => ({
    isLoading: false,
    pointsPrice: 500,
    tags: [],
    hasDiscount: false,
    hasVariants: true,
    ...overrides,
})

describe("ProductPrice", () => {
    beforeEach(() => {
        mockUseProductDetailsContext.mockReturnValue(mockContext())
    })

    it("should render price with millas", () => {
        render(<ProductPrice basePrice={500} />)
        expect(screen.getByText(/500/)).toBeInTheDocument()
        expect(screen.getByText(/millas/)).toBeInTheDocument()
    })

    it("should render skeleton when loading", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ isLoading: true }))

        render(<ProductPrice basePrice={500} />)
        expect(screen.queryByText(/500/)).not.toBeInTheDocument()
    })

    it("should calculate price", () => {
        render(<ProductPrice basePrice={500} />)
        expect(screen.getByText(/500/)).toBeInTheDocument()
    })

    it("should render previous price when discount is active", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            pointsPrice: 400,
            hasDiscount: true,
        }))

        render(<ProductPrice basePrice={400} previousPrice={500} />)
        expect(screen.getByText(/Antes/)).toBeInTheDocument()
        expect(screen.getByText(/500/)).toBeInTheDocument()
    })

    it("should not render previous price when discount is inactive and product has variants", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            pointsPrice: 400,
            hasDiscount: false,
            hasVariants: true,
        }))

        render(<ProductPrice basePrice={400} previousPrice={500} />)
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should render previous price for product without variants", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            pointsPrice: 400,
            hasDiscount: false,
            hasVariants: false,
        }))

        render(<ProductPrice basePrice={400} previousPrice={500} />)
        expect(screen.getByText(/Antes/)).toBeInTheDocument()
        expect(screen.getByText(/500/)).toBeInTheDocument()
    })

    it("should not render previous price for product without variants when prices are equal", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            pointsPrice: 500,
            hasDiscount: false,
            hasVariants: false,
        }))

        render(<ProductPrice basePrice={500} previousPrice={500} />)
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should render tags when available", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            tags: [{tag: "20% OFF", backgroundColor: "#FF0000", textColor: "#FFFFFF"}],
        }))

        render(<ProductPrice basePrice={500} />)
        expect(screen.getByText(/20% OFF/)).toBeInTheDocument()
    })

    it("should render with zero price", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ pointsPrice: 0 }))

        render(<ProductPrice basePrice={0} />)
        expect(screen.getByText(/0/)).toBeInTheDocument()
    })

    it("should handle large quantity values", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ pointsPrice: 1000 }))

        render(<ProductPrice basePrice={1000} />)
        expect(screen.getByText(/1\.000/)).toBeInTheDocument()
    })

    it("should handle large price values", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ pointsPrice: 999999 }))

        render(<ProductPrice basePrice={999999} />)
        expect(screen.getByText(/999\.999/)).toBeInTheDocument()
    })

    it("should render multiple tags", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({
            tags: [
                {tag: "20% OFF", backgroundColor: "#FF0000", textColor: "#FFFFFF"},
                {tag: "Nuevo", backgroundColor: "#00FF00", textColor: "#000000"},
            ],
        }))

        render(<ProductPrice basePrice={500} />)
        expect(screen.getByText(/20% OFF/)).toBeInTheDocument()
        expect(screen.getByText(/Nuevo/)).toBeInTheDocument()
    })

    it("should render without previous price", () => {
        render(<ProductPrice basePrice={500} />)
        expect(screen.queryByText(/Antes/)).not.toBeInTheDocument()
    })

    it("should handle undefined pointsPrice from context", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ pointsPrice: undefined }))

        render(<ProductPrice basePrice={500} />)
        expect(screen.getByText(/500/)).toBeInTheDocument()
    })

    it("should render skeleton elements when loading", () => {
        mockUseProductDetailsContext.mockReturnValue(mockContext({ isLoading: true }))

        const { container } = render(<ProductPrice basePrice={500} />)
        const skeleton = container.querySelector("[class*='rounded']")
        expect(skeleton).toBeInTheDocument()
    })
})
