import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import BrandsOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsOptions"
import { Brand } from "@/domain/entity/Brand/brand"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

describe("BrandsOptions", () => {
    const buildBrands = (n: number): Brand[] =>
        Array.from({ length: n }).map((_, i) => ({
            id: `brand-${i}`,
            name: `Brand ${i}`,
            slug: `brand-${i}`,
            description: "",
            logoUrl: "",
        })) as Brand[]

    it("should return null when not loading and brands is empty", () => {
        const { container } = render(
            <BrandsOptions isLoading={false} brands={[]} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        expect(container.firstChild).toBeNull()
    })

    it("should render skeletons while loading", () => {
        const { container } = render(
            <BrandsOptions isLoading={true} brands={[]} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        expect(container.firstChild).not.toBeNull()
        expect(screen.getByText("Marcas")).toBeInTheDocument()
    })

    it("should render up to DEFAULT_BRANDS_TO_SHOW (10) brands", () => {
        const brands = buildBrands(15)
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        for (let i = 0; i < 10; i++) {
            expect(screen.getByText(`Brand ${i}`)).toBeInTheDocument()
        }
        expect(screen.queryByText("Brand 10")).not.toBeInTheDocument()
    })

    it("should render the ShowAllBrands toggle when brands exceed DEFAULT_BRANDS_TO_SHOW", () => {
        const brands = buildBrands(12)
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        expect(screen.getByText("Ver todos")).toBeInTheDocument()
    })

    it("should not render ShowAllBrands when count <= DEFAULT_BRANDS_TO_SHOW", () => {
        const brands = buildBrands(5)
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        expect(screen.queryByText("Ver todos")).not.toBeInTheDocument()
    })

    it("should call onSelectBrand with brand id when an unselected brand is pressed", () => {
        const onSelectBrand = vi.fn()
        const brands = buildBrands(3)
        mockTrack.mockReset()
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={null} onSelectBrand={onSelectBrand} />
        )
        fireEvent.click(screen.getByText("Brand 1"))
        expect(onSelectBrand).toHaveBeenCalledWith("brand-1")
        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "brand",
            filter: brands[1],
        })
    })

    it("should call onSelectBrand with null when the selected brand is pressed", () => {
        const onSelectBrand = vi.fn()
        const brands = buildBrands(3)
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={"brand-1"} onSelectBrand={onSelectBrand} />
        )
        fireEvent.click(screen.getByText("Brand 1"))
        expect(onSelectBrand).toHaveBeenCalledWith(null)
    })

    it("should expand to show all brands after clicking 'Ver todos'", () => {
        const brands = buildBrands(12)
        render(
            <BrandsOptions isLoading={false} brands={brands} selectedBrand={null} onSelectBrand={vi.fn()} />
        )
        expect(screen.queryByText("Brand 11")).not.toBeInTheDocument()
        fireEvent.click(screen.getByText("Ver todos"))
        expect(screen.getByText("Brand 11")).toBeInTheDocument()
    })
})
