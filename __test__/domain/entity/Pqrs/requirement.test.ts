import {describe, it, expect} from "vitest"
import type {Requeriment, RequerimentType, RequirementSubtype, RequerimentTypeListParams} from "@/domain/entity/Pqrs/requirement"

describe("Pqrs requirement entity types", () => {
    it("should allow creating a requirement type with subtypes", () => {
        const subtype: RequirementSubtype = {
            id: "sub-1",
            name: "Subtype one",
        }

        const requirementType: RequerimentType = {
            id: "type-1",
            name: "Type one",
            subtypes: [subtype],
        }

        expect(requirementType.id).toBe("type-1")
        expect(requirementType.subtypes).toHaveLength(1)
        expect(requirementType.subtypes[0].id).toBe("sub-1")
    })

    it("should allow creating a requirement type with optional label", () => {
        const requirementType: RequerimentType = {
            id: "type-2",
            name: "Type two",
            label: "Label two",
            subtypes: [],
        }

        expect(requirementType.label).toBe("Label two")
    })

    it("should allow creating a requeriment", () => {
        const requeriment: Requeriment = {
            identificationNumber: "1234567890",
            identificationType: "CI",
            fullname: "Juan Pérez",
            description: "Test description",
            email: "juan@example.com",
            pqrsRequirementTypeId: "type-1",
            pqrsRequirementSubTypeId: "sub-1",
        }

        expect(requeriment.email).toBe("juan@example.com")
        expect(requeriment.pqrsRequirementTypeId).toBe("type-1")
    })

    it("should allow optional name filter in list params", () => {
        const params: RequerimentTypeListParams = {
            page: 1,
            pageSize: 100,
            name: "filter",
        }

        expect(params.name).toBe("filter")
    })
})
