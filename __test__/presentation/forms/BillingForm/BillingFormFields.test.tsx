import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import BillingFormFields from "@/presentation/forms/BillingForm/BillingFormFields"

const mocks = vi.hoisted(() => ({
    lastBillingFormProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/forms/BillingForm/BillingForm", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastBillingFormProps = props
        return <div data-testid="mock-billing-form" />
    },
}))

vi.mock("@/presentation/forms/AddressForm/useAddressFormLocationSync", () => ({
    useAddressFormLocationSync: ({
        onSearchCity,
        onSearchZone,
        onStateChange,
        onCityChange,
    }: {
        onSearchCity: (search: string) => Promise<unknown[]>
        onSearchZone: (search: string) => Promise<unknown[]>
        onStateChange: (stateId: string | null) => void
        onCityChange: (cityId: string | null) => void
    }) => ({
        onSearchCity,
        onSearchZone,
        onCityFocus: () => onStateChange("st-1"),
        onZoneFocus: () => onCityChange("city-1"),
        isCityDisabled: true,
        isZoneDisabled: true,
    }),
}))

const defaultProps = {
    stateOptions: [{ value: "1", label: "Pichincha" }],
    cityOptions: [{ value: "2", label: "Quito" }],
    zoneOptions: [{ value: "3", label: "Centro" }],
    onSearchState: vi.fn().mockResolvedValue([]),
    onSearchCity: vi.fn().mockResolvedValue([]),
    onSearchZone: vi.fn().mockResolvedValue([]),
    onStateChange: vi.fn(),
    onCityChange: vi.fn(),
}

describe("BillingFormFields", () => {
    it("should pass location options and handlers to BillingForm", () => {
        render(<BillingFormFields {...defaultProps} />)

        expect(mocks.lastBillingFormProps).toEqual(
            expect.objectContaining({
                stateOptions: defaultProps.stateOptions,
                cityOptions: defaultProps.cityOptions,
                zoneOptions: defaultProps.zoneOptions,
                onSearchState: defaultProps.onSearchState,
                onSearchCity: defaultProps.onSearchCity,
                onSearchZone: defaultProps.onSearchZone,
                isCityDisabled: true,
                isZoneDisabled: true,
            })
        )
    })

    it("should wire location sync focus handlers", () => {
        const onStateChange = vi.fn()
        const onCityChange = vi.fn()

        render(
            <BillingFormFields
                {...defaultProps}
                onStateChange={onStateChange}
                onCityChange={onCityChange}
            />
        )

        ;(mocks.lastBillingFormProps?.onCityFocus as () => void)()
        ;(mocks.lastBillingFormProps?.onZoneFocus as () => void)()

        expect(onStateChange).toHaveBeenCalledWith("st-1")
        expect(onCityChange).toHaveBeenCalledWith("city-1")
    })
})
