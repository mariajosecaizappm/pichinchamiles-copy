import { AlgoliaHit } from "@/data/provider/algolia/types"
import { RequerimentType, RequirementSubtype } from "@/domain/entity/Pqrs/requirement"
import { getArray, getString } from "../commonAdapters"


export const getRequirementTypesAdapter = (hitValue: AlgoliaHit): RequerimentType =>{
    return {
        id: getString(hitValue.id),
        name: getString(hitValue.name),
        subtypes: getArray(hitValue.requirementSubtypeDocument).map((requirementSubtype: unknown) =>{
            return{
                id: getString((requirementSubtype as RequirementSubtype).id),
                name: getString((requirementSubtype as RequirementSubtype).name),
            }
        })
    }
}