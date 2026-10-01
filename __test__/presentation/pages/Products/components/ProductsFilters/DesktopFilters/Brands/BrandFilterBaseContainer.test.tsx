import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import BrandFilterBaseContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilterBaseContainer"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

const {
    mockOnChangeFilter,
    mockUseProductBrands,
} = vi.hoisted(() => ({
    mockOnChangeFilter: vi.fn(),
    mockUseProductBrands: vi.fn(),
}))

let mockSearchValues = {
    brand: "",
    sort: "",
    recommended: false,
    search: "",
    category: "",
}
let mockBrands: Array<{ id: string; name: string; slug: string }> = []
let mockIsLoading = false

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        onChangeFilter: mockOnChangeFilter,
    }),
}))

vi.mock("@/presentation/pages/Products/hooks/useProductBrands", () => ({
    default: (args: unknown) => mockUseProductBrands(args),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilter",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div data-testid="brand-filter">
                <span data-testid="isLoading">{String(props.isLoading)}</span>
                <span data-testid="isPending">{String(props.isPending)}</span>
                <span data-testid="currentBrand">{String(props.currentBrand)}</span>
                <span data-testid="showAllBrands">{String(props.showAllBrands)}</span>
                <span data-testid="brandsCount">
                    {Array.isArray(props.brands) ? props.brands.length : 0}
                </span>
                <button
                    data-testid="check-brand"
                    onClick={() => (props.onCheckBrand as (v: string) => void)("brand1")}
                >
                    Check Brand
                </button>
                <button
                    data-testid="check-brand-other"
                    onClick={() => (props.onCheckBrand as (v: string) => void)("other")}
                >
                    Check Other
                </button>
                <button
                    data-testid="set-show-all"
                    onClick={() => (props.setShowAllBrands as (v: boolean) => void)(true)}
                >
                    Show All
                </button>
                <button
                    data-testid="accordion"
                    onClick={() =>
                        (props.onAccordionOpenChange as ((v: boolean) => void) | undefined)?.(
                            true
                        )
                    }
                >
                    Accordion
                </button>
                <div
                    data-testid="press-brand"
                    onPointerDown={() => {
                        const mockEvent = {
                            preventDefault: vi.fn(),
                            stopPropagation: vi.fn(),
                        }
                            ; (props.onPressBrand as (e: unknown, v: string) => void)(
                            mockEvent,
                            "brand1"
                        )
                    }}
                >
                    Press Brand
                </div>
                <div
                    data-testid="press-brand-other"
                    onPointerDown={() => {
                        const mockEvent = {
                            preventDefault: vi.fn(),
                            stopPropagation: vi.fn(),
                        }
                            ; (props.onPressBrand as (e: unknown, v: string) => void)(
                            mockEvent,
                            "other"
                        )
                    }}
                >
                    Press Other
                </div>
            </div>
        ),
    })
)

