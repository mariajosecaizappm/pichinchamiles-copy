import React from "react"
import {render} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import FormInput from "@/presentation/components/Form/controls/FormInput/FormInput"

const mocks = vi.hoisted(() => {
    let lastInputProps: Record<string, unknown> | null = null
    return {
        getLastInputProps: () => lastInputProps,
        setLastInputProps: (p: Record<string, unknown>) => (lastInputProps = p),
    }
})

vi.mock("@/presentation/components/Form/components/Input", async () => {
    const React = await import("react")
    return {
        Input: (props: Record<string, unknown>) => {
            mocks.setLastInputProps(props)
            return (
                <input
                    data-testid="mock-input"
                    name={props.name as string}
                    value={props.value as string ?? ""}
                    onChange={props.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    onBlur={props.onBlur as (e: React.FocusEvent<HTMLInputElement>) => void}
                    aria-label={props["aria-label"] as string}
                />
            )
        },
    }
})

describe("FormInput (Presentational)", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered with props", () => {
        it("should pass all props to Input component", () => {
            const onChange = vi.fn()
            const onBlur = vi.fn()

            render(
                <FormInput
                    name="field"
                    value="test"
                    isInvalid={false}
                    errorMessage={undefined}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-describedby={undefined}
                    aria-label="Test label"
                    errorId="field-error"
                    label="Campo"
                />,
            )

            const props = mocks.getLastInputProps()
            expect(props?.name).toBe("field")
            expect(props?.value).toBe("test")
            expect(props?.isInvalid).toBe(false)
            expect(props?.errorMessage).toBeUndefined()
            expect(props?.["aria-label"]).toBe("Test label")
            expect(props?.errorId).toBe("field-error")
        })
    })

    describe("when isInvalid is true and errorMessage is provided", () => {
        it("should pass error props to Input component", () => {
            const onChange = vi.fn()
            const onBlur = vi.fn()

            render(
                <FormInput
                    name="field"
                    value="test"
                    isInvalid={true}
                    errorMessage={<span>Error message</span>}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-describedby="field-error"
                    aria-label="Test label"
                    errorId="field-error"
                />,
            )

            const props = mocks.getLastInputProps()
            expect(props?.isInvalid).toBe(true)
            expect(props?.errorMessage).toBeTruthy()
            expect(props?.["aria-describedby"]).toBe("field-error")
        })
    })

    describe("when classNames prop is provided", () => {
        it("should merge classNames with default errorMessage class", () => {
            const onChange = vi.fn()
            const onBlur = vi.fn()

            render(
                <FormInput
                    name="field"
                    value="test"
                    isInvalid={false}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-label="Test"
                    errorId="field-error"
                    classNames={{label: "custom-label"}}
                />,
            )

            const props = mocks.getLastInputProps()
            expect(props?.classNames).toEqual({
                label: "custom-label",
                errorMessage: "text-error-500 font-body3",
            })
        })
    })
})
