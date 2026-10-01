/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useContext, useState, useRef} from "react"
import {render, screen, fireEvent, within, act} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import * as Yup from "yup"
import Form from "@/presentation/components/Form/context/Form"
import FormContext from "@/presentation/components/Form/context/FormContext"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ErrorCode} from "@/domain/entity/Error/structure/error"

const formikConfigRef = { last: null as any }

const formikMocks = vi.hoisted(() => ({
    setFieldValue: vi.fn(),
    resetForm: vi.fn(),
}))

vi.mock("formik", () => ({
    useFormik: (config: any) => {
        formikConfigRef.last = config
        // Use React state to ensure re-renders happen
        const [submitCount, setSubmitCount] = useState(0)
        const [errors, setErrors] = useState<Record<string, string>>({})
        const [values, setValues] = useState<Record<string, unknown>>(config.initialValues ?? {})
        const [touched, setTouched] = useState<Record<string, boolean>>({})

        const stateRef = useRef({
            submitCount: 0,
            errors: {} as Record<string, string>,
            values: (config.initialValues ?? {}) as Record<string, unknown>,
            touched: {} as Record<string, boolean>,
        })
        stateRef.current = { submitCount, errors, values, touched }

        const runValidation = (currentValues: Record<string, unknown>) => {
            let validationErrors: Record<string, string> = {}
            if (config.validationSchema) {
                try {
                    config.validationSchema.validateSync(currentValues, { abortEarly: false })
                    validationErrors = {}
                } catch (validationError: any) {
                    validationErrors = validationError.inner?.reduce((acc: Record<string, string>, error: any) => {
                        acc[error.path] = error.message
                        return acc
                    }, {}) || {}
                }
            }
            return validationErrors
        }

        const formik = {
            get values() { return stateRef.current.values },
            get errors() { return stateRef.current.errors },
            get submitCount() { return stateRef.current.submitCount },
            get touched() { return stateRef.current.touched },
            handleChange: vi.fn(),
            handleBlur: vi.fn(),
            setFieldError: vi.fn((field: string, message?: string) => {
                const newErrors = { ...stateRef.current.errors }
                if (message === undefined) {
                    delete newErrors[field]
                } else {
                    newErrors[field] = message
                }
                stateRef.current = { ...stateRef.current, errors: newErrors }
                setErrors(newErrors)
            }),
            isSubmitting: false,
            setFieldValue: (field: string, value: unknown, shouldValidate = true) => {
                formikMocks.setFieldValue(field, value)
                const nextValues = { ...stateRef.current.values, [field]: value }
                stateRef.current = { ...stateRef.current, values: nextValues }
                setValues(nextValues)
                if (shouldValidate) {
                    const validationErrors = runValidation(nextValues)
                    stateRef.current = { ...stateRef.current, errors: validationErrors }
                    setErrors(validationErrors)
                }
            },
            setFieldTouched: (field: string, isTouched = true, shouldValidate = true) => {
                const nextTouched = { ...stateRef.current.touched, [field]: isTouched }
                stateRef.current = { ...stateRef.current, touched: nextTouched }
                setTouched(nextTouched)
                if (shouldValidate) {
                    const validationErrors = runValidation(stateRef.current.values)
                    stateRef.current = { ...stateRef.current, errors: validationErrors }
                    setErrors(validationErrors)
                }
            },
            handleSubmit: (e?: any) => {
                e?.preventDefault?.()

                const validationErrors = runValidation(stateRef.current.values)
                const newSubmitCount = submitCount + 1
                stateRef.current = {
                    ...stateRef.current,
                    submitCount: newSubmitCount,
                    errors: validationErrors,
                }
                setSubmitCount(newSubmitCount)
                setErrors(validationErrors)

                return config.onSubmit(stateRef.current.values, {setSubmitting: vi.fn()})
            },
            submitForm: () => {
                const validationErrors = runValidation(stateRef.current.values)
                const newSubmitCount = submitCount + 1
                stateRef.current = {
                    ...stateRef.current,
                    submitCount: newSubmitCount,
                    errors: validationErrors,
                }
                setSubmitCount(newSubmitCount)
                setErrors(validationErrors)

                return config.onSubmit(stateRef.current.values, {setSubmitting: vi.fn()})
            },
            resetForm: formikMocks.resetForm,
            subscribe: vi.fn()
        }

        return formik
    },
}))

