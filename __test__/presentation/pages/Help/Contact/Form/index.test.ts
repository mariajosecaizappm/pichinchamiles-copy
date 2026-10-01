import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
    },
}))

vi.mock("@tanstack/react-query", () => ({
    useQuery: vi.fn(() => ({ data: [] })),
}))

import FormIndex from "@/presentation/pages/Help/Contact/Form"
import ContactFormContainer from "@/presentation/pages/Help/Contact/Form/ContactFormContainer"

describe("Help/Contact/Form index exports", () => {
    it("should export ContactFormContainer as default", () => {
        expect(FormIndex).toBe(ContactFormContainer)
    })
})
