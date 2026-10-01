import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import TextArea from "@/presentation/components/Form/components/TextArea/TextArea"

const mocks = vi.hoisted(() => ({
    getLastProps: vi.fn(),
}))

vi.mock("@heroui/react", () => ({
    Textarea: (props: Record<string, unknown>) => {
        mocks.getLastProps(props)
        return <textarea data-testid="heroui-textarea" {...props} />
    },
}))

const getLastProps = () => mocks.getLastProps.mock.calls[mocks.getLastProps.mock.calls.length - 1][0]

describe("TextArea", () => {
    it("should pass name, value and onChange to the heroUI Textarea", () => {
        const onChange = vi.fn()
        render(<TextArea name="description" value="test value" onChange={onChange} label="Description" />)

        expect(screen.getByTestId("heroui-textarea")).toBeInTheDocument()
        expect(mocks.getLastProps).toHaveBeenCalled()
    })

    it("should pass labelPlacement outside to the underlying component", () => {
        render(<TextArea name="field" value="" onChange={vi.fn()} label="Field" />)
        const props = getLastProps()
        expect(props.labelPlacement).toBe("outside")
    })

    it("should apply default classNames", () => {
        render(<TextArea name="field" value="" onChange={vi.fn()} label="Field" classNames={{label: "custom-label"}} />)
        const props = getLastProps()
        expect(props.classNames.label).toBe("text-sm font-semibold leading-4 !mb-2 !text-grayscale-500 group-data-[disabled=true]:!text-grayscale-500 group-data-[disabled=true]:!opacity-100")
        expect(props.classNames.errorMessage).toBe("text-error-500 font-body3")
    })

    it("should set isInvalid styles when isInvalid is true", () => {
        render(<TextArea name="field" value="" onChange={vi.fn()} label="Field" isInvalid />)
        const props = getLastProps()
        expect(props.classNames.input).toContain("!text-error-500")
        expect(props.classNames.inputWrapper).toContain("!border-error-500")
    })
})
