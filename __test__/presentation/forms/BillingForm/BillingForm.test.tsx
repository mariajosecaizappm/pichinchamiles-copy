import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import BillingForm from "@/presentation/forms/BillingForm/BillingForm"

vi.mock("@/presentation/components/Form/controls/FormInput", () => ({
    default: ({ name, label }: { name: string; label: string }) => (
        <input data-testid={`input-${name}`} aria-label={label} />
    ),
}))

vi.mock("@/presentation/components/Form/controls/FormAutocomplete", () => ({
    default: ({
        name,
        label,
        onFocus,
        isDisabled,
    }: {
        name: string
        label: string
        onFocus?: () => void
        isDisabled?: boolean
    }) => (
        <input
            data-testid={`autocomplete-${name}`}
            aria-label={label}
            onFocus={onFocus}
            disabled={isDisabled}
        />
    ),
}))

const defaultProps = {
    stateOptions: [{ value: "1", label: "Pichincha" }],
    cityOptions: [{ value: "2", label: "Quito" }],
    zoneOptions: [{ value: "3", label: "Centro" }],
    onSearchState: vi.fn().mockResolvedValue([]),
    onSearchCity: vi.fn().mockResolvedValue([]),
    onSearchZone: vi.fn().mockResolvedValue([]),
    onCityFocus: vi.fn(),
    onZoneFocus: vi.fn(),
}

describe("BillingForm", () => {
    it("should render billing form fields", () => {
        render(<BillingForm {...defaultProps} />)

        expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument()
        expect(screen.getByLabelText("Documento de identificación")).toBeInTheDocument()
        expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument()
        expect(screen.getByLabelText("Número telefónico")).toBeInTheDocument()
        expect(screen.getByLabelText("Calle principal")).toBeInTheDocument()
        expect(screen.getByLabelText("Calle secundaria")).toBeInTheDocument()
        expect(screen.getByLabelText("Provincia")).toBeInTheDocument()
        expect(screen.getByLabelText("Ciudad")).toBeInTheDocument()
        expect(screen.getByLabelText("Número de dirección")).toBeInTheDocument()
        expect(screen.getByLabelText("Sector/Zona")).toBeInTheDocument()
    })

    it("should call onCityFocus and onZoneFocus when autocomplete fields are focused", () => {
        const onCityFocus = vi.fn()
        const onZoneFocus = vi.fn()

        render(
            <BillingForm
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
            <BillingForm
                {...defaultProps}
                isCityDisabled
                isZoneDisabled
            />
        )

        expect(screen.getByTestId("autocomplete-city")).toBeDisabled()
        expect(screen.getByTestId("autocomplete-zone")).toBeDisabled()
    })
})
