import { ListParams, StringListParam } from "../List/list"

export type RequerimentType = {
    id: string
    name: string,
    label?: string
    subtypes: RequirementSubtype[]
}

export type RequirementSubtype = {
    id: string
    name: string
}

export interface RequerimentTypeListParams extends ListParams {
    name?: string | StringListParam
}

export type Requeriment = {
    identificationNumber: string
    identificationType: string
    fullname: string
    description: string
    email: string
    pqrsRequirementTypeId: string
    pqrsRequirementSubTypeId: string
}