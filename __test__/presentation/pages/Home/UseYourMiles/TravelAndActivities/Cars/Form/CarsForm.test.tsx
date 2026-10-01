import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const useUvSessionMocks = vi.hoisted(() => {
    const verifyUvSession = vi.fn()
    return { verifyUvSession }
})

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession", () => ({
    default: () => ({
        verifyUvSession: useUvSessionMocks.verifyUvSession,
    }),
}))

const executeMock = vi.fn<(params: unknown) => string>(() => "https://example.com/cars/search")
const getMock = vi.fn(() => ({ execute: executeMock }))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: () => getMock() },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/components/CarsFormFields", () => ({
    default: () => <div data-testid="cars-form-fields" />,
}))

const formMock = vi.fn()
vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: (props: Record<string, unknown>) => {
        formMock(props)
        return <div data-testid="form">{props.children as React.ReactNode}</div>
    },
}))

import CarsForm from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsForm"
import { carsInitialValues } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/Form/CarsFormConfig"

describe("CarsForm", () => {
    beforeEach(() => {
        executeMock.mockClear()
        getMock.mockClear()
        formMock.mockClear()
        useUvSessionMocks.verifyUvSession.mockClear()
    })

    it("should render the Form wrapper with carsInitialValues and CarsFormFields", () => {
        render(<CarsForm />)

        expect(screen.getByTestId("form")).toBeInTheDocument()
        expect(screen.getByTestId("cars-form-fields")).toBeInTheDocument()

        const props = formMock.mock.calls[0][0]
        expect(props.initialValues).toEqual(carsInitialValues)
        expect(props.formErrorId).toBe("travelsFormError")
        expect(typeof props.onSubmit).toBe("function")
    })

    it("should resolve the GetCarRentalSearchUrlUseCase from the container", () => {
        render(<CarsForm />)
        expect(getMock).toHaveBeenCalled()
    })

    it("should call verifyUvSession, execute with parsed params and open the resulting url on submit", async () => {
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null)

        render(<CarsForm />)
        const props = formMock.mock.calls[0][0] as {
            onSubmit: (values: typeof carsInitialValues) => Promise<void>
        }

        await props.onSubmit({
            ...carsInitialValues,
            pickUpLocation: { id: "UIO", name: "Quito" },
            pickUpDateTime: new Date(2024, 5, 15, 10, 0),
            returnDateTime: new Date(2024, 5, 20, 11, 0),
        })

        expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
        expect(executeMock).toHaveBeenCalledTimes(1)
        const params = executeMock.mock.calls[0]?.[0] as { pickUpLocation: string }
        expect(params.pickUpLocation).toBe("UIO")
        expect(openSpy).toHaveBeenCalledWith("https://example.com/cars/search", "_self")

        openSpy.mockRestore()
    })
})
