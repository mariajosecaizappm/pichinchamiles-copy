import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => {
    const getCategories = vi.fn()
    return { getCategories }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn().mockReturnValue({
            getHomeMenuMainCategories: mocks.getCategories,
        }),
    },
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Menu/HomeMenu", () => ({
    default: ({ productCategories }: { productCategories?: unknown[] }) => (
        <div data-testid="home-menu" data-has-categories={!!productCategories}>
            {productCategories ? `categories:${productCategories.length}` : "no-categories"}
        </div>
    ),
}))

import { render, screen } from "@testing-library/react"
import HomeMenuContainer from "@/presentation/pages/Home/components/Header/components/Menu/HomeMenuContainer"

describe("HomeMenuContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render HomeMenu with productCategories when fetch succeeds", async () => {
        const mockCategories = [
            { id: "1", name: "Hogar", slug: "hogar", parent: null },
            { id: "2", name: "Cocina", slug: "cocina", parent: null },
        ]
        mocks.getCategories.mockResolvedValue(mockCategories)

        const Component = await HomeMenuContainer()
        render(Component)

        const menu = screen.getByTestId("home-menu")
        expect(menu).toBeInTheDocument()
        expect(menu).toHaveAttribute("data-has-categories", "true")
        expect(menu).toHaveTextContent("categories:2")
    })

    it("should render HomeMenu without productCategories when fetch fails", async () => {
        mocks.getCategories.mockRejectedValue(new Error("Fetch failed"))

        const Component = await HomeMenuContainer()
        render(Component)

        const menu = screen.getByTestId("home-menu")
        expect(menu).toBeInTheDocument()
        expect(menu).toHaveAttribute("data-has-categories", "false")
        expect(menu).toHaveTextContent("no-categories")
    })

    it("should call getCategories use case", async () => {
        mocks.getCategories.mockResolvedValue([])

        await HomeMenuContainer()

        expect(mocks.getCategories).toHaveBeenCalledTimes(1)
    })

    it("should render HomeMenu with empty categories when API returns empty array", async () => {
        mocks.getCategories.mockResolvedValue([])

        const Component = await HomeMenuContainer()
        render(Component)

        const menu = screen.getByTestId("home-menu")
        expect(menu).toHaveAttribute("data-has-categories", "true")
        expect(menu).toHaveTextContent("categories:0")
    })
})
