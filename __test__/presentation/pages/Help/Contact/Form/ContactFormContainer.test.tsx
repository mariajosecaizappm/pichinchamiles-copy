import {render, screen, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import React from "react"
import type {Member} from "@/domain/entity/Member/member"
import type {Requeriment} from "@/domain/entity/Pqrs/requirement"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mockExecute = vi.fn()
const mockAddPqrs = vi.fn()
const containerGet = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: containerGet,
    },
}))

vi.mock("@tanstack/react-query", () => ({
    useQuery: ({queryFn}: {queryFn: () => Promise<unknown>}) => ({
        data: queryFn(),
        isLoading: false,
    }),
}))

const MockContactForm = vi.hoisted(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react")
    const state = {mountCount: 0}
    const Component = (props: Record<string, unknown>) => {
        const instanceId = React.useMemo(() => {
            state.mountCount += 1
            return state.mountCount
        }, [])

        return React.createElement("div", {"data-testid": "contact-form"},
            React.createElement("span", {"data-testid": "form-instance"}, String(instanceId)),
            React.createElement("span", {"data-testid": "types-count"}, String((props.requierimentTypes as unknown[] | undefined)?.length ?? "")),
            React.createElement("button", {
                "data-testid": "submit-form",
                onClick: () => (props.onCreateRequeriment as (values: Requeriment) => Promise<void>)({
                    identificationNumber: "123",
                    identificationType: "CI",
                    fullname: "Juan",
                    description: "desc",
                    email: "a@a.com",
                    pqrsRequirementTypeId: "t1",
                    pqrsRequirementSubTypeId: "s1",
                })
            }, "Submit"),
            props.isSuccessOpen ? React.createElement("button", {
                "data-testid": "close-success",
                onClick: () => (props.onOpenSuccessChange as (open: boolean) => void)(false),
            }, "Success") : null
        )
    }
    Component.displayName = "MockContactForm"
    Component.resetMountCount = () => {
        state.mountCount = 0
    }
    return Component
})

vi.mock("@/presentation/pages/Help/Contact/Form/ContactForm", () => ({
    default: MockContactForm,
}))

import ContactFormContainer from "@/presentation/pages/Help/Contact/Form/ContactFormContainer"

describe("ContactFormContainer", () => {
    const member: Member = {
        id: "member-1",
        memberType: "PERSONAL",
        firstName: "Juan",
        secondName: "Carlos",
        firstLastName: "Pérez",
        secondLastName: "Gómez",
        enrollmentEmail: "juan@example.com",
        identificationType: "CI",
        identificationNumber: "1234567890",
    } as unknown as Member

    beforeEach(() => {
        vi.clearAllMocks()
        ;(MockContactForm as unknown as {resetMountCount: () => void}).resetMountCount()
        mockExecute.mockReturnValue([{id: "type-1", name: "Type one", subtypes: []}])
        mockAddPqrs.mockResolvedValue(undefined)

        containerGet.mockImplementation((type: symbol) => {
            if (type === UseCaseTypes.GetRequierimentTypesUseCase) {
                return {execute: mockExecute}
            }
            if (type === UseCaseTypes.CreateRequerimentUseCase) {
                return {addPqrs: mockAddPqrs}
            }
            return undefined
        })
    })

    it("should pass member information and fetched types to ContactForm", async () => {
        render(<ContactFormContainer member={member} />)

        expect(await screen.findByTestId("contact-form")).toBeInTheDocument()
        expect(screen.getByTestId("types-count")).toHaveTextContent("1")
    })

    it("should call create requeriment use case and open success modal on submit", async () => {
        render(<ContactFormContainer member={member} />)

        screen.getByTestId("submit-form").click()

        await waitFor(() => expect(mockAddPqrs).toHaveBeenCalledTimes(1))
        expect(screen.getByText("Success")).toBeInTheDocument()
    })

    it("should remount the form after the success modal is closed", async () => {
        render(<ContactFormContainer member={member} />)

        expect(screen.getByTestId("form-instance")).toHaveTextContent("1")

        screen.getByTestId("submit-form").click()
        await waitFor(() => expect(screen.getByTestId("close-success")).toBeInTheDocument())

        screen.getByTestId("close-success").click()

        await waitFor(() => expect(screen.getByTestId("form-instance")).toHaveTextContent("2"))
        expect(screen.queryByTestId("close-success")).not.toBeInTheDocument()
    })
})
