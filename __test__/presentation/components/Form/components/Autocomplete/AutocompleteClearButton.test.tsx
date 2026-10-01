import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AutocompleteClearButton from "@/presentation/components/Form/components/Autocomplete/AutocompleteClearButton"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete/types"

const QUITO: AutocompleteOption = { value: "1", label: "Quito" }

const clearAll = vi.fn()
const dropDown = vi.fn()

const renderClearButton = (values: AutocompleteOption[] = [QUITO]) =>
    render(
        <AutocompleteClearButton
            props={{} as never}
            state={{
                dropdown: false,
                values,
                search: "",
                selectBounds: {},
                cursor: null,
                searchResults: [],
            }}
            methods={{ clearAll, dropDown } as never}
        />,
    )

describe("AutocompleteClearButton", () => {
    beforeEach(() => {
        clearAll.mockClear()
        dropDown.mockClear()
    })

    it("should render nothing when there is no selection", () => {
        const { container } = renderClearButton([])

        expect(container).toBeEmptyDOMElement()
    })

    it("should render the clear button when a value is selected", () => {
        renderClearButton()

        expect(screen.getByLabelText("Limpiar selección")).toBeInTheDocument()
    })

    it("should clear the selection and reopen the list", () => {
        renderClearButton()

        fireEvent.click(screen.getByLabelText("Limpiar selección"))

        expect(clearAll).toHaveBeenCalledTimes(1)
        expect(dropDown).toHaveBeenCalledWith("open")
    })

    it("should stop the click from bubbling to the field", () => {
        const onParentClick = vi.fn()
        render(
            <div onClick={onParentClick}>
                <AutocompleteClearButton
                    props={{} as never}
                    state={{
                        dropdown: true,
                        values: [QUITO],
                        search: "",
                        selectBounds: {},
                        cursor: null,
                        searchResults: [],
                    }}
                    methods={{ clearAll, dropDown } as never}
                />
            </div>,
        )

        fireEvent.click(screen.getByLabelText("Limpiar selección"))

        expect(onParentClick).not.toHaveBeenCalled()
    })
})
