import React, { useContext } from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import * as Yup from "yup"
import Form from "@/presentation/components/Form/context/Form"
import FormContext from "@/presentation/components/Form/context/FormContext"

const Field = ({ name, label }: { name: string; label: string }) => {
    const { values, errors, submitCount, onInputChange } = useContext(FormContext)
    const showError = submitCount > 0 && Boolean(errors[name])

    return (
        <input
            name={name}
            aria-label={label}
            aria-invalid={showError}
            value={String(values[name] ?? "")}
            onChange={onInputChange}
        />
    )
}

const flushAnimationFrame = async () => {
    await act(async () => {
        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve())
        })
    })
}

describe("Form focus on validation errors", () => {
    it("should focus the first invalid field after submit", async () => {
        const schema = Yup.object({
            street2: Yup.string().required("required").min(3, "required"),
            phone: Yup.string().required("required"),
        })

        render(
            <Form
                initialValues={{ street2: "", phone: "" }}
                schema={schema}
                onSubmit={vi.fn().mockResolvedValue(undefined)}
            >
                <Field name="street2" label="Calle secundaria" />
                <Field name="phone" label="Teléfono" />
                <button type="submit">Agregar dirección</button>
            </Form>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Agregar dirección" }))

        const street2 = screen.getByLabelText("Calle secundaria")
        await waitFor(() => {
            expect(street2).toHaveAttribute("aria-invalid", "true")
        })
        await flushAnimationFrame()

        expect(street2).toHaveFocus()
    })

    it("should keep focus on the field being edited when its error clears after submit", async () => {
        const schema = Yup.object({
            street2: Yup.string().required("required").min(3, "required"),
            phone: Yup.string().required("required"),
        })

        render(
            <Form
                initialValues={{ street2: "", phone: "" }}
                schema={schema}
                onSubmit={vi.fn().mockResolvedValue(undefined)}
            >
                <Field name="street2" label="Calle secundaria" />
                <Field name="phone" label="Teléfono" />
                <button type="submit">Agregar dirección</button>
            </Form>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Agregar dirección" }))

        const street2 = screen.getByLabelText("Calle secundaria")
        const phone = screen.getByLabelText("Teléfono")

        await waitFor(() => {
            expect(street2).toHaveAttribute("aria-invalid", "true")
            expect(phone).toHaveAttribute("aria-invalid", "true")
        })
        await flushAnimationFrame()
        expect(street2).toHaveFocus()

        // Clear min(3) / required on street2 — previously stole focus to the next invalid field
        fireEvent.change(street2, { target: { name: "street2", value: "abc" } })

        await waitFor(() => {
            expect(street2).toHaveAttribute("aria-invalid", "false")
        })
        await flushAnimationFrame()

        expect(street2).toHaveFocus()
        expect(phone).not.toHaveFocus()
    })
})
