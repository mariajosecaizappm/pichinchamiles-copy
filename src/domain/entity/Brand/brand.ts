import {ListParams, StringListParam} from "@/domain/entity/List/list";

export type Brand = {
    id: string
    name: string
    slug: string
}

export interface BrandParams extends ListParams{
    id?: StringListParam
    name?: StringListParam
}