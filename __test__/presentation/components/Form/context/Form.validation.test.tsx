import React, { useContext } from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import * as Yup from "yup"
import Form from "@/presentation/components/Form/context/Form"
import FormContext from "@/presentation/components/Form/context/FormContext"

const Field = ({ name, label }: { name: string; label: string }) => {
    const { values, errors, touched, submitCount, onInputChange, onBlur } = useContext(FormContext)
    const value = values[name]
    const error = errors[name] as string | undefined
    const hasValue = value !== "" && value !== undefined && value !== null
    const isTouched = Boolean(touched[name])
    const showError = !!((hasValue || submitCount > 0 || isTouched) && error)

    return (
        <input
            name={name}
            aria-label={label}
            aria-invalid={showError}
            value={String(value ?? "")}
            onChange={onInputChange}
            onBlur={onBlur}
        />
    )
}

describe("Form validation on change", () => {
    it("should not show a validation error while the user is typing before the first submit", () => {
        const schema = Yup.object({
            street2: Yup.string().required("required").min(3, "required"),
        })

        render(
            <Form
                initialValues={{ street2: "" }}
                schema={schema}
                onSubmit={vi.fn().mockResolvedValue(undefined)}
            >
                <Field name="street2" label="Calle secundaria" />
                <button type="submit">Agregar dirección</button>
            </Form>,
        )

        const street2 = screen.getByLabelText("Calle secundaria")

        fireEvent.change(street2, { target: { name: "street2", value: "a" } })

        expect(street2).toHaveAttribute("aria-invalid", "false")
    })

    it("should not show a validation error in the next field after blurring a previous field", () => {
        const schema = Yup.object({
            alias: Yup.string().required("required").min(3, "required"),
            street1: Yup.string().required("required").min(3, "required"),
        })

        render(
            <Form
                initialValues={{ alias: "", street1: "" }}
                schema={schema}
                onSubmit={vi.fn().mockResolvedValue(undefined)}
            >
                <Field name="alias" label="Nombre de la dirección" />
                <Field name="street1" label="Calle principal" />
                <button type="submit">Agregar dirección</button>
            </Form>,
        )

        const alias = screen.getByLabelText("Nombre de la dirección")
        const street1 = screen.getByLabelText("Calle principal")

        act(() => {
            fireEvent.change(alias, { target: { name: "alias", value: "Casa" } })
            fireEvent.blur(alias)
            fireEvent.change(street1, { target: { name: "street1", value: "Ca" } })
        })

        expect(street1).toHaveAttribute("aria-invalid", "false")
    })
})
