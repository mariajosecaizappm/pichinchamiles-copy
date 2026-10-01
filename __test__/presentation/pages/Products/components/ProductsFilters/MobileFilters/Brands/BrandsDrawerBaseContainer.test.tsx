import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import BrandsDrawerBaseContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawerBaseContainer"

const {
    mockPush,
    mockReplace,
    mockSetDraft,
    mockReset,
    mockUseProductBrands,
    mockUseFilterDraft,
} = vi.hoisted(() => ({
    mockPush: vi.fn(),
    mockReplace: vi.fn(),
    mockSetDraft: vi.fn(),
    mockReset: vi.fn(),
    mockUseProductBrands: vi.fn(),
    mockUseFilterDraft: vi.fn(),
}))

let mockSearchParams = new URLSearchParams()
let mockSearchValues = {
    brand: "",
    sort: "",
    recommended: false,
    search: "",
    category: "",
}
let mockBrands: Array<{ id: string; name: string }> = []
let mockIsLoading = false

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => "/productos",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: mockSearchParams,
    }),
}))

vi.mock("@/presentation/pages/Products/hooks/useProductBrands", () => ({
    default: (args: unknown) => mockUseProductBrands(args),
}))

vi.mock("@/presentation/pages/Products/hooks/useFilterDraft", () => ({
    default: (initial: unknown) => mockUseFilterDraft(initial),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawer",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div data-testid="brands-drawer" data-open={String(props.isOpen)}>
                <button
                    data-testid="apply"
                    onClick={props.onApplyFilters as () => void}
                >
                    apply
                </button>
                <button
                    data-testid="clear"
                    onClick={props.onClearFilters as () => void}
                >
                    clear
                </button>
                <button data-testid="close" onClick={props.onClose as () => void}>
                    close
                </button>
                <button
                    data-testid="toggle-open"
                    onClick={() => (props.onOpenChange as (v: boolean) => void)(true)}
                >
                    open
                </button>
                <button
                    data-testid="toggle-close"
                    onClick={() => (props.onOpenChange as (v: boolean) => void)(false)}
                >
                    close-drawer
                </button>
                <button
                    data-testid="select-brand"
                    onClick={() =>
                        (props.onSelectBrand as (v: string | null) => void)("b2")
                    }
                >
                    select
                </button>
                <span data-testid="selected-brand">{String(props.selectedBrand)}</span>
                <span data-testid="is-loading">{String(props.isLoading)}</span>
                <span data-testid="brands-count">
                    {Array.isArray(props.brands) ? props.brands.length : 0}
                </span>
            </div>
        ),
    })
)

