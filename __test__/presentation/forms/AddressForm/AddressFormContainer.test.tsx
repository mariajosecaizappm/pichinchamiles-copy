import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LocationGrade } from "@/domain/entity/Location/structure/location"
import { addressFormInitialValues } from "@/presentation/forms/AddressForm/AddressFormConfig"
import AddressFormContainer from "@/presentation/forms/AddressForm/AddressFormContainer"

const mocks = vi.hoisted(() => ({
    getLocation: vi.fn(),
    getLocations: vi.fn(),
    lastAddressFormProps: null as Record<string, unknown> | null,
    lastFormProps: null as Record<string, unknown> | null,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getLocation: mocks.getLocation,
            getLocations: mocks.getLocations,
        }),
    },
}))

vi.mock("@/presentation/forms/AddressForm/AddressForm", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastAddressFormProps = props
        return <div data-testid="mock-address-form" />
    },
}))

vi.mock("@/presentation/forms/AddressForm/useAddressFormLocationSync", () => ({
    useAddressFormLocationSync: ({
        onSearchCity,
        onSearchZone,
    }: {
        onSearchCity: (search: string) => Promise<unknown[]>
        onSearchZone: (search: string) => Promise<unknown[]>
    }) => ({
        isThirdPartyAddress: false,
        isCityDisabled: true,
        isZoneDisabled: true,
        onSearchCity,
        onSearchZone,
        onCityFocus: vi.fn(),
        onZoneFocus: vi.fn(),
    }),
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({
        children,
        onSubmit,
        initialValues,
    }: {
        children: React.ReactNode
        onSubmit: (values: typeof addressFormInitialValues) => Promise<void>
        initialValues: typeof addressFormInitialValues
    }) => {
        mocks.lastFormProps = { onSubmit, initialValues }
        return (
            <form
                data-testid="mock-form"
                onSubmit={e => {
                    e.preventDefault()
                    onSubmit(initialValues)
                }}
            >
                {children}
            </form>
        )
    },
}))

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <button type="submit">{children}</button>
    ),
}))

const ecuadorCountry = {
    id: "ec-1",
    name: "ECUADOR",
    grade: LocationGrade.COUNTRY,
    parentId: null,
}

const pichinchaState = {
    id: "st-1",
    name: "PICHINCHA",
    grade: LocationGrade.STATE,
    parentId: "ec-1",
}

const addressWithCountry = {
    ...addressFormInitialValues,
    country: ecuadorCountry,
}

