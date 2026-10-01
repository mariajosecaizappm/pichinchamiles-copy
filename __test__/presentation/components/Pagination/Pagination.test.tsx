import Pagination from "@/presentation/components/Pagination"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockHeroPagination = vi.hoisted(() => vi.fn())

vi.mock("@heroui/theme", () => ({
    cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" "),
}))

vi.mock("@heroui/pagination", () => ({
    Pagination: (props: Record<string, unknown>) => {
        mockHeroPagination(props)
        return <nav data-testid="hero-pagination">Pagination</nav>
    },
}))

describe("Pagination", () => {
    beforeEach(() => {
        mockHeroPagination.mockClear()
    })

    it("should pass default behavior and classNames to HeroUI pagination", () => {
        render(<Pagination total={10} page={2} />)

        expect(screen.getByTestId("hero-pagination")).toBeInTheDocument()
        expect(mockHeroPagination).toHaveBeenCalledWith(
            expect.objectContaining({
                total: 10,
                page: 2,
                showControls: true,
                disableAnimation: true,
                disableCursorAnimation: true,
                variant: "light",
                classNames: expect.objectContaining({
                    base: expect.stringContaining("max-w-[564px]"),
                    wrapper: expect.stringContaining("justify-between"),
                    prev: expect.stringContaining("cursor-pointer"),
                    next: expect.stringContaining("cursor-pointer"),
                    item: expect.stringContaining("cursor-pointer"),
                }),
            }),
        )
    })

    it("should use the requested active and arrow styles", () => {
        render(<Pagination total={10} />)

        const { classNames } = mockHeroPagination.mock.calls[0][0] as {
            classNames: Record<string, string>
        }

        expect(classNames.item).toContain("border-2")
        expect(classNames.item).toContain("data-[active=true]:bg-darkGrayishBlue-100")
        expect(classNames.item).toContain("data-[active=true]:!text-grayscale-500")
        expect(classNames.item).toContain("data-[active=true]:font-semibold")
        expect(classNames.prev).toContain("[&_svg]:size-5")
        expect(classNames.next).toContain("[&_svg]:size-5")
    })

    it("should merge consumer classNames", () => {
        render(<Pagination total={10} classNames={{ item: "custom-item", wrapper: "custom-wrapper" }} />)

        const { classNames } = mockHeroPagination.mock.calls[0][0] as {
            classNames: Record<string, string>
        }

        expect(classNames.item).toContain("custom-item")
        expect(classNames.wrapper).toContain("custom-wrapper")
    })

    it("should scroll to top and call onChange when page changes", () => {
        const scrollTo = vi.fn()
        vi.stubGlobal("scrollTo", scrollTo)
        const onChange = vi.fn()

        render(<Pagination total={10} page={1} onChange={onChange} />)

        const { onChange: handleChange } = mockHeroPagination.mock.calls[0][0] as {
            onChange: (page: number) => void
        }

        handleChange(2)

        expect(scrollTo).toHaveBeenCalledWith(0, 0)
        expect(onChange).toHaveBeenCalledWith(2)
    })
})
