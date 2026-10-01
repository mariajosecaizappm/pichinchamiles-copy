import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import AddressForm from "@/presentation/forms/AddressForm/AddressForm"

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({ name, label }: { name: string; label: string }) => (
        <input data-testid={`input-${name}`} aria-label={label} />
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormCheckbox", () => ({
    FormCheckbox: ({ name, label }: { name: string; label: string }) => (
        <label data-testid={`checkbox-${name}`}>{label}</label>
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormSelect", () => ({
    default: ({ name, label }: { name: string; label: string }) => (
        <select data-testid={`select-${name}`} aria-label={label} />
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormAutocomplete", () => ({
    default: ({
        name,
        label,
        onFocus,
        isDisabled,
        regExp,
        popoverProps,
    }: {
        name: string
        label: string
        onFocus?: () => void
        isDisabled?: boolean
        regExp?: RegExp
        popoverProps?: Record<string, unknown>
    }) => (
        <input
            data-testid={`autocomplete-${name}`}
            aria-label={label}
            onFocus={onFocus}
            disabled={isDisabled}
            data-accepts-unicode={regExp?.test("CAÑAR")}
        />
    ),
}))

const defaultProps = {
    stateOptions: [{ value: "1", label: "Pichincha" }],
    cityOptions: [{ value: "2", label: "Quito" }],
    zoneOptions: [{ value: "3", label: "Centro" }],
    isThirdPartyAddress: false,
    onSearchState: vi.fn().mockResolvedValue([]),
    onSearchCity: vi.fn().mockResolvedValue([]),
    onSearchZone: vi.fn().mockResolvedValue([]),
    onCityFocus: vi.fn(),
    onZoneFocus: vi.fn(),
}

describe("AddressForm", () => {
    it("should render main address fields", () => {
        render(<AddressForm {...defaultProps} />)

        expect(screen.getByLabelText("Nombre de la dirección")).toBeInTheDocument()
        expect(screen.getByLabelText("Calle principal")).toBeInTheDocument()
        expect(screen.getByLabelText("Calle secundaria")).toBeInTheDocument()
        expect(screen.getByLabelText("Provincia")).toBeInTheDocument()
        expect(screen.getByLabelText("Ciudad")).toBeInTheDocument()
        expect(screen.getByLabelText("Sector/Zona")).toBeInTheDocument()
        expect(screen.getByLabelText("Número de dirección")).toBeInTheDocument()
        expect(screen.getByLabelText("Número telefónico")).toBeInTheDocument()
        expect(screen.getByLabelText("Referencia")).toBeInTheDocument()
        expect(screen.getByText("Un tercero recibe el producto")).toBeInTheDocument()
    })

    it("should not render third party fields when isThirdPartyAddress is false", () => {
        render(<AddressForm {...defaultProps} />)

        expect(screen.queryByLabelText("Nombres")).not.toBeInTheDocument()
        expect(screen.queryByLabelText("Apellidos")).not.toBeInTheDocument()
        expect(screen.queryByLabelText("Tipo de identificación")).not.toBeInTheDocument()
    })

    it("should render third party fields when isThirdPartyAddress is true", () => {
        render(<AddressForm {...defaultProps} isThirdPartyAddress />)

        expect(screen.getByLabelText("Nombres")).toBeInTheDocument()
        expect(screen.getByLabelText("Apellidos")).toBeInTheDocument()
        expect(screen.getByLabelText("Tipo de identificación")).toBeInTheDocument()
        expect(screen.getByLabelText("Documento de identificación")).toBeInTheDocument()
        expect(screen.getByTestId("input-customerReceivingPhone")).toBeInTheDocument()
    })

    it("should call onCityFocus and onZoneFocus when autocomplete fields are focused", () => {
        const onCityFocus = vi.fn()
        const onZoneFocus = vi.fn()

        render(
            <AddressForm
                {...defaultProps}
                onCityFocus={onCityFocus}
                onZoneFocus={onZoneFocus}
            />
        )

        fireEvent.focus(screen.getByTestId("autocomplete-city"))
        fireEvent.focus(screen.getByTestId("autocomplete-zone"))

        expect(onCityFocus).toHaveBeenCalledTimes(1)
        expect(onZoneFocus).toHaveBeenCalledTimes(1)
    })

    it("should disable city and zone when location prerequisites are missing", () => {
        render(
            <AddressForm
                {...defaultProps}
                isCityDisabled
                isZoneDisabled
            />
        )

        expect(screen.getByTestId("autocomplete-city")).toBeDisabled()
        expect(screen.getByTestId("autocomplete-zone")).toBeDisabled()
    })

    it("should not restrict characters when searching province", () => {
        render(<AddressForm {...defaultProps} />)

        expect(screen.getByTestId("autocomplete-state")).not.toHaveAttribute(
            "data-accepts-unicode",
        )
    })
})
