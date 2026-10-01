import React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { useAddressFormLocationSync } from "@/presentation/forms/AddressForm/useAddressFormLocationSync"

const createWrapper = (
    contextValue: Partial<React.ComponentProps<typeof FormContext.Provider>["value"]>,
) => {
    const FormContextWrapper = ({ children }: { children: React.ReactNode }) => (
        <FormContext.Provider
            value={{
                values: {},
                errors: {},
                touched: {},
                onInputChange: vi.fn(),
                setFieldValue: vi.fn(),
                setFieldTouched: vi.fn(),
                setFieldError: vi.fn(),
                onBlur: vi.fn(),
                validateForm: vi.fn(),
                isSubmitting: false,
                submitCount: 0,
                disabled: false,
                hasErrors: false,
                hasVisibleErrors: false,
                alert: null,
                ...contextValue,
            }}
        >
            {children}
        </FormContext.Provider>
    )
    FormContextWrapper.displayName = "FormContextWrapper"
    return FormContextWrapper
}

describe("useAddressFormLocationSync", () => {
    it("should return third party flag from form values", () => {
        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { isThirdPartyAddress: true },
                }),
            }
        )

        expect(result.current.isThirdPartyAddress).toBe(true)
    })

    it("should return empty options when searching city without state", async () => {
        const setFieldError = vi.fn()
        const onSearchCity = vi.fn()

        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity,
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: null, city: null },
                    setFieldError,
                }),
            }
        )

        await act(async () => {
            const options = await result.current.onSearchCity("qui")
            expect(options).toEqual([])
        })

        expect(onSearchCity).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should return empty options when searching zone without city", async () => {
        const setFieldError = vi.fn()

        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: null },
                    setFieldError,
                }),
            }
        )

        await act(async () => {
            const options = await result.current.onSearchZone("flor")
            expect(options).toEqual([])
        })

        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should delegate search when prerequisites are met", async () => {
        const onSearchCity = vi.fn().mockResolvedValue([{ value: "2", label: "Quito" }])

        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity,
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "2" } },
                }),
            }
        )

        await act(async () => {
            const options = await result.current.onSearchCity("qui")
            expect(options).toEqual([{ value: "2", label: "Quito" }])
        })

        expect(onSearchCity).toHaveBeenCalledWith("qui")
    })

    it("should not mark state on city focus when missing", () => {
        const setFieldTouched = vi.fn()
        const setFieldError = vi.fn()

        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: null },
                    setFieldTouched,
                    setFieldError,
                }),
            }
        )

        act(() => {
            result.current.onCityFocus()
        })

        expect(setFieldTouched).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should disable city and zone until location prerequisites are selected", () => {
        const { result } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: null, city: null },
                }),
            }
        )

        expect(result.current.isCityDisabled).toBe(true)
        expect(result.current.isZoneDisabled).toBe(true)
    })

    it("should clear the city and zone and set an error when the initial city is no longer available", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    cityOptions: [{ value: "city-2", label: "GUAYAQUIL", data: {} }],
                    cityOptionsLoaded: true,
                    initialCityId: "city-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "city-1" }, zone: { id: "zone-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).toHaveBeenCalledWith("city", null)
        expect(setFieldValue).toHaveBeenCalledWith("zone", null)
        expect(setFieldError).toHaveBeenCalledWith(
            "city",
            "La ciudad seleccionada ya no tiene cobertura de entrega. Selecciona otra.",
        )
    })

    it("should keep the city when it is still among the available options", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    cityOptions: [{ value: "city-1", label: "QUITO", data: {} }],
                    cityOptionsLoaded: true,
                    initialCityId: "city-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "city-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalledWith("city", null)
        expect(setFieldError).not.toHaveBeenCalledWith(
            "city",
            "La ciudad seleccionada ya no tiene cobertura de entrega. Selecciona otra.",
        )
    })

    it("should do nothing for city when there is no initial city (create mode)", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    cityOptions: [],
                    cityOptionsLoaded: true,
                    initialCityId: null,
                }),
            {
                wrapper: createWrapper({
                    values: { state: null, city: null },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should not check the stale city until cityOptionsLoaded is true", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    cityOptions: [],
                    cityOptionsLoaded: false,
                    initialCityId: "city-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "city-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should clear the zone and set an error when the initial zone is no longer available", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    zoneOptions: [{ value: "zone-2", label: "NORTE", data: {} }],
                    zoneOptionsLoaded: true,
                    initialZoneId: "zone-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "2" }, zone: { id: "zone-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).toHaveBeenCalledWith("zone", null)
        expect(setFieldError).toHaveBeenCalledWith(
            "zone",
            "La zona seleccionada ya no tiene cobertura de entrega. Selecciona otra.",
        )
    })

    it("should keep the zone when it is still among the available options", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    zoneOptions: [{ value: "zone-1", label: "CENTRO", data: {} }],
                    zoneOptionsLoaded: true,
                    initialZoneId: "zone-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "2" }, zone: { id: "zone-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalledWith("zone", null)
        expect(setFieldError).not.toHaveBeenCalledWith(
            "zone",
            "La zona seleccionada ya no tiene cobertura de entrega. Selecciona otra.",
        )
    })

    it("should do nothing when there is no initial zone (create mode)", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    zoneOptions: [],
                    zoneOptionsLoaded: true,
                    initialZoneId: null,
                }),
            {
                wrapper: createWrapper({
                    values: { state: null, city: null, zone: null },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should not check the stale zone until zoneOptionsLoaded is true", () => {
        const setFieldValue = vi.fn()
        const setFieldError = vi.fn()

        renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                    zoneOptions: [],
                    zoneOptionsLoaded: false,
                    initialZoneId: "zone-1",
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "2" }, zone: { id: "zone-1" } },
                    setFieldValue,
                    setFieldError,
                }),
            }
        )

        expect(setFieldValue).not.toHaveBeenCalled()
        expect(setFieldError).not.toHaveBeenCalled()
    })

    it("should enable city when state is selected and zone when city is selected", () => {
        const { result: withoutCity } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: null },
                }),
            }
        )

        expect(withoutCity.current.isCityDisabled).toBe(false)
        expect(withoutCity.current.isZoneDisabled).toBe(true)

        const { result: withCity } = renderHook(
            () =>
                useAddressFormLocationSync({
                    onSearchCity: vi.fn(),
                    onSearchZone: vi.fn(),
                }),
            {
                wrapper: createWrapper({
                    values: { state: { id: "1" }, city: { id: "2" } },
                }),
            }
        )

        expect(withCity.current.isCityDisabled).toBe(false)
        expect(withCity.current.isZoneDisabled).toBe(false)
    })
})