describe("BrandsDrawerBaseContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
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

        mockUseFilterDraft.mockImplementation((initial: unknown) => ({
            draft: initial,
            setDraft: mockSetDraft,
            reset: mockReset,
        }))
    })

    it("renders BrandsDrawer when brands exist", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(screen.getByTestId("brands-drawer")).toBeInTheDocument()
    })

    it("returns null when not loading and brandIds is empty", () => {
        const { container } = render(
            <BrandsDrawerBaseContainer brandIds={[]} />
        )
        expect(container.firstChild).toBeNull()
    })

    it("returns null when not loading and brandIds is null", () => {
        const { container } = render(
            <BrandsDrawerBaseContainer brandIds={null as unknown as string[]} />
        )
        expect(container.firstChild).toBeNull()
    })

    it("renders while loading even with empty brandIds", () => {
        mockIsLoading = true
        mockUseProductBrands.mockImplementation(() => ({
            brands: [],
            isLoading: true,
        }))
        render(<BrandsDrawerBaseContainer brandIds={[]} />)
        expect(screen.getByTestId("brands-drawer")).toBeInTheDocument()
        expect(screen.getByTestId("is-loading")).toHaveTextContent("true")
    })

    it("calls useProductBrands with brandIds || [] and enabled false when closed", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: ["b1"],
            enabled: false,
        })
    })

    it("calls useProductBrands with empty brands when brandIds is null", () => {
        mockIsLoading = true
        mockUseProductBrands.mockImplementation(() => ({
            brands: [],
            isLoading: true,
        }))
        render(
            <BrandsDrawerBaseContainer brandIds={null as unknown as string[]} />
        )
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: [],
            enabled: false,
        })
    })

    it("calls useProductBrands with enabled true when open", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("toggle-open"))
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: ["b1"],
            enabled: true,
        })
    })

    it("calls router.replace with selected brand on apply", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchValues = { ...mockSearchValues, brand: "b1" }
        mockSearchParams = new URLSearchParams("brand=b1")
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockReplace).toHaveBeenCalled()
        expect(mockReplace.mock.calls[0][0] as string).toContain("brand=b1")
    })

    it("calls router.replace clearing brand when applied draft is null", () => {
        mockUseFilterDraft.mockImplementation(() => ({
            draft: null,
            setDraft: mockSetDraft,
            reset: mockReset,
        }))
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockReplace.mock.calls[0][0] as string).not.toContain("brand=")
    })

    it("closes drawer after apply", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("toggle-open"))
        expect(screen.getByTestId("brands-drawer")).toHaveAttribute(
            "data-open",
            "true"
        )
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockReplace).toHaveBeenCalled()
        expect(screen.getByTestId("brands-drawer")).toHaveAttribute(
            "data-open",
            "false"
        )
    })

    it("clears brand via router.replace and setDraft null", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchParams = new URLSearchParams("brand=b1")
        mockSearchValues = { ...mockSearchValues, brand: "b1" }
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(mockReplace).toHaveBeenCalled()
        expect(mockReplace.mock.calls[0][0] as string).not.toContain("brand=")
        expect(mockSetDraft).toHaveBeenCalledWith(null)
    })

    it("resets draft to committed brand on close", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchValues = { ...mockSearchValues, brand: "committed" }
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("close"))
        expect(mockReset).toHaveBeenCalledWith("committed")
        expect(mockPush).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it("resets draft to null on close when no brand in URL", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("close"))
        expect(mockReset).toHaveBeenCalledWith(null)
    })

    it("syncs draft to URL brand", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchValues = { ...mockSearchValues, brand: "url-brand" }
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(screen.getByTestId("selected-brand")).toHaveTextContent("url-brand")
    })

    it("treats empty brand as null", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchValues = { ...mockSearchValues, brand: "" }
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(screen.getByTestId("selected-brand")).toHaveTextContent("null")
    })

    it("initializes useFilterDraft with committed brand", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        mockSearchValues = { ...mockSearchValues, brand: "b1" }
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(mockUseFilterDraft).toHaveBeenCalledWith("b1")
    })

    it("forwards onSelectBrand to setDraft", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("select-brand"))
        expect(mockSetDraft).toHaveBeenCalledWith("b2")
    })

    it("passes brands to drawer", () => {
        mockBrands = [
            { id: "b1", name: "Brand 1" },
            { id: "b2", name: "Brand 2" },
        ]
        render(<BrandsDrawerBaseContainer brandIds={["b1", "b2"]} />)
        expect(screen.getByTestId("brands-count")).toHaveTextContent("2")
    })

    it("passes empty brands array when brands is falsy", () => {
        mockUseProductBrands.mockImplementation(() => ({
            brands: undefined,
            isLoading: false,
        }))
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(screen.getByTestId("brands-count")).toHaveTextContent("0")
    })

    it("passes isLoading false when not loading", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        expect(screen.getByTestId("is-loading")).toHaveTextContent("false")
    })

    it("toggles open state via onOpenChange", () => {
        mockBrands = [{ id: "b1", name: "Brand 1" }]
        render(<BrandsDrawerBaseContainer brandIds={["b1"]} />)
        fireEvent.click(screen.getByTestId("toggle-open"))
        expect(screen.getByTestId("brands-drawer")).toHaveAttribute(
            "data-open",
            "true"
        )
        fireEvent.click(screen.getByTestId("toggle-close"))
        expect(screen.getByTestId("brands-drawer")).toHaveAttribute(
            "data-open",
            "false"
        )
    })
})