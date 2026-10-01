import {describe, it, expect} from "vitest"
import {getRequirementTypesAdapter} from "@/data/adapters/Pqrs/requirementAdapter"
import {AlgoliaHit} from "@/data/provider/algolia/types"

describe("getRequirementTypesAdapter", () => {
    it("should adapt a complete algolia hit to a requirement type", () => {
        const hit: AlgoliaHit = {
            id: "type-1",
            name: "Requirement type",
            requirementSubtypeDocument: [
                {id: "sub-1", name: "Subtype one"},
                {id: "sub-2", name: "Subtype two"},
            ],
        }

        const result = getRequirementTypesAdapter(hit)

        expect(result).toEqual({
            id: "type-1",
            name: "Requirement type",
            subtypes: [
                {id: "sub-1", name: "Subtype one"},
                {id: "sub-2", name: "Subtype two"},
            ],
        })
    })

    it("should return empty strings and empty array for missing fields", () => {
        const hit: AlgoliaHit = {}

        const result = getRequirementTypesAdapter(hit)

        expect(result.id).toBe("")
        expect(result.name).toBe("")
        expect(result.subtypes).toEqual([])
    })

    it("should handle non-array requirementSubtypeDocument", () => {
        const hit: AlgoliaHit = {
            id: "type-2",
            name: "Type two",
            requirementSubtypeDocument: "invalid",
        }

        const result = getRequirementTypesAdapter(hit)

        expect(result.id).toBe("type-2")
        expect(result.name).toBe("Type two")
        expect(result.subtypes).toEqual([])
    })

    it("should coerce subtype ids and names to strings", () => {
        const hit: AlgoliaHit = {
            id: "type-3",
            name: "Type three",
            requirementSubtypeDocument: [
                {id: 123, name: null},
            ],
        }

        const result = getRequirementTypesAdapter(hit)

        expect(result.subtypes).toEqual([
            {id: "", name: ""},
        ])
    })
})