describe("AddressFormContainer", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastAddressFormProps = null
        mocks.lastFormProps = null
    })

    it("should load country and state options on mount", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])

        render(
            <AddressFormContainer
                address={addressWithCountry}
                onSubmit={vi.fn()}
                saveText="Guardar"
            />
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.COUNTRY,
                query: "ECUADOR",
            })
        })

        await waitFor(() => {
            expect(mocks.lastAddressFormProps?.stateOptions).toEqual([
                { value: "st-1", label: "PICHINCHA", data: { grade: LocationGrade.STATE, parentId: "ec-1" } },
            ])
        })
    })

    it("should load city options when address has state", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        ])

        const address = {
            ...addressFormInitialValues,
            state: { id: "st-1", name: "PICHINCHA", grade: LocationGrade.STATE, parentId: "ec-1" },
        }

        render(
            <AddressFormContainer address={address} onSubmit={vi.fn()} saveText="Guardar" />
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith(
                "st-1",
                LocationGrade.CITY,
                "",
                true,
            )
        })
    })

    it("should load zone options when address has city", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-1", name: "CENTRO", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const address = {
            ...addressFormInitialValues,
            city: { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        }

        render(
            <AddressFormContainer address={address} onSubmit={vi.fn()} saveText="Guardar" />
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "", true)
        })
    })

    it("should call onSubmit with country when form is submitted", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])

        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(
            <AddressFormContainer
                address={addressWithCountry}
                onSubmit={onSubmit}
                saveText="Agregar dirección"
            />
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalled()
        })

        await act(async () => {
            fireEvent.submit(screen.getByTestId("mock-form"))
        })

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                addressWithCountry,
                expect.objectContaining({ id: "ec-1", name: "ECUADOR" })
            )
        })
    })

    it("should load states by country id when country name is missing", async () => {
        mocks.getLocation.mockResolvedValueOnce([pichinchaState])

        const address = {
            ...addressFormInitialValues,
            country: { id: "ec-1", name: "", grade: LocationGrade.COUNTRY, parentId: null },
        }

        render(
            <AddressFormContainer address={address} onSubmit={vi.fn()} saveText="Guardar" />
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.STATE,
                query: "ec-1",
            })
        })
    })

    it("should not call onSubmit when country is not loaded", async () => {
        mocks.getLocation.mockResolvedValue([])

        const onSubmit = vi.fn()

        render(
            <AddressFormContainer
                address={addressFormInitialValues}
                onSubmit={onSubmit}
                saveText="Guardar"
            />
        )

        await act(async () => {
            fireEvent.submit(screen.getByTestId("mock-form"))
        })

        expect(onSubmit).not.toHaveBeenCalled()
    })

    it("should render save button with provided text", async () => {
        mocks.getLocation.mockResolvedValue([])

        render(
            <AddressFormContainer
                address={addressFormInitialValues}
                onSubmit={vi.fn()}
                saveText="Agregar dirección"
            />
        )

        expect(screen.getByText("Agregar dirección")).toBeInTheDocument()
    })

    it("should search states and update options", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([pichinchaState])
        mocks.getLocations.mockResolvedValue([
            { id: "st-2", name: "GUAYAS", grade: LocationGrade.STATE, parentId: "ec-1" },
        ])

        render(
            <AddressFormContainer
                address={addressWithCountry}
                onSubmit={vi.fn()}
                saveText="Guardar"
            />
        )

        await waitFor(() => {
            expect((mocks.lastAddressFormProps?.stateOptions as unknown[])?.length).toBeGreaterThan(0)
        })

        await act(async () => {
            const options = await (mocks.lastAddressFormProps?.onSearchState as (search: string) => Promise<unknown[]>)("GUA")
            expect(options).toEqual([
                { value: "st-2", label: "GUAYAS", data: { grade: LocationGrade.STATE, parentId: "ec-1" } },
            ])
        })

        expect(mocks.getLocations).toHaveBeenCalledWith(
            "ec-1",
            LocationGrade.STATE,
            "GUA",
            true,
        )
    })

    it("should search zones when address has city selected", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([
            { id: "zone-2", name: "NORTE", grade: LocationGrade.ZONE, parentId: "city-1" },
        ])

        const address = {
            ...addressFormInitialValues,
            city: { id: "city-1", name: "QUITO", grade: LocationGrade.CITY, parentId: "st-1" },
        }

        render(
            <AddressFormContainer address={address} onSubmit={vi.fn()} saveText="Guardar" />
        )

        await waitFor(() => {
            expect(mocks.lastAddressFormProps?.onSearchZone).toBeDefined()
        })

        await act(async () => {
            const options = await (mocks.lastAddressFormProps?.onSearchZone as (search: string) => Promise<unknown[]>)("NOR")
            expect(options).toEqual([
                { value: "zone-2", label: "NORTE", data: { grade: LocationGrade.ZONE, parentId: "city-1" } },
            ])
        })
    })

    it("should return empty city options when state is not selected", async () => {
        mocks.getLocation.mockResolvedValue([])

        render(
            <AddressFormContainer
                address={addressWithCountry}
                onSubmit={vi.fn()}
                saveText="Guardar"
            />
        )

        await waitFor(() => {
            expect(mocks.lastAddressFormProps?.onSearchCity).toBeDefined()
        })

        const options = await (mocks.lastAddressFormProps?.onSearchCity as (search: string) => Promise<unknown[]>)("QUI")
        expect(options).toEqual([])
    })
})
