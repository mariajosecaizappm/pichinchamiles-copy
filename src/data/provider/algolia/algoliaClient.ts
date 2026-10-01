import {
    AlgoliaClientParams,
    AlgoliaClientParamsMap,
    AlgoliaClientSearch,
    AlgoliaClientSortMap,
    AlgoliaHit,
    AlgoliaIndex,
    AlgoliaResponse,
} from "@/data/provider/algolia/types";
import {
    BooleanComparator,
    NumberComparator,
    SortListType,
    StringComparator,
} from "@/domain/entity/List/list";
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine";
import {
    generateSessionId,
    getCurrentSessionId,
} from "@/domain/entity/Session/sessionCookie";
type AlgoliaSearchResponse = {
    hits: Record<string, unknown>[];
    page: number;
    hitsPerPage: number;
    nbHits: number;
    nbPages: number;
    facets?: Record<string, Record<string, number>>;
};

type AlgoliaMultiQueryResponse = {
    results: AlgoliaSearchResponse[];
};

type ListParamObject = {
    value: string | string[] | number | number[] | boolean | boolean[];
    comparator: StringComparator | NumberComparator | BooleanComparator;
    and?: {
        value: number;
        comparator: NumberComparator;
    };
};

interface ParamProcessingContext {
    facetFilters: (string | string[])[];
    numericFilters: (string | string[])[];
    filtersExpressions: string[];
    query: string;
    page?: number;
    hitsPerPage?: number;
    nameMap?: AlgoliaClientParamsMap;
}

export default class AlgoliaClient {
    private readonly index: AlgoliaIndex;

    private static readonly baseParams = {
        getRankingInfo: true,
        clickAnalytics: true,
        analytics: true,
        enableABTest: false,
        snippetEllipsisText: "…",
        explain: "*",
        maxValuesPerFacet: 600,
        facets: ["*"],
        analyticsTags: ["WebPM"],
    };

    constructor(algoliaIndex: AlgoliaIndex) {
        this.index = algoliaIndex;
    }

    static async getParams(args: { params: AlgoliaClientParams; nameMap?: AlgoliaClientParamsMap; filters?: string }) {
        const { params, nameMap, filters } = args;
        const context: ParamProcessingContext = {
            facetFilters: [],
            numericFilters: [],
            filtersExpressions: [],
            query: '',
            nameMap,
        };
        const filteredParams: AlgoliaClientParams = { ...params };
        let userToken: string | undefined = filteredParams.sessionId;
        delete (filteredParams as Partial<AlgoliaClientParams>).sessionId;

        if (!userToken) {
            try {
                userToken = await getCurrentSessionId();
            } catch {
                userToken = generateSessionId();
            }
        }

        this.processParams(filteredParams, context);

        const mergedFilters = (() => {
            const built = context.filtersExpressions.join(' AND ');
            if (filters?.trim()) {
                if (built) return `(${filters}) AND (${built})`;
                return filters;
            }
            return built || undefined;
        })();

        return {
            ...this.baseParams,
            userToken,
            page: context.page,
            hitsPerPage: context.hitsPerPage,
            facetFilters: context.facetFilters,
            numericFilters: context.numericFilters,
            query: context.query,
            filters: mergedFilters,
        };
    }

    private static processParams(params: AlgoliaClientParams, context: ParamProcessingContext) {
        Object.entries(params).forEach(([paramName, paramContent]) => {
            if (paramName === 'sort') return;
            if (paramName === 'page' && typeof paramContent === 'number') {
                context.page = paramContent - 1;
                return;
            }
            if (paramName === 'pageSize' && typeof paramContent === 'number') {
                context.hitsPerPage = paramContent;
                return;
            }
            const name = this.mapName(paramName, context.nameMap);
            this.processValue(name, paramContent, context);
        });
    }

    private static processValue(name: string, paramContent: AlgoliaClientParams[string], context: ParamProcessingContext) {
        if (typeof paramContent === 'number') {
            this.pushNumeric(name, NumberComparator.EQUAL_TO, paramContent, context);
            return;
        }
        if (typeof paramContent === 'string') {
            if (paramContent === '') return;
            this.pushFacet(name, paramContent, context);
            return;
        }
        if (typeof paramContent === 'boolean') {
            this.pushFacet(name, paramContent, context);
            return;
        }
        if (Array.isArray(paramContent)) {
            this.processArray(name, paramContent, context);
            return;
        }
        if (typeof paramContent === 'object' && paramContent !== null && 'value' in paramContent && 'comparator' in paramContent) {
            this.processObject(name, paramContent as ListParamObject, context);
        }
    }

