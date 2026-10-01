import {ListParams, StringListParam} from "@/domain/entity/List/list";

export interface Category{
    id: string
    name: string
    slug: string
    description?: string
    showName?: string
    icon?: string
    parent: {
        id: string
        slug: string
    } | null
    programCategories?: ProgramCategory[]
}

export type ProgramCategory = {
    id: string
    name: string
    description?: string
    programId: string
    iconUrl?: string
}

export interface CategoryParams extends ListParams{
    id?: StringListParam
    isMainCategory?: boolean
}

export interface CategoryGroup extends Category{
    subcategories?: CategoryGroup[]
}