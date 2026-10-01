import { describe, it, expect } from "vitest"
import Categorization from "@/domain/entity/Category/models/Categorization"
import { Category } from "@/domain/entity/Category/structure/category"

describe("Categorization", () => {
    describe("constructor", () => {
        it("should build nested groups when parent.slug exists in the input list", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
                { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
            ]

            const categorization = new Categorization(categories)

            expect(categorization.categoryGroups).toHaveLength(1)
            expect(categorization.categoryGroups[0].slug).toBe("electronics")
            expect(categorization.categoryGroups[0].subcategories).toHaveLength(1)
            expect(categorization.categoryGroups[0].subcategories?.[0].slug).toBe("phones")
        })

        it("should treat categories whose parent is missing from the list as root", () => {
            const categories: Category[] = [
                { id: "1", name: "Phones", slug: "phones", parent: { id: "999", slug: "missing" } },
                { id: "2", name: "Tablets", slug: "tablets", parent: null },
            ]

            const categorization = new Categorization(categories)

            expect(categorization.categoryGroups).toHaveLength(2)
            expect(categorization.categoryGroups.map(c => c.slug)).toContain("phones")
            expect(categorization.categoryGroups.map(c => c.slug)).toContain("tablets")
        })

        it("should store all categories in the categories property", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
                { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
            ]

            const categorization = new Categorization(categories)

            expect(categorization.categories).toEqual(categories)
        })
    })

    describe("getCategoryBySlug", () => {
        it("should return the category group when slug exists", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryBySlug("electronics")

            expect(result).not.toBeNull()
            expect(result?.slug).toBe("electronics")
        })

        it("should return null when slug does not exist", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryBySlug("nonexistent")

            expect(result).toBeNull()
        })
    })

    describe("getSubcategoriesBySlug", () => {
        it("should return subcategories when they exist", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
                { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
                { id: "3", name: "Tablets", slug: "tablets", parent: { id: "1", slug: "electronics" } },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getSubcategoriesBySlug("electronics")

            expect(result).toHaveLength(2)
            expect(result.map(c => c.slug)).toContain("phones")
            expect(result.map(c => c.slug)).toContain("tablets")
        })

        it("should return empty array for unknown slug", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getSubcategoriesBySlug("nonexistent")

            expect(result).toEqual([])
        })

        it("should return empty array when category has no subcategories", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getSubcategoriesBySlug("electronics")

            expect(result).toEqual([])
        })
    })

    describe("getCategoryAndSubcategoriesSlugs", () => {
        it("should recursively collect slugs (parent + descendants)", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
                { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
                { id: "3", name: "Smartphones", slug: "smartphones", parent: { id: "2", slug: "phones" } },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesSlugs("electronics")

            expect(result).toEqual(["electronics", "phones", "smartphones"])
        })

        it("should return only the category slug when it has no subcategories", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesSlugs("electronics")

            expect(result).toEqual(["electronics"])
        })

        it("should return empty array for unknown slug", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesSlugs("nonexistent")

            expect(result).toEqual([])
        })
    })

    describe("getCategoryAndSubcategoriesIds", () => {
        it("should recursively collect ids (parent + descendants)", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
                { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
                { id: "3", name: "Smartphones", slug: "smartphones", parent: { id: "2", slug: "phones" } },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesIds("electronics")

            expect(result).toEqual(["1", "2", "3"])
        })

        it("should return only the category id when it has no subcategories", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesIds("electronics")

            expect(result).toEqual(["1"])
        })

        it("should return empty array for unknown slug", () => {
            const categories: Category[] = [
                { id: "1", name: "Electronics", slug: "electronics", parent: null },
            ]

            const categorization = new Categorization(categories)
            const result = categorization.getCategoryAndSubcategoriesIds("nonexistent")

            expect(result).toEqual([])
        })
    })

    describe("empty input", () => {
        it("should have empty categoryGroups and categories", () => {
            const categorization = new Categorization([])

            expect(categorization.categoryGroups).toEqual([])
            expect(categorization.categories).toEqual([])
        })
    })
})
