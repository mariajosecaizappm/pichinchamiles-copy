import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LocationGrade } from "@/domain/entity/Location/structure/location"
import { Address } from "@/domain/entity/Address/structure/address"
import BillingFormContainer from "@/presentation/forms/BillingForm/BillingFormContainer"
import {
    addressToBillingFormValues,
    BillingFormValues,
} from "@/presentation/forms/BillingForm/BillingFormConfig"

const mocks = vi.hoisted(() => ({
    getLocation: vi.fn(),
    getLocations: vi.fn(),
    lastBillingFormFieldsProps: null,
    lastFormProps: null,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getLocation: mocks.getLocation,
            getLocations: mocks.getLocations,
        }),
    },
}))

vi.mock("@/presentation/forms/BillingForm/BillingFormFields", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.lastBillingFormFieldsProps = props
        return <div data-testid="mock-billing-form-fields" />
    },
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({
        children,
        onSubmit,
        initialValues,
    }: {
        children: React.ReactNode
        onSubmit: (values: unknown) => Promise<void>
        initialValues: unknown
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

const ecuadorCountry = {
    id: "ec-1",
    name: "ECUADOR",
    grade: LocationGrade.COUNTRY,
    parentId: null,
}

const billingAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Calle 1",
    street2: "",
    number: "123",
    reference: "",
    postalCode: "",
    country: ecuadorCountry,
    state: {
        id: "st-1",
        name: "PICHINCHA",
        grade: LocationGrade.STATE,
        parentId: "ec-1",
    },
    city: {
        id: "city-1",
        name: "QUITO",
        grade: LocationGrade.CITY,
        parentId: "st-1",
    },
    zone: {
        id: "zone-1",
        name: "CENTRO",
        grade: LocationGrade.ZONE,
        parentId: "city-1",
    },
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "",
    default: false,
}

describe("BillingFormContainer", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastBillingFormFieldsProps = null
        mocks.lastFormProps = null
    })

    it("should load country and state options on mount", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([
                { id: "st-1", name: "PICHINCHA", grade: LocationGrade.STATE, parentId: "ec-1" },
            ])
        mocks.getLocations.mockResolvedValue([])

        render(
            <BillingFormContainer
                billingAddress={billingAddress}
                fullName="Juan Pérez"
                maskedDocument="***1234"
                onSubmit={vi.fn()}
            />,
        )

        await waitFor(() => {
            expect(mocks.getLocation).toHaveBeenCalledWith({
                grade: LocationGrade.COUNTRY,
                query: "ECUADOR",
            })
        })

        await waitFor(() => {
            expect(mocks.lastBillingFormFieldsProps?.stateOptions).toEqual([
                {
                    value: "st-1",
                    label: "PICHINCHA",
                    data: { grade: LocationGrade.STATE, parentId: "ec-1" },
                },
            ])
        })
    })

    it("should load city and zone options from billing address", async () => {
        mocks.getLocation.mockResolvedValue([])
        mocks.getLocations.mockResolvedValue([])

        render(
            <BillingFormContainer
                billingAddress={billingAddress}
                fullName="Juan Pérez"
                maskedDocument="***1234"
                onSubmit={vi.fn()}
            />,
        )

        await waitFor(() => {
            expect(mocks.getLocations).toHaveBeenCalledWith("st-1", LocationGrade.CITY, "")
            expect(mocks.getLocations).toHaveBeenCalledWith("city-1", LocationGrade.ZONE, "")
        })
    })

    it("should call onSubmit with merged address when form is submitted", async () => {
        mocks.getLocation.mockResolvedValue([])

        const onSubmit = vi.fn()
        const initialValues = addressToBillingFormValues(billingAddress, {
            billingFullName: "Juan Pérez",
            billingMaskedDocument: "***1234",
        })

        render(
            <BillingFormContainer
                billingAddress={billingAddress}
                fullName="Juan Pérez"
                maskedDocument="***1234"
                onSubmit={onSubmit}
            />,
        )

        await act(async () => {
            fireEvent.submit(screen.getByTestId("mock-form"))
        })

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                id: billingAddress.id,
                street1: initialValues.street1,
            }),
        )
    })

    it("should use null initial location ids when billing address has no state or city", async () => {
        mocks.getLocation.mockResolvedValue([])

        const addressWithoutLocations = {
            ...billingAddress,
            state: undefined,
            city: undefined,
        } as unknown as Address

        render(
            <BillingFormContainer
                ref={createRef()}
                billingAddress={addressWithoutLocations}
                fullName="Juan Pérez"
                maskedDocument="123***890"
                onSubmit={vi.fn()}
            />
        )

        await waitFor(() => {
            expect(mocks.lastBillingFormFieldsProps).not.toBeNull()
        })
    })

    it("should submit form location values when provided", async () => {
        mocks.getLocation.mockResolvedValue([])

        const onSubmit = vi.fn()
        const newState = {
            id: "st-2",
            name: "Guayas",
            grade: "state",
            parentId: "1",
        }
        const newCity = {
            id: "city-2",
            name: "Guayaquil",
            grade: "city",
            parentId: "1",
        }
        const newZone = {
            id: "zone-2",
            name: "Urdesa",
            grade: "zone",
            parentId: "2",
        }
        const formValues: BillingFormValues = {
            ...addressToBillingFormValues(billingAddress, {
                billingFullName: "Juan Pérez",
                billingMaskedDocument: "123***890",
            }),
            state: newState,
            city: newCity,
            zone: newZone,
        }

        render(
            <BillingFormContainer
                ref={createRef()}
                billingAddress={billingAddress}
                fullName="Juan Pérez"
                maskedDocument="123***890"
                onSubmit={onSubmit}
            />
        )

        await act(async () => {
            await (mocks.lastFormProps?.onSubmit as (values: BillingFormValues) => Promise<void>)(formValues)
        })

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                state: newState,
                city: newCity,
                zone: newZone,
            })
        )
    })

    it("should search states when country is loaded", async () => {
        mocks.getLocation
            .mockResolvedValueOnce([ecuadorCountry])
            .mockResolvedValueOnce([
                { id: "st-1", name: "PICHINCHA", grade: LocationGrade.STATE, parentId: "ec-1" },
            ])
        mocks.getLocations.mockResolvedValue([
            { id: "st-2", name: "GUAYAS", grade: LocationGrade.STATE, parentId: "ec-1" },
        ])

        render(
            <BillingFormContainer
                billingAddress={billingAddress}
                fullName="Juan Pérez"
                maskedDocument="***1234"
                onSubmit={vi.fn()}
            />,
        )

        await waitFor(() => {
            expect(mocks.lastBillingFormFieldsProps?.stateOptions).toEqual([
                { value: "st-1", label: "PICHINCHA", data: { grade: LocationGrade.STATE, parentId: "ec-1" } },
            ])
        })

        await act(async () => {
            const options = await (
                mocks.lastBillingFormFieldsProps?.onSearchState as (search: string) => Promise<unknown[]>
            )("GUA")
            expect(options).toEqual([
                {
                    value: "st-2",
                    label: "GUAYAS",
                    data: { grade: LocationGrade.STATE, parentId: "ec-1" },
                },
            ])
        })
    })
})
