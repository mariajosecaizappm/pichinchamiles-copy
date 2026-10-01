import {describe, it, expect, vi, beforeEach} from "vitest"
import {NumberComparator, StringComparator, BooleanComparator, SortListType} from "@/domain/entity/List/list"
import {AlgoliaIndex} from "@/data/provider/algolia/types"

const fetchMock = vi.fn()

const mockFetchResponse = (data: unknown) => {
    fetchMock.mockResolvedValue(
        new Response(JSON.stringify(data), {
            status: 200,
            headers: {"Content-Type": "application/json"},
        })
    )
}

const emptySearchResponse = {
    hits: [],
    page: 0,
    hitsPerPage: 10,
    nbHits: 0,
    nbPages: 0,
}

describe("AlgoliaClient", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal("fetch", fetchMock)
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app-id"
        process.env.NEXT_PUBLIC_ALGOLIA_API_KEY = "test-api-key"
        process.env.NEXT_PUBLIC_API_URL = "https://api.test.com"
        process.env.NEXT_PUBLIC_API_KEY = "test-key"
        process.env.NEXT_PUBLIC_ORIGIN = "https://web.test.com"
        process.env.NEXT_PUBLIC_SEARCH_API_REFERER = "https://referer.test.com"
    })
    describe("getParams", () => {
        it("should build facetFilters for string params", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, componentType: "banner"},
            })
            expect(result.facetFilters).toEqual([["componentType:banner"]])
        })

        it("should build facetFilters for boolean params", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, isOutstanding: true},
            })
            expect(result.facetFilters).toEqual([["isOutstanding:true"]])
        })

        it("should build facetFilters for array params", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, positions: ["home", "footer"]},
            })
            expect(result.facetFilters).toEqual([["positions:home", "positions:footer"]])
        })

        it("should apply nameMap to rename params", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, positions: ["home"]},
                nameMap: {positions: "positions.name"},
            })
            expect(result.facetFilters).toEqual([["positions.name:home"]])
        })

        it("should build numericFilters for number params", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, priority: 5},
            })
            expect(result.numericFilters).toEqual(["priority=5"])
        })

        it("should build numericFilters for plain number arrays", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, points: [10, 20]},
            })
            expect(result.numericFilters).toEqual([["points=10", "points=20"]])
        })

        it("should set page as zero-indexed", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 3, pageSize: 10},
            })
            expect(result.page).toBe(2)
        })

        it("should set hitsPerPage from pageSize", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 20},
            })
            expect(result.hitsPerPage).toBe(20)
        })

        it("should handle StringListParam with EQUAL comparator", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    category: {value: "travel", comparator: StringComparator.EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([["category:travel"]])
        })

        it("should handle StringListParam with NOT_EQUAL comparator via filters", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    category: {value: "excluded", comparator: StringComparator.NOT_EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([])
            expect(result.filters).toBe("NOT category:excluded")
        })

        it("should handle StringListParam NOT_EQUAL with array values", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    category: {value: ["excluded-a", "excluded-b"], comparator: StringComparator.NOT_EQUAL},
                },
            })
            expect(result.filters).toContain("NOT category:excluded-a")
            expect(result.filters).toContain("NOT category:excluded-b")
        })

        it("should handle StringListParam with CONTAINS comparator as query", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    search: {value: "millas", comparator: StringComparator.CONTAINS},
                },
            })
            expect(result.query).toBe("millas")
        })

        it("should handle StringListParam with CONTAINS and array value", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    search: {value: ["millas", "viajes"], comparator: StringComparator.CONTAINS},
                },
            })
            expect(result.query).toBe("millas viajes")
        })

        it("should handle NumberListParam with GREATER_THAN comparator", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    price: {value: 100, comparator: NumberComparator.GREATER_THAN},
                },
            })
            expect(result.numericFilters).toEqual(["price>100"])
        })

        it("should handle NumberListParam with array values", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    price: {value: [100, 200], comparator: NumberComparator.EQUAL_TO},
                },
            })
            expect(result.numericFilters).toEqual([["price=100", "price=200"]])
        })

        it("should handle NumberListParam with 'and' clause for range", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    price: {
                        value: 5000,
                        comparator: NumberComparator.LESS_THAN_EQUAL_TO,
                        and: {
                            value: 1000,
                            comparator: NumberComparator.GREATER_THAN_EQUAL_TO,
                        },
                    },
                },
            })
            expect(result.numericFilters).toContain("price<=5000")
            expect(result.numericFilters).toContain("price>=1000")
        })

        it("should handle BooleanListParam with EQUAL comparator", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    active: {value: true, comparator: BooleanComparator.EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([["active:true"]])
        })

        it("should handle BooleanListParam with NOT_EQUAL comparator via filters", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    active: {value: false, comparator: BooleanComparator.NOT_EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([])
            expect(result.filters).toBe("NOT active:false")
        })

        it("should merge external filters with NOT filter expression", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    category: {value: "excluded", comparator: StringComparator.NOT_EQUAL},
                },
                filters: "active:true",
            })
            expect(result.filters).toBe("(active:true) AND (NOT category:excluded)")
        })

        it("should pass filters through when no filter expressions", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10},
                filters: "active:true",
            })
            expect(result.filters).toBe("active:true")
        })

        it("should use original param name when nameMap does not have key", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, componentType: "banner"},
                nameMap: {positions: "positions.name"},
            })
            expect(result.facetFilters).toEqual([["componentType:banner"]])
        })

        it("should include baseParams in result", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({params: {page: 1, pageSize: 10}}) as Record<string, unknown>
            expect(result.getRankingInfo).toBe(true)
            expect(result.clickAnalytics).toBe(true)
            expect(result.analyticsTags).toEqual(["WebPM"])
            expect(result.facets).toEqual(["*"])
        })

        it("should ignore empty arrays in processArray", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, positions: [] as string[], points: [] as number[]},
            })
            expect(result.facetFilters).toEqual([])
            expect(result.numericFilters).toEqual([])
        })

        it("should not set query when CONTAINS value is empty or whitespace", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    search: {value: "   ", comparator: StringComparator.CONTAINS},
                },
            })
            expect(result.query).toBe("")
        })

        it("should handle NumberListParam with NOT_EQUAL comparator (single value)", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    status: {value: 0, comparator: NumberComparator.NOT_EQUAL},
                },
            })
            expect(result.numericFilters).toEqual(["status!=0"])
        })

        it("should handle NumberListParam with array and non-EQUAL comparator (lines 210-211)", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    price: {value: [100, 200], comparator: NumberComparator.GREATER_THAN},
                },
            })
            expect(result.numericFilters).toEqual(["price>100", "price>200"])
        })

        it("should handle NumberListParam NOT_EQUAL with array values", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    level: {value: [1, 2], comparator: NumberComparator.NOT_EQUAL},
                },
            })
            expect(result.numericFilters).toEqual(["level!=1", "level!=2"])
        })

        it("should handle BooleanListParam NOT_EQUAL with array values", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    flags: {value: [true, false], comparator: BooleanComparator.NOT_EQUAL},
                },
            })
            expect(result.filters).toContain("NOT flags:true")
            expect(result.filters).toContain("NOT flags:false")
        })

        it("should handle boolean array with facetFilters (EQUAL)", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    active: [true, false],
                },
            })
            expect(result.facetFilters).toEqual([["active:true", "active:false"]])
        })

        it("should handle StringListParam EQUAL with array via object", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    category: {value: ["a", "b"], comparator: StringComparator.EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([["category:a", "category:b"]])
        })

        it("should handle BooleanListParam EQUAL with array via object", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    visible: {value: [true, false], comparator: BooleanComparator.EQUAL},
                },
            })
            expect(result.facetFilters).toEqual([["visible:true", "visible:false"]])
        })

        it("should handle NumberListParam LESS_THAN and GREATER_THAN_EQUAL_TO comparators", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const r1 = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, points: {value: 50, comparator: NumberComparator.LESS_THAN}},
            })
            expect(r1.numericFilters).toContain("points<50")
            const r2 = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, points: {value: 10, comparator: NumberComparator.GREATER_THAN_EQUAL_TO}},
            })
            expect(r2.numericFilters).toContain("points>=10")
            const r3 = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, points: {value: 100, comparator: NumberComparator.LESS_THAN_EQUAL_TO}},
            })
            expect(r3.numericFilters).toContain("points<=100")
        })

        it("should ignore empty string params (line 122 branch)", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, componentType: ""},
            })
            expect(result.facetFilters).toEqual([])
        })

        it("should use explicit sessionId as userToken and not include sessionId in facet/numeric filters", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10, sessionId: "custom-session-id-123"},
            })
            expect(result.userToken).toBe("custom-session-id-123")
            expect(result.facetFilters).toEqual([])
            expect(result.numericFilters).toEqual([])
        })

        it("should obtain userToken from getCurrentSessionId when sessionId is omitted", async () => {
            const sessionCookieModule = await import("@/domain/entity/Session/sessionCookie")
            vi.spyOn(sessionCookieModule, "getCurrentSessionId").mockResolvedValueOnce("cookie-or-store-session-id")

            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10},
            })
            expect(result.userToken).toBe("cookie-or-store-session-id")
        })

        it("should fallback to generateSessionId when getCurrentSessionId throws", async () => {
            const sessionCookieModule = await import("@/domain/entity/Session/sessionCookie")
            vi.spyOn(sessionCookieModule, "getCurrentSessionId").mockRejectedValueOnce(new Error("Storage unavailable"))
            vi.spyOn(sessionCookieModule, "generateSessionId").mockReturnValueOnce("generated-fallback-session-id")

            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {page: 1, pageSize: 10},
            })
            expect(result.userToken).toBe("generated-fallback-session-id")
        })

        it("should ignore sort key when passed directly to getParams (line 102 branch)", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await AlgoliaClient.getParams({
                params: {
                    page: 1,
                    pageSize: 10,
                    componentType: "banner",
                    sort: {field: "points", type: SortListType.ASC} as unknown as undefined,
                } as never,
            })
            expect(result.facetFilters).toEqual([["componentType:banner"]])
            expect((result as {sort?: unknown}).sort).toBeUndefined()
        })
    })

    describe("getSortIndex", () => {
        it("should return ASC index when sort type is ASC", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = AlgoliaClient.getSortIndex({
                sort: {field: "points", type: SortListType.ASC},
                sortMap: {
                    points: {
                        [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                        [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC,
                    },
                },
            })
            expect(result).toBe(AlgoliaIndex.PRODUCTS_POINTS_ASC)
        })

        it("should return DESC index when sort type is DESC", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = AlgoliaClient.getSortIndex({
                sort: {field: "points", type: SortListType.DESC},
                sortMap: {
                    points: {
                        [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                        [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC,
                    },
                },
            })
            expect(result).toBe(AlgoliaIndex.PRODUCTS_POINTS_DESC)
        })

        it("should return null when no sort is provided", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            expect(AlgoliaClient.getSortIndex({})).toBeNull()
        })

        it("should return null when sort field is not in sortMap", async () => {
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = AlgoliaClient.getSortIndex({
                sort: {field: "unknown", type: SortListType.ASC},
                sortMap: {
                    points: {
                        [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                        [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC,
                    },
                },
            })
            expect(result).toBeNull()
        })
    })

    describe("search", () => {
        it("should call fetch and return mapped response with pagination", async () => {
            vi.resetModules()
            mockFetchResponse({
                hits: [{objectID: "1", title: "Banner 1"}, {objectID: "2"}],
                page: 0,
                hitsPerPage: 10,
                nbHits: 2,
                nbPages: 1,
            })
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const client = new AlgoliaClient(AlgoliaIndex.MARKETING)
            const adapter = vi.fn((hit: Record<string, unknown>) => ({id: hit.objectID}))
            const result = await client.search({
                params: {page: 1, pageSize: 10, componentType: "banner"},
                adapter,
            })
            expect(result.list.data).toHaveLength(2)
            expect(result.list.pagination.page).toBe(1)
            expect(result.list.pagination.pageSize).toBe(10)
            expect(result.list.pagination.total).toBe(2)
            expect(result.list.pagination.totalPages).toBe(1)
            expect(adapter).toHaveBeenCalledTimes(2)
        })

        it("should call fetch with correct index URL", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const client = new AlgoliaClient(AlgoliaIndex.MARKETING)
            await client.search({params: {page: 1, pageSize: 10}, adapter: vi.fn()})
            const url = fetchMock.mock.calls[0][0] as string
            expect(url).toContain(`/search-api/v3/indexes/${AlgoliaIndex.MARKETING}/query`)
            expect(url).toContain("referer=https%3A%2F%2Freferer.test.com")
        })

        it("should pass X-Api-Key header", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: {page: 1, pageSize: 10},
                adapter: vi.fn(),
            })
            const init = fetchMock.mock.calls[0][1] as RequestInit
            expect((init.headers as Record<string, string>)["X-Api-Key"]).toBe("test-key")
        })

        it("when calling search should pass origin and referer headers", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: {page: 1, pageSize: 10},
                adapter: vi.fn(),
            })
            const init = fetchMock.mock.calls[0][1] as RequestInit
            expect((init.headers as Record<string, string>).origin).toBe("https://web.test.com")
            expect((init.headers as Record<string, string>).referer).toBe("https://web.test.com")
        })

        it("should use sort index in URL when sortMap is provided", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.PRODUCTS).search({
                params: {page: 1, pageSize: 10, sort: {field: "points", type: SortListType.ASC}},
                adapter: vi.fn(),
                sortMap: {
                    points: {
                        [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                        [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC,
                    },
                },
            })
            const url = fetchMock.mock.calls[0][0] as string
            expect(url).toContain(`/search-api/v3/indexes/${AlgoliaIndex.PRODUCTS_POINTS_ASC}/query`)
        })

        it("should return facets from response", async () => {
            vi.resetModules()
            const facets = {category: {travel: 5}}
            mockFetchResponse({...emptySearchResponse, facets})
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const result = await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: {page: 1, pageSize: 10},
                adapter: vi.fn(),
            })
            expect(result.facets).toEqual(facets)
        })

        it("should sanitize non-primitive objectID in search engine", async () => {
            vi.resetModules()
            mockFetchResponse({
                hits: [{ objectID: { bad: true }, title: "x" }],
                page: 0,
                hitsPerPage: 10,
                nbHits: 1,
                nbPages: 1,
            })
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            const adapter = vi.fn((_hit: Record<string, unknown>, searchEngine: Record<string, unknown>) => searchEngine)
            const result = await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: { page: 1, pageSize: 10 },
                adapter,
            })
            expect(result.list.data[0]).toMatchObject({ objectID: "" })
        })

        it("should use indexUsed and queryID from response when provided in searchEngine", async () => {
            vi.resetModules()
            mockFetchResponse({
                hits: [{ objectID: "42", title: "x" }],
                page: 0,
                hitsPerPage: 10,
                nbHits: 1,
                nbPages: 1,
                indexUsed: "custom-index",
                queryID: "qid-abc123",
            })
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            const adapter = vi.fn((_hit: Record<string, unknown>, searchEngine: Record<string, unknown>) => searchEngine)
            const result = await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: { page: 1, pageSize: 10 },
                adapter,
            })
            expect(result.list.data[0]).toMatchObject({
                index: "custom-index",
                queryID: "qid-abc123",
                objectID: "42",
                position: 1,
            })
        })

        it("should handle numeric objectID as string in searchEngine", async () => {
            vi.resetModules()
            mockFetchResponse({
                hits: [{ objectID: 99, title: "num" }],
                page: 0,
                hitsPerPage: 10,
                nbHits: 1,
                nbPages: 1,
            })
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            const adapter = vi.fn((_hit: Record<string, unknown>, searchEngine: Record<string, unknown>) => searchEngine)
            const result = await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: { page: 1, pageSize: 10 },
                adapter,
            })
            expect(result.list.data[0]).toMatchObject({ objectID: "99" })
        })

        it("should pass correct request body with query and filters to search", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: {
                    page: 2,
                    pageSize: 15,
                    search: { value: "hello", comparator: StringComparator.CONTAINS },
                },
                filters: "enabled:true",
                adapter: vi.fn(),
            })
            const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
            expect(body.query).toBe("hello")
            expect(body.filters).toBe("enabled:true")
            expect(body.page).toBe(1)
            expect(body.hitsPerPage).toBe(15)
            expect(body.userToken).toBeDefined()
        })

        it("should include custom sessionId as userToken in search request body", async () => {
            vi.resetModules()
            mockFetchResponse(emptySearchResponse)
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: { page: 1, pageSize: 10, sessionId: "custom-search-user-token" },
                adapter: vi.fn(),
            })
            const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
            expect(body.userToken).toBe("custom-search-user-token")
        })

        it("should handle missing NEXT_PUBLIC_SEARCH_API_REFERER (line 246 branch ??\"\")", async () => {
            vi.resetModules()
            delete process.env.NEXT_PUBLIC_SEARCH_API_REFERER
            mockFetchResponse(emptySearchResponse)
            const { default: AlgoliaClient } = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).search({
                params: { page: 1, pageSize: 10 },
                adapter: vi.fn(),
            })
            const url = fetchMock.mock.calls[0][0] as string
            expect(url).toContain("referer=")
            const refererValue = new URLSearchParams(url.split("?")[1]).get("referer")
            expect(refererValue).toBe("")
        })
    })

    describe("searchMultiquery", () => {
        it("should return mapped responses for each query", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({
                    results: [
                        {hits: [{objectID: "r1"}], page: 0, hitsPerPage: 10, nbHits: 1, nbPages: 1},
                        {hits: [], page: 0, hitsPerPage: 10, nbHits: 0, nbPages: 0},
                    ],
                }), {status: 200, headers: {"Content-Type": "application/json"}})
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const client = new AlgoliaClient(AlgoliaIndex.MARKETING)
            const a1 = vi.fn((hit: Record<string, unknown>) => ({id: hit.objectID}))
            const a2 = vi.fn((hit: Record<string, unknown>) => ({id: hit.objectID}))
            const results = await client.searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter: a1},
                {params: {page: 1, pageSize: 5}, adapter: a2},
            ])
            expect(results).toHaveLength(2)
            expect(results[0].list.data).toHaveLength(1)
            expect(results[1].list.data).toHaveLength(0)
            expect(a1).toHaveBeenCalledTimes(1)
        })

        it("should call fetch with multi-query endpoint URL", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({results: [emptySearchResponse]}), {
                    status: 200, headers: {"Content-Type": "application/json"},
                })
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter: vi.fn()},
            ])
            const url = fetchMock.mock.calls[0][0] as string
            expect(url).toContain("/search-api/1/indexes/*/queries")
        })

        it("should include correct indexName per query in request body", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({results: [emptySearchResponse, emptySearchResponse]}), {
                    status: 200, headers: {"Content-Type": "application/json"},
                })
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter: vi.fn()},
                {
                    params: {page: 1, pageSize: 10, sort: {field: "points", type: SortListType.DESC}},
                    adapter: vi.fn(),
                    sortMap: {
                        points: {
                            [SortListType.ASC]: AlgoliaIndex.PRODUCTS_POINTS_ASC,
                            [SortListType.DESC]: AlgoliaIndex.PRODUCTS_POINTS_DESC,
                        },
                    },
                },
            ])
            const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
            expect(body.requests[0].indexName).toBe(AlgoliaIndex.MARKETING)
            expect(body.requests[1].indexName).toBe(AlgoliaIndex.PRODUCTS_POINTS_DESC)
        })

        it("should return facets per result in multiquery", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({
                    results: [
                        {...emptySearchResponse, facets: {cat: {a: 1}}},
                        {...emptySearchResponse, facets: {brand: {b: 2}}},
                    ],
                }), {status: 200, headers: {"Content-Type": "application/json"}})
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const results = await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter: vi.fn()},
                {params: {page: 1, pageSize: 10}, adapter: vi.fn()},
            ])
            expect(results[0].facets).toEqual({cat: {a: 1}})
            expect(results[1].facets).toEqual({brand: {b: 2}})
        })

        it("should return empty array when results is missing in multiquery response", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({}), {
                    status: 200, headers: {"Content-Type": "application/json"},
                })
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const results = await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter: vi.fn()},
            ])
            expect(results).toEqual([])
        })

        it("should use indexUsed and queryID from each multiquery result in searchEngine", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({
                    results: [
                        {
                            hits: [{objectID: "m1"}, {objectID: "m2"}],
                            page: 0, hitsPerPage: 10, nbHits: 2, nbPages: 1,
                            indexUsed: "alt-idx-1", queryID: "mq1",
                        },
                    ],
                }), {status: 200, headers: {"Content-Type": "application/json"}})
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            const adapter = vi.fn((_hit: Record<string, unknown>, se: Record<string, unknown>) => se)
            const results = await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {params: {page: 1, pageSize: 10}, adapter},
            ])
            expect(results[0].list.data[0]).toMatchObject({
                index: "alt-idx-1", queryID: "mq1", objectID: "m1", position: 1,
            })
            expect(results[0].list.data[1]).toMatchObject({
                index: "alt-idx-1", queryID: "mq1", objectID: "m2", position: 2,
            })
        })

        it("should pass query, filters and page params in multiquery request body", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({results: [emptySearchResponse]}), {
                    status: 200, headers: {"Content-Type": "application/json"},
                })
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {
                    params: {
                        page: 3,
                        pageSize: 25,
                        name: {value: "z", comparator: StringComparator.CONTAINS},
                        category: {value: "skip", comparator: StringComparator.NOT_EQUAL},
                    },
                    filters: "status:1",
                    adapter: vi.fn(),
                },
            ])
            const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
            const req = body.requests[0]
            expect(req.indexName).toBe(AlgoliaIndex.MARKETING)
            expect(req.query).toBe("z")
            expect(req.page).toBe(2)
            expect(req.hitsPerPage).toBe(25)
            expect(req.filters).toContain("status:1")
            expect(req.filters).toContain("NOT category:skip")
        })

        it("should include userToken in each multiquery request", async () => {
            vi.resetModules()
            fetchMock.mockResolvedValue(
                new Response(JSON.stringify({results: [emptySearchResponse]}), {
                    status: 200, headers: {"Content-Type": "application/json"},
                })
            )
            const {default: AlgoliaClient} = await import("@/data/provider/algolia/algoliaClient")
            await new AlgoliaClient(AlgoliaIndex.MARKETING).searchMultiquery([
                {
                    params: {
                        page: 1,
                        pageSize: 10,
                        sessionId: "multi-query-custom-token",
                    },
                    adapter: vi.fn(),
                },
            ])
            const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
            const req = body.requests[0]
            expect(req.userToken).toBe("multi-query-custom-token")
        })
    })
})