    private static processArray(name: string, paramContent: (string | number | boolean)[], context: ParamProcessingContext) {
        if (paramContent.length === 0) return;
        const first = paramContent[0];
        if (typeof first === 'number') {
            this.pushNumeric(name, NumberComparator.EQUAL_TO, paramContent as number[], context);
        } else if (typeof first === 'string' || typeof first === 'boolean') {
            this.pushFacet(name, paramContent as (string | boolean)[], context);
        }
    }

    private static processObject(name: string, paramContent: ListParamObject, context: ParamProcessingContext) {
        const { value, comparator } = paramContent;
        if (this.isStringOrStringArray(value)) {
            this.processStringObject(name, value, comparator as StringComparator, context);
            return;
        }
        if (this.isBooleanOrBooleanArray(value)) {
            this.processBooleanObject(name, value, comparator as BooleanComparator, context);
            return;
        }
        if (this.isNumberOrNumberArray(value)) {
            this.pushNumeric(name, comparator as NumberComparator, value, context);
        }

        if ('and' in paramContent && paramContent.and) {
            this.pushNumeric(name, paramContent.and.comparator, paramContent.and.value, context);
        }
    }

    private static processStringObject(name: string, value: string | string[], comparator: StringComparator, context: ParamProcessingContext) {
        if (comparator === StringComparator.EQUAL) {
            this.pushFacet(name, value, context);
        } else if (comparator === StringComparator.NOT_EQUAL) {
            this.pushFacetNot(name, value, context);
        } else if (comparator === StringComparator.CONTAINS) {
            this.addQuery(Array.isArray(value) ? value.join(' ') : value, context);
        }
    }

    private static processBooleanObject(name: string, value: boolean | boolean[], comparator: BooleanComparator, context: ParamProcessingContext) {
        if (comparator === BooleanComparator.EQUAL) {
            this.pushFacet(name, value, context);
        } else if (comparator === BooleanComparator.NOT_EQUAL) {
            this.pushFacetNot(name, value, context);
        }
    }

    private static mapName(original: string, nameMap?: AlgoliaClientParamsMap): string {
        return nameMap?.[original] ?? original;
    }

    private static pushFacet(name: string, value: string | boolean | (string | boolean)[], context: ParamProcessingContext) {
        if (Array.isArray(value)) {
            context.facetFilters.push(value.map(v => `${name}:${v}`));
        } else {
            context.facetFilters.push([`${name}:${value}`]);
        }
    }

    private static pushFacetNot(name: string, value: string | boolean | (string | boolean)[], context: ParamProcessingContext) {
        if (Array.isArray(value)) {
            value.forEach(v => context.filtersExpressions.push(`NOT ${name}:${v}`));
        } else {
            context.filtersExpressions.push(`NOT ${name}:${value}`);
        }
    }

    private static pushNumeric(name: string, comparator: NumberComparator, value: number | number[], context: ParamProcessingContext) {
        if (Array.isArray(value)) {
            if (comparator === NumberComparator.EQUAL_TO) {
                context.numericFilters.push(value.map(v => `${name}${comparator}${v}`));
            } else {
                value.forEach(v => context.numericFilters.push(`${name}${comparator}${v}`));
            }
        } else {
            context.numericFilters.push(`${name}${comparator}${value}`);
        }
    }

    private static addQuery(value: string, context: ParamProcessingContext) {
        if (value.trim() !== '') {
            context.query = value;
        }
    }

