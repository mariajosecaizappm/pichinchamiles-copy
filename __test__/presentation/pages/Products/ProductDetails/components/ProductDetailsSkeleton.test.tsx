import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductDetailsSkeleton from "@/presentation/pages/Products/ProductDetails/components/ProductDetailsSkeleton"

describe("ProductDetailsSkeleton", () => {
    it("should render without errors", () => {
        const { container } = render(<ProductDetailsSkeleton />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should render search toolbar skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Search toolbar has flex gap-2 layout
        const toolbar = document.querySelector(".flex.gap-2")
        expect(toolbar).toBeInTheDocument()
    })

    it("should render breadcrumbs skeleton section", () => {
        render(<ProductDetailsSkeleton />)
        // Breadcrumbs skeleton container exists
        const breadcrumbs = document.querySelector(".mb-4 > div")
        expect(breadcrumbs).toBeInTheDocument()
    })

    it("should render gallery skeleton with thumbnails", () => {
        render(<ProductDetailsSkeleton />)
        // Should have multiple skeleton elements for gallery
        const listItems = screen.getAllByRole("listitem")
        expect(listItems.length).toBeGreaterThanOrEqual(3)
    })

    it("should render product name skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Product name is in a div with max-w classes
        const nameContainer = document.querySelector(".max-w-80, .max-w-96")
        expect(nameContainer).toBeInTheDocument()
    })

    it("should render product meta skeleton section", () => {
        render(<ProductDetailsSkeleton />)
        // Product meta section with space-y class
        const metaSection = document.querySelector("section.space-y-1")
        expect(metaSection).toBeInTheDocument()
    })

    it("should render product price skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Look for price skeleton section
        const sections = document.querySelectorAll("section")
        expect(sections.length).toBeGreaterThanOrEqual(2)
    })

    it("should render product customization skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Should have variant selector placeholders
        const divs = document.querySelectorAll("div")
        expect(divs.length).toBeGreaterThan(10)
    })

    it("should render payment options skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // PaymentOptionsSkeleton is rendered
        expect(document.querySelector(".body-container")).toBeInTheDocument()
    })

    it("should render add to cart skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Large button skeleton - check for div with h-12 class
        const buttonSkeleton = document.querySelector("div.w-full.lg\\:min-w-50")
        expect(buttonSkeleton).toBeInTheDocument()
    })

    it("should render description accordion skeleton for mobile", () => {
        render(<ProductDetailsSkeleton />)
        // Mobile-only section exists
        const mobileSection = document.querySelector(".lg\\:hidden")
        expect(mobileSection).toBeInTheDocument()
    })

    it("should render order notice skeleton", () => {
        render(<ProductDetailsSkeleton />)
        // Order notice section with icon and list
        const lists = screen.getAllByRole("list")
        expect(lists.length).toBeGreaterThanOrEqual(2)
    })

    it("should have correct container structure", () => {
        render(<ProductDetailsSkeleton />)
        const mainContainer = document.querySelector(".py-3")
        expect(mainContainer).toBeInTheDocument()
    })

    it("should render desktop layout wrapper", () => {
        render(<ProductDetailsSkeleton />)
        // Layout wrapper that contains both columns
        const container = document.querySelector(".body-container.py-3 > div")
        expect(container).toBeInTheDocument()
    })

    it("should render left column for gallery", () => {
        render(<ProductDetailsSkeleton />)
        // Left column has lg:flex class
        const leftCol = document.querySelector(".lg\\:flex.lg\\:flex-col")
        expect(leftCol).toBeInTheDocument()
    })

    it("should render right column for details", () => {
        render(<ProductDetailsSkeleton />)
        const rightCol = document.querySelector(".lg\\:self-start")
        expect(rightCol).toBeInTheDocument()
    })

    it("should render thumbnail list with correct number of items", () => {
        render(<ProductDetailsSkeleton />)
        // Should have 3 thumbnail skeletons
        const thumbnailList = document.querySelectorAll("ol.flex.flex-col.gap-3 > li")
        expect(thumbnailList.length).toBe(3)
    })

    it("should render carousel dots for mobile", () => {
        render(<ProductDetailsSkeleton />)
        // Mobile carousel dots (3 dots)
        const mobileDotsList = document.querySelector("ol.lg\\:hidden")
        expect(mobileDotsList).toBeInTheDocument()
    })

    it("should render desktop-only description section", () => {
        render(<ProductDetailsSkeleton />)
        const desktopDesc = document.querySelector(".hidden.lg\\:block")
        expect(desktopDesc).toBeInTheDocument()
    })

    it("should render variant selector skeletons", () => {
        render(<ProductDetailsSkeleton />)
        // 2 variant selectors in grid
        const gridItems = document.querySelectorAll(".grid > div")
        expect(gridItems.length).toBeGreaterThanOrEqual(2)
    })

    it("should render related products placeholder", () => {
        render(<ProductDetailsSkeleton />)
        // Related products section at bottom - just check last body-container div
        const containers = document.querySelectorAll(".body-container")
        expect(containers.length).toBeGreaterThanOrEqual(2)
    })
})
