import { ListParams, StringListParam } from "@/domain/entity/List/list"

export enum LocationGrade {
    COUNTRY = "country",
    STATE = "state",
    CITY = "city",
    ZONE = "zone",
}

export type Location = {
    id: string
    name: string
    grade: LocationGrade
    availableForDelivery: boolean
    parentId: string
}

export type LocationQuery = {
    grade: LocationGrade
    query: string
}

export interface LocationsListParams extends ListParams {
    name?: string | StringListParam
    grade?: LocationGrade
    availableForDelivery?: boolean
    parentId?: string
    query?: {
        value: string
    }
}
