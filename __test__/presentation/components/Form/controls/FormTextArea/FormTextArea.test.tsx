import {render} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import FormTextArea from "@/presentation/components/Form/controls/FormTextArea/FormTextArea"

const mocks = vi.hoisted(() => ({
    getLastProps: vi.fn(),
}))

vi.mock("@/presentation/components/Form/components/TextArea", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.getLastProps(props)
        return <textarea data-testid="mock-textarea" {...props} />
    },
}))

describe("FormTextArea", () => {
    it("should pass name, value and onChange to the underlying TextArea", () => {
        const onChange = vi.fn()
        render(<FormTextArea name="description" value="test" onChange={onChange} label="Description" />)

        const props = mocks.getLastProps.mock.calls[0][0]
        expect(props.name).toBe("description")
        expect(props.value).toBe("test")
        expect(props.onChange).toBe(onChange)
        expect(props.label).toBe("Description")
    })
})
