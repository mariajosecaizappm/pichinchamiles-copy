import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import DocumentTitle from "@/presentation/components/Layout/DocumentTitle"

describe("DocumentTitle", () => {
    it("should set the document title with the site name", () => {
        render(<DocumentTitle title="Oferta Tecnología" />)

        expect(document.title).toBe("Oferta Tecnología | Pichincha Miles")
    })

    it("should update the document title when title changes", () => {
        const { rerender } = render(<DocumentTitle title="Producto uno" />)

        rerender(<DocumentTitle title="Producto dos" />)

        expect(document.title).toBe("Producto dos | Pichincha Miles")
    })
})