const ContextReader = () => {
    const ctx = useContext(FormContext)
    return (
        <div>
            <div data-testid="ctx-disabled">{String(ctx.disabled)}</div>
            <div data-testid="ctx-hasErrors">{String(ctx.hasErrors)}</div>
            <div data-testid="ctx-hasVisibleErrors">{String(ctx.hasVisibleErrors)}</div>
            <div data-testid="ctx-submitCount">{String(ctx.submitCount)}</div>
            <div data-testid="ctx-values">{JSON.stringify(ctx.values)}</div>
            <div data-testid="ctx-errors">{JSON.stringify(ctx.errors)}</div>
            <div data-testid="ctx-alert">{ctx.alert ? "yes" : "no"}</div>
        </div>
    )
}

const FieldClearer = ({ field }: { field: string }) => {
    const { setFieldValue, setFieldTouched } = useContext(FormContext)
    return (
        <button
            type="button"
            data-testid="clear-field"
            onClick={() => {
                setFieldValue(field, "", false)
                setFieldTouched?.(field, true, true)
            }}
        >
            Clear
        </button>
    )
}

describe("Form", () => {
    afterEach(() => {
        vi.clearAllMocks()
        formikMocks.setFieldValue.mockClear()
        formikMocks.resetForm.mockClear()
        document.body.innerHTML = ""
    })

    describe("when validateOnChange prop is provided", () => {
        it("should pass validateOnChange to formik when enabled", () => {
            render(
                <Form initialValues={{ name: "" }} onSubmit={vi.fn()} validateOnChange>
                    <ContextReader />
                </Form>,
            )

            expect(formikConfigRef.last?.validateOnChange).toBe(true)
        })

        it("should default validateOnChange to false", () => {
            render(
                <Form initialValues={{ name: "" }} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )

            expect(formikConfigRef.last?.validateOnChange).toBe(false)
        })
    })

    describe("when rendered with schema and children", () => {
        it("should provide form context and render children", () => {
            const schema = Yup.object({
                name: Yup.string().required(),
            })

            render(
                <Form
                    initialValues={{name: ""}}
                    schema={schema}
                    onSubmit={vi.fn().mockResolvedValue(undefined)}
                >
                    <div>child</div>
                    <ContextReader />
                </Form>,
            )

            expect(screen.getByText("child")).toBeInTheDocument()
            expect(screen.getByTestId("ctx-values")).toHaveTextContent(
                JSON.stringify({name: ""}),
            )
            expect(screen.getByTestId("ctx-disabled")).toHaveTextContent("false")
            expect(screen.getByTestId("ctx-hasErrors")).toHaveTextContent("true")
            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("false")
            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("no")
        })
    })

    describe("when submit succeeds", () => {
        it("should call onSubmit with current values", async () => {
            const onSubmit = vi.fn().mockResolvedValue(undefined)
            const schema = Yup.object({
                name: Yup.string().required(),
            })

            render(
                <Form initialValues={{name: "Ana"}} schema={schema} onSubmit={onSubmit}>
                    <button type="submit">Enviar</button>
                    <ContextReader />
                </Form>,
            )

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Enviar"}))
                await Promise.resolve()
            })

            expect(onSubmit).toHaveBeenCalledWith({name: "Ana"})
        })
    })

    describe("when rendered without schema", () => {
        it("should expose hasErrors as false", () => {
            render(
                <Form initialValues={{name: ""}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )
            expect(screen.getByTestId("ctx-hasErrors")).toHaveTextContent("false")
            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("false")
        })
    })

    describe("hasVisibleErrors functionality", () => {
        it("should have hasVisibleErrors as false initially with empty values", () => {
            const schema = Yup.object({
                name: Yup.string().required(),
            })

            render(
                <Form
                    initialValues={{name: ""}}
                    schema={schema}
                    onSubmit={vi.fn()}
                >
                    <ContextReader />
                </Form>,
            )

            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("false")
        })

        it("should have hasVisibleErrors as true when form is submitted with invalid data", async () => {
            const schema = Yup.object({
                name: Yup.string().required(),
            })

            render(
                <Form
                    initialValues={{name: ""}}
                    schema={schema}
                    onSubmit={vi.fn()}
                >
                    <button type="submit">Submit</button>
                    <ContextReader />
                </Form>,
            )

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Submit"}))
                // Wait a bit longer for the state to update
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(screen.getByTestId("ctx-submitCount")).toHaveTextContent("1")
            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("true")
        })

        it("should have hasVisibleErrors as true when a touched field is cleared and becomes invalid", async () => {
            const schema = Yup.object({
                name: Yup.string().required("Campo requerido"),
            })

            render(
                <Form
                    initialValues={{ name: "Quito" }}
                    schema={schema}
                    onSubmit={vi.fn()}
                >
                    <ContextReader />
                    <FieldClearer field="name" />
                </Form>,
            )

            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("false")

            await act(async () => {
                fireEvent.click(screen.getByTestId("clear-field"))
                await new Promise((resolve) => setTimeout(resolve, 0))
            })

            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("true")
        })

        it("should have hasVisibleErrors as false when form is submitted with valid data", async () => {
            const schema = Yup.object({
                name: Yup.string().required(),
            })

            render(
                <Form
                    initialValues={{name: "Valid Name"}}
                    schema={schema}
                    onSubmit={vi.fn()}
                >
                    <button type="submit">Submit</button>
                    <ContextReader />
                </Form>,
            )

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Submit"}))
                // Wait a bit longer for the state to update
                await new Promise(resolve => setTimeout(resolve, 0))
            })

            expect(screen.getByTestId("ctx-submitCount")).toHaveTextContent("1")
            expect(screen.getByTestId("ctx-hasVisibleErrors")).toHaveTextContent("false")
        })
    })

    describe("when imperative API is used", () => {
        it("should add and auto-dismiss alert with dismiss: true", async () => {
            vi.useFakeTimers()
            document.body.innerHTML = `<div id="formsAlert"></div>`

            const ref = React.createRef<any>()
            render(
                <Form
                    ref={ref}
                    initialValues={{}}
                    onSubmit={vi.fn()}
                    formErrorId="formsAlert"
                >
                    <ContextReader />
                </Form>,
            )

            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("no")

            await act(async () => {
                ref.current.addAlert({content: <>Error visible</>, dismiss: true})
            })
            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("yes")

            await act(async () => {
                vi.advanceTimersByTime(8000)
            })
            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("no")
            vi.useRealTimers()
        })

        it("should clear alert immediately", async () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )
            await act(async () => {
                ref.current.addAlert(<>Alerta</>)
            })
            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("yes")
            await act(async () => {
                ref.current.clearAlert()
            })
            expect(screen.getByTestId("ctx-alert")).toHaveTextContent("no")
        })

        it("should disable form via disableForm", async () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )
            expect(screen.getByTestId("ctx-disabled")).toHaveTextContent("false")
            await act(async () => {
                ref.current.disableForm(true)
            })
            expect(screen.getByTestId("ctx-disabled")).toHaveTextContent("true")
        })

        it("should invoke submitForm imperatively", async () => {
            const onSubmit = vi.fn().mockResolvedValue(undefined)
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{x: 1}} onSubmit={onSubmit}>
                    <ContextReader />
                </Form>,
            )
            await act(async () => {
                ref.current.submitForm()
                await Promise.resolve()
            })
            expect(onSubmit).toHaveBeenCalledWith({x: 1})
        })

        it("should focus on input field via focusOn method", async () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{email: ""}} onSubmit={vi.fn()}>
                    <input name="email" type="text" />
                    <ContextReader />
                </Form>,
            )
            
            const input = screen.getByRole("textbox") as HTMLInputElement
            expect(document.activeElement).not.toBe(input)
            
            await act(async () => {
                ref.current.focusOn("email")
            })
            
            expect(document.activeElement).toBe(input)
        })

        it("should do nothing when focusOn is called with non-existent field", async () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{email: ""}} onSubmit={vi.fn()}>
                    <input name="email" type="text" />
                    <ContextReader />
                </Form>,
            )
            
            await act(async () => {
                ref.current.focusOn("nonExistentField")
            })
            
            expect(document.activeElement).toBe(document.body)
        })

        it("should expose focusOn method in formRef", () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )
            
            expect(ref.current.focusOn).toBeDefined()
            expect(typeof ref.current.focusOn).toBe("function")
        })

        it("should expose setFieldValue method in formRef", () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )

            expect(ref.current.setFieldValue).toBeDefined()
            expect(typeof ref.current.setFieldValue).toBe("function")
        })

        it("should delegate setFieldValue to formik", async () => {
            const ref = React.createRef<any>()
            render(
                <Form ref={ref} initialValues={{email: "old@test.com"}} onSubmit={vi.fn()}>
                    <ContextReader />
                </Form>,
            )

            await act(async () => {
                ref.current.setFieldValue("email", "new@test.com")
            })

            expect(formikMocks.setFieldValue).toHaveBeenCalledWith("email", "new@test.com")
        })
    })

    describe("when onSubmit throws ApiError and onError returns ReactNode", () => {
        it("should render an Alert and dismiss it after 8000ms", async () => {
            vi.useFakeTimers()
            document.body.innerHTML = `<div id="formsAlert"></div>`

            const onSubmit = vi
                .fn()
                .mockRejectedValueOnce(new ApiError(ErrorCode.INVALID_USER))
            const onError = vi.fn(() => <>Mensaje de error</>)

            render(
                <Form
                    initialValues={{name: "Ana"}}
                    onSubmit={onSubmit}
                    onError={onError}
                    formErrorId="formsAlert"
                >
                    <button type="submit">Enviar</button>
                </Form>,
            )

            const errorContainer = document.getElementById("formsAlert")!

            await act(async () => {})

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Enviar"}))
                await Promise.resolve()
            })

            expect(screen.getByText("Mensaje de error")).toBeInTheDocument()

            await act(async () => {})
            expect(within(errorContainer).getByText("Mensaje de error")).toBeInTheDocument()

            await act(async () => {
                vi.advanceTimersByTime(8000)
            })

            expect(
                within(errorContainer).queryByText("Mensaje de error"),
            ).not.toBeInTheDocument()

            vi.useRealTimers()
        })
    })

    describe("when onSubmit throws ApiError and onError returns dismiss config", () => {
        it("should keep alert visible when dismiss is false", async () => {
            vi.useFakeTimers()
            document.body.innerHTML = `<div id="formsAlert"></div>`

            const onSubmit = vi
                .fn()
                .mockRejectedValueOnce(new ApiError(ErrorCode.INVALID_USER))
            const onError = vi.fn(() => ({
                content: <>Mensaje persistente</>,
                dismiss: false,
            }))

            render(
                <Form
                    initialValues={{name: "Ana"}}
                    onSubmit={onSubmit}
                    onError={onError}
                    formErrorId="formsAlert"
                >
                    <button type="submit">Enviar</button>
                </Form>,
            )

            const errorContainer = document.getElementById("formsAlert")!

            await act(async () => {})

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Enviar"}))
                await Promise.resolve()
            })

            expect(screen.getByText("Mensaje persistente")).toBeInTheDocument()

            await act(async () => {})
            expect(
                within(errorContainer).getByText("Mensaje persistente"),
            ).toBeInTheDocument()

            await act(async () => {
                vi.advanceTimersByTime(8000)
            })

            expect(
                within(errorContainer).getByText("Mensaje persistente"),
            ).toBeInTheDocument()

            vi.useRealTimers()
        })
    })

    describe("when onSubmit throws a non-ApiError", () => {
        it("should not call onError and should render default alert message", async () => {
            document.body.innerHTML = `<div id="formsAlert"></div>`

            const onSubmit = vi.fn().mockRejectedValueOnce(new Error("boom"))
            const onError = vi.fn(() => <>Mensaje</>)

            render(
                <Form
                    initialValues={{name: "Ana"}}
                    onSubmit={onSubmit}
                    onError={onError}
                    formErrorId="formsAlert"
                >
                    <button type="submit">Enviar</button>
                </Form>,
            )

            await act(async () => {
                fireEvent.click(screen.getByRole("button", {name: "Enviar"}))
                await Promise.resolve()
            })

            expect(onSubmit).toHaveBeenCalled()

            expect(onError).not.toHaveBeenCalled()
            expect(document.getElementById("formsAlert")).toBeInTheDocument()
            expect(screen.queryByText("Mensaje")).not.toBeInTheDocument()
            expect(
                screen.getByText("Ocurrió un error, inténtalo más tarde"),
            ).toBeInTheDocument()
        })
    })

    describe("when role and aria-label props are provided", () => {
        it("should render the underlying form element with the given role", () => {
            render(
                <Form initialValues={{}} onSubmit={vi.fn()} role="search">
                    <span>child</span>
                </Form>,
            )
            expect(screen.getByRole("search")).toBeInTheDocument()
        })

        it("should render the form with the given aria-label", () => {
            render(
                <Form
                    initialValues={{}}
                    onSubmit={vi.fn()}
                    role="search"
                    ariaLabel="Buscador de productos"
                >
                    <span>child</span>
                </Form>,
            )
            expect(screen.getByRole("search", { name: "Buscador de productos" })).toBeInTheDocument()
        })

        it("should not set role when prop is omitted", () => {
            const { container } = render(
                <Form initialValues={{}} onSubmit={vi.fn()}>
                    <span>child</span>
                </Form>,
            )
            expect(container.querySelector("form")).not.toHaveAttribute("role")
        })
    })
})
