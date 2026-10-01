import {
    List,
    ListParams,
    BooleanListParam,
    NumberListParam,
    SortListParam,
    SortListType,
    StringListParam,
} from "@/domain/entity/List/list";
import SearchEngine from "@/domain/entity/SearchEngine/structure/SearchEngine";

export enum AlgoliaIndex{
    LOCATIONS = 'locations',
    TRAVEL_LOCATIONS = 'travellocations',
    DONATION_PLANS = 'donation_plan',
    PQRS = 'helponwebs',
    MARKETING = 'marketing',
    PRODUCTS = 'products_pme',
    PRODUCTS_POINTS_ASC = 'products_pme_points_asc',
    PRODUCTS_POINTS_DESC = 'products_pme_points_desc',
    PRODUCTS_PRIORITY_ASC = 'products_pme_priority_asc',
    PRODUCTS_QUERY_SUGGESTIONS = 'products_pme_query_suggestions',
    CATEGORIES = 'categories',
    BRANDS = 'brands',
    VARIATIONS = 'variations'
}

type PrimitiveParam = string | number | boolean | string[] | number[] | boolean[]

export type AlgoliaClientParams = {
    [key: string]: StringListParam | NumberListParam | BooleanListParam | PrimitiveParam | SortListParam<string> | undefined
} & ListParams & {
    sort?: SortListParam<string>
}

export type AlgoliaClientParamsMap = Record<string, string>

export type AlgoliaClientSortMap = Record<string, {
    [SortListType.ASC]: AlgoliaIndex
    [SortListType.DESC]: AlgoliaIndex
}>

export type AlgoliaHit = Record<string, unknown>;

export interface AlgoliaClientSearch<T> {
    params: AlgoliaClientParams
    adapter: (hitValue: AlgoliaHit, searchEngine: SearchEngine) => T
    nameMap?: AlgoliaClientParamsMap
    sortMap?: AlgoliaClientSortMap
    filters?: string
}

export type AlgoliaResponse<T> = {
    list: List<T>
    facets?: Record<string, Record<string, number>>
}