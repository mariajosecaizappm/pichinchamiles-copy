export type ListParam<T, V> = T | {
    value: T
    comparator: V
}

export enum StringComparator {
    EQUAL = '=',
    NOT_EQUAL = '!=',
    CONTAINS = 'contains'
}

export type StringListParam = ListParam<string | string[], StringComparator>

export enum NumberComparator {
    EQUAL_TO = '=',
    NOT_EQUAL = '!=',
    GREATER_THAN = '>',
    LESS_THAN = '<',
    GREATER_THAN_EQUAL_TO = '>=',
    LESS_THAN_EQUAL_TO = '<='
}

export type NumberListParam = ListParam<number | number[], NumberComparator> | {
    value: number | number[]
    comparator: NumberComparator
    and?: {
        value: number
        comparator: NumberComparator
    }
}

export enum BooleanComparator {
    EQUAL = '=',
    NOT_EQUAL = '!='
}

export type BooleanListParam = ListParam<boolean | boolean[], BooleanComparator>

export enum SortListType{
    ASC = "asc",
    DESC = "desc"
}

export type SortListParam<T> = {
    field: T
    type: SortListType
}

export interface ListParams{
    sessionId?: string
    page?: number
    pageSize?: number
}

export type Pagination = {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export interface List<T>{
    data: T[]
    pagination: Pagination
}