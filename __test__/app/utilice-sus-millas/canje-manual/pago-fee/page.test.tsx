import {describe, it, expect, vi, beforeEach} from "vitest"

const mocks = vi.hoisted(() => ({
    dynamicImport: vi.fn(),
}))

vi.mock("next/dynamic", () => ({
    default: (importFn: any) => {
        mocks.dynamicImport.mockImplementation(importFn)
        const MockComponent = (props: any) => (
            <div data-testid="dynamic-feepay" data-props={JSON.stringify(props)}>
                dynamic-fee-pay
            </div>
        )
        return MockComponent
    }
}))

import FeePayPage from "@/app/utilice-sus-millas/canje-manual/pago-fee/page"

describe("FeePayPage", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.dynamicImport.mockReset()
    })

    it("renders without crashing", () => {
        expect(() => FeePayPage()).not.toThrow()
    })
})