    private static isStringOrStringArray(value: unknown): value is string | string[] {
        return typeof value === 'string' || (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string');
    }

    private static isBooleanOrBooleanArray(value: unknown): value is boolean | boolean[] {
        return typeof value === 'boolean' || (Array.isArray(value) && value.length > 0 && typeof value[0] === 'boolean');
    }

    private static isNumberOrNumberArray(value: unknown): value is number | number[] {
        return typeof value === 'number' || (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number');
    }

    static getSortIndex(params: { sort?: { field: string; type: SortListType }; sortMap?: AlgoliaClientSortMap }): AlgoliaIndex | null {
        const { sort, sortMap } = params;
        if (sort?.field && sortMap?.[sort.field]) {
            return sort.type === SortListType.ASC
                ? sortMap[sort.field][SortListType.ASC]
                : sortMap[sort.field][SortListType.DESC];
        }
        return null;
    }

    private getSearchUrl(algoliaIndex: string): string {
        return `${process.env.NEXT_PUBLIC_API_URL}/search-api/v3/indexes/${algoliaIndex}/query?referer=${encodeURIComponent(process.env.NEXT_PUBLIC_SEARCH_API_REFERER ?? "")}`;
    }

    private getMultiQueryUrl(): string {
        return `${process.env.NEXT_PUBLIC_API_URL}/search-api/1/indexes/*/queries?x-algolia-agent=Algolia%2520for%2520JavaScript%2520%284.11.0%29%253B%2520Browser%2520%28lite%29&x-algolia-api-key=${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}&x-algolia-application-id=${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`;
    }

    private getRequestHeaders(): HeadersInit {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY as string,
            origin: process.env.NEXT_PUBLIC_ORIGIN as string,
            referer: process.env.NEXT_PUBLIC_ORIGIN as string,
        };
    }

    private getSearchEngine(data: AlgoliaSearchResponse, hit: AlgoliaHit, index: number): AlgoliaSearchEngine {
        const d = data as AlgoliaSearchResponse & { indexUsed?: string; queryID?: string };
        return {
            engine: SearchEngineType.ALGOLIA,
            index: d.indexUsed ?? this.index,
            queryID: d.queryID ?? '',
            objectID: typeof hit.objectID === "string" || typeof hit.objectID === "number"
                ? String(hit.objectID)
                : "",
            position: index + 1,
        };
    }

    async search<T>({ params, nameMap, adapter, sortMap, filters }: AlgoliaClientSearch<T>): Promise<AlgoliaResponse<T>> {
        const { sort, ...restParams } = params;
        const sortIndex = AlgoliaClient.getSortIndex({ sort, sortMap });
        const algoliaIndex = sortIndex ?? this.index;
        const { query, ...rest } = await AlgoliaClient.getParams({ params: restParams, nameMap, filters });

        const body = JSON.stringify({ query, ...rest });

        const response = await fetch(this.getSearchUrl(algoliaIndex), {
            method: "POST",
            headers: this.getRequestHeaders(),
            body,
        });

        const data: AlgoliaSearchResponse = await response.json()
        return {
            list: {
                data: data.hits.map((hit, index) => adapter(hit, this.getSearchEngine(data, hit, index))),
                pagination: {
                    page: data.page + 1,
                    pageSize: data.hitsPerPage,
                    total: data.nbHits,
                    totalPages: data.nbPages,
                },
            },
            facets: data.facets,
        };
    }

    async searchMultiquery<T>(queries: AlgoliaClientSearch<T>[]): Promise<AlgoliaResponse<T>[]> {
        const requests = await Promise.all(queries.map(async ({ params, nameMap, sortMap, filters }) => {
            const { sort, ...restParams } = params;
            const sortIndex = AlgoliaClient.getSortIndex({ sort, sortMap });
            const indexName = sortIndex ?? this.index;
            const { query, ...rest } = await AlgoliaClient.getParams({ params: restParams, nameMap, filters });
            return { indexName, query, ...rest };
        }));

        const response = await fetch(this.getMultiQueryUrl(), {
            method: "POST",
            headers: this.getRequestHeaders(),
            body: JSON.stringify({ requests }),
        });

        const data: AlgoliaMultiQueryResponse = await response.json()
        return (data.results ?? []).map((result, resultIndex) => ({
            list: {
                data: result.hits.map((hit, hitIndex) => queries[resultIndex].adapter(hit, this.getSearchEngine(result, hit, hitIndex))),
                pagination: {
                    page: result.page + 1,
                    pageSize: result.hitsPerPage,
                    total: result.nbHits,
                    totalPages: result.nbPages,
                },
            },
            facets: result.facets,
        }));
    }
}
