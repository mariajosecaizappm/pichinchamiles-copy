import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import AutocompleteNoData from "@/presentation/components/Form/components/Autocomplete/AutocompleteNoData"

describe("AutocompleteNoData", () => {
    it("should render the empty message from the select props", () => {
        render(
            <AutocompleteNoData
                props={{ noDataLabel: "Sin resultados" } as never}
                state={{} as never}
                methods={{} as never}
            />,
        )

        expect(screen.getByText("Sin resultados")).toBeInTheDocument()
    })

    it("should use the default empty styles", () => {
        render(
            <AutocompleteNoData
                props={{ noDataLabel: "No se encontraron resultados" } as never}
                state={{} as never}
                methods={{} as never}
            />,
        )

        expect(screen.getByText("No se encontraron resultados")).toHaveClass(
            "text-sm",
            "text-grayscale-400",
        )
    })
})
