import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Help/Contact/Contact", () => ({
    default: vi.fn(),
}))

import ContactIndex, { ContactHeader, ContactForm } from "@/presentation/pages/Help/Contact"
import ContactContainer from "@/presentation/pages/Help/Contact/ContactContainer"
import ContactHeaderComponent from "@/presentation/pages/Help/Contact/Header"
import ContactFormComponent from "@/presentation/pages/Help/Contact/Form"

describe("Help/Contact index exports", () => {
    it("should export ContactContainer as default and named ContactForm and ContactHeader", () => {
        expect(ContactIndex).toBe(ContactContainer)
        expect(ContactHeader).toBe(ContactHeaderComponent)
        expect(ContactForm).toBe(ContactFormComponent)
    })
})