describe("BrandFilterBaseContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        mockSearchValues = {
            brand: "",
            sort: "",
            recommended: false,
            search: "",
            category: "",
        }
        mockBrands = []
        mockIsLoading = false
        mockUseProductBrands.mockImplementation(() => ({
            brands: mockBrands,
            isLoading: mockIsLoading,
        }))
    })

    it("returns null when not loading and no brandIds", () => {
        const { container } = render(<BrandFilterBaseContainer brandIds={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it("renders when brands exist", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        expect(screen.getByTestId("brand-filter")).toBeInTheDocument()
    })

    it("renders when loading even with empty brandIds", () => {
        mockIsLoading = true
        mockUseProductBrands.mockImplementation(() => ({
            brands: [],
            isLoading: true,
        }))
        render(<BrandFilterBaseContainer brandIds={[]} />)
        expect(screen.getByTestId("brand-filter")).toBeInTheDocument()
        expect(screen.getByTestId("isLoading")).toHaveTextContent("true")
    })

    it("passes currentBrand from searchValues", () => {
        mockSearchValues = { ...mockSearchValues, brand: "brand1" }
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        expect(screen.getByTestId("currentBrand")).toHaveTextContent("brand1")
    })

    it("calls onChangeFilter and tracks when checking a new brand", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.click(screen.getByTestId("check-brand"))
        expect(mockOnChangeFilter).toHaveBeenCalledWith("brand", "brand1")
        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "brand",
            filter: mockBrands[0],
        })
    })

    it("does not call onChangeFilter when checking same brand", () => {
        mockSearchValues = { ...mockSearchValues, brand: "brand1" }
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.click(screen.getByTestId("check-brand"))
        expect(mockOnChangeFilter).not.toHaveBeenCalled()
        expect(mockTrack).not.toHaveBeenCalled()
    })

    it("does not track when brand id is not found", () => {
        mockBrands = [{ id: "other", name: "Other", slug: "other" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.click(screen.getByTestId("check-brand"))
        expect(mockOnChangeFilter).toHaveBeenCalledWith("brand", "brand1")
        expect(mockTrack).not.toHaveBeenCalled()
    })

    it("clears brand on pointerDown when same brand selected", () => {
        mockSearchValues = { ...mockSearchValues, brand: "brand1" }
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.pointerDown(screen.getByTestId("press-brand"))
        expect(mockOnChangeFilter).toHaveBeenCalledWith("brand", "")
    })

    it("does not clear brand on pointerDown when different brand", () => {
        mockSearchValues = { ...mockSearchValues, brand: "brand2" }
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.pointerDown(screen.getByTestId("press-brand"))
        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("does not clear on pointerDown when pressing unmatched brand", () => {
        mockSearchValues = { ...mockSearchValues, brand: "brand1" }
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        fireEvent.pointerDown(screen.getByTestId("press-brand-other"))
        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("passes brands count to BrandFilter", () => {
        mockBrands = [
            { id: "brand1", name: "Brand 1", slug: "brand-1" },
            { id: "brand2", name: "Brand 2", slug: "brand-2" },
        ]
        render(<BrandFilterBaseContainer brandIds={["brand1", "brand2"]} />)
        expect(screen.getByTestId("brandsCount")).toHaveTextContent("2")
    })

    it("calls useProductBrands with enabled true by default", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1", "brand2"]} />)
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: ["brand1", "brand2"],
            enabled: true,
        })
    })

    it("calls useProductBrands with enabled true after accordion expands", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1", "brand2"]} />)
        fireEvent.click(screen.getByTestId("accordion"))
        expect(mockUseProductBrands).toHaveBeenLastCalledWith({
            brands: ["brand1", "brand2"],
            enabled: true,
        })
    })

    it("keeps useProductBrands disabled when enabled prop is false even if accordion expands", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(
            <BrandFilterBaseContainer brandIds={["brand1"]} enabled={false} />
        )
        fireEvent.click(screen.getByTestId("accordion"))
        expect(mockUseProductBrands).toHaveBeenLastCalledWith({
            brands: ["brand1"],
            enabled: false,
        })
    })

    it("uses empty brands array when brandIds is falsy via || []", () => {
        mockIsLoading = true
        mockUseProductBrands.mockImplementation(() => ({
            brands: [],
            isLoading: true,
        }))
        render(
            <BrandFilterBaseContainer
                brandIds={undefined as unknown as string[]}
            />
        )
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: [],
            enabled: true,
        })
    })

    it("forwards onAccordionOpenChange", () => {
        const onAccordionOpenChange = vi.fn()
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(
            <BrandFilterBaseContainer
                brandIds={["brand1"]}
                onAccordionOpenChange={onAccordionOpenChange}
            />
        )
        fireEvent.click(screen.getByTestId("accordion"))
        expect(onAccordionOpenChange).toHaveBeenCalledWith(true)
    })

    it("toggles showAllBrands via setShowAllBrands", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        expect(screen.getByTestId("showAllBrands")).toHaveTextContent("false")
        fireEvent.click(screen.getByTestId("set-show-all"))
        expect(screen.getByTestId("showAllBrands")).toHaveTextContent("true")
    })

    it("passes isPending to BrandFilter", () => {
        mockBrands = [{ id: "brand1", name: "Brand 1", slug: "brand-1" }]
        render(<BrandFilterBaseContainer brandIds={["brand1"]} />)
        expect(screen.getByTestId("isPending")).toHaveTextContent("false")
    })
})