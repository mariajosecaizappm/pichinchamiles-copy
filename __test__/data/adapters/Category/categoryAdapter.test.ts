import { describe, it, expect } from "vitest"
import { getCategoryAdapter } from "@/data/adapters/Category/categoryAdapter"

describe("getCategoryAdapter", () => {
    it("should adapt a complete Algolia hit to a Category", () => {
        const hit = {
            id: "cat-1",
            name: "Hogar",
            slug: "hogar",
            description: "Productos para el hogar",
            parentId: "parent-1",
            parentSlug: "parent-slug",
        }

        const result = getCategoryAdapter(hit)

        expect(result).toEqual({
            id: "cat-1",
            name: "Hogar",
            slug: "hogar",
            description: "Productos para el hogar",
            showName: "hogar",
            parent: {
                id: "parent-1",
                slug: "parent-slug",
            },
        })
    })

    it("should set parent to null when parentId is missing", () => {
        const hit = {
            id: "cat-2",
            name: "Cocina",
            slug: "cocina",
            description: "Artículos de cocina",
        }

        const result = getCategoryAdapter(hit)

        expect(result.parent).toBeNull()
    })

    it("should set parent to null when parentSlug is missing", () => {
        const hit = {
            id: "cat-3",
            name: "Tecnología",
            slug: "tecnologia",
            parentId: "parent-1",
        }

        const result = getCategoryAdapter(hit)

        expect(result.parent).toBeNull()
    })

    it("should return empty strings for missing string fields", () => {
        const hit = {}

        const result = getCategoryAdapter(hit)

        expect(result.id).toBe("")
        expect(result.name).toBe("")
        expect(result.slug).toBe("")
        expect(result.description).toBe("")
        expect(result.showName).toBe("")
    })

    it("should handle non-record values gracefully", () => {
        const result = getCategoryAdapter(null as unknown as Record<string, unknown>)

        expect(result.id).toBe("")
        expect(result.name).toBe("")
        expect(result.slug).toBe("")
        expect(result.parent).toBeNull()
    })

    it("should handle numeric values by returning empty strings", () => {
        const hit = {
            id: 123,
            name: 456,
            slug: true,
        }

        const result = getCategoryAdapter(hit)

        expect(result.id).toBe("")
        expect(result.name).toBe("")
        expect(result.slug).toBe("")
    })

    it("should use slug value for showName", () => {
        const hit = {
            slug: "my-category",
        }

        const result = getCategoryAdapter(hit)

        expect(result.showName).toBe("my-category")
    })
})
