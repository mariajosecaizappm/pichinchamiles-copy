import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AutocompleteItemRenderer from "@/presentation/components/Form/components/Autocomplete/AutocompleteItemRenderer"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete/types"

const QUITO: AutocompleteOption = { value: "1", label: "Quito" }
const GUAYAQUIL: AutocompleteOption = { value: "2", label: "Guayaquil" }

const addItem = vi.fn()
const isSelected = vi.fn()
const dropDown = vi.fn()

const renderItemRenderer = ({
    item = QUITO,
    itemIndex = 0,
    cursor = null as number | null,
    selected = false,
}: {
    item?: AutocompleteOption
    itemIndex?: number
    cursor?: number | null
    selected?: boolean
} = {}) => {
    isSelected.mockReturnValue(selected)

    return render(
        <AutocompleteItemRenderer
            item={item}
            itemIndex={itemIndex}
            props={{} as never}
            state={{
                dropdown: true,
                values: [],
                search: "",
                selectBounds: {},
                cursor,
                searchResults: [QUITO, GUAYAQUIL],
            }}
            methods={{ addItem, isSelected, dropDown } as never}
        />,
    )
}

describe("AutocompleteItemRenderer", () => {
    beforeEach(() => {
        addItem.mockClear()
        isSelected.mockClear()
        dropDown.mockClear()
        Element.prototype.scrollIntoView = vi.fn()
    })

    it("should render the option label", () => {
        renderItemRenderer()

        expect(screen.getByRole("button", { name: "Quito" })).toBeInTheDocument()
    })

    it("should select the option on click", () => {
        renderItemRenderer()

        fireEvent.click(screen.getByRole("button", { name: "Quito" }))

        expect(addItem).toHaveBeenCalledWith(QUITO)
    })

    it("should force-close the dropdown on select as a workaround for the iOS closeOnSelect race", () => {
        renderItemRenderer()

        fireEvent.click(screen.getByRole("button", { name: "Quito" }))

        expect(dropDown).toHaveBeenCalledWith("close")
    })

    it("should mark the option selected through the select methods", () => {
        renderItemRenderer({ selected: true })

        expect(isSelected).toHaveBeenCalledWith(QUITO)
        expect(screen.getByRole("button", { name: "Quito" })).toHaveAttribute("aria-current", "true")
    })

    it("should highlight the option under the keyboard cursor", () => {
        renderItemRenderer({ cursor: 0 })

        expect(screen.getByRole("button", { name: "Quito" })).toHaveClass("bg-darkGrayishBlue-100")
    })

    it("should not highlight options that are not under the keyboard cursor", () => {
        renderItemRenderer({ cursor: 1 })

        expect(screen.getByRole("button", { name: "Quito" })).not.toHaveClass("bg-darkGrayishBlue-100")
    })
})
