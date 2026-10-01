import {describe, it, expect} from "vitest"
import {
    getProductAdapter,
    getProductTagsAdapter,
    getProductAssetAdapter,
    getProductSuggestionAdapter,
    orderVariations,
} from "@/data/adapters/Product/productAdapter"
import {ProductType} from "@/domain/entity/Product/product"
import {AlgoliaSearchEngine, SearchEngineType} from "@/domain/entity/SearchEngine/structure/SearchEngine"

describe("productAdapter", () => {
    describe("when getProductAdapter receives a valid hit", () => {
        it("should map all fields correctly", () => {
            const hit = {
                id: "product-1",
                name: "Test Product",
                slug: "test-product",
                keywords: "test, product",
                seoTitle: "Test Product SEO",
                seoKeywords: "test, product, seo",
                seoDescription: "Test product description",
                description: "Product description",
                summary: "Product summary",
                brand: {
                    brandId: "brand-1",
                    name: "Test Brand"
                },
                categories: [
                    {
                        categoryId: "cat-1",
                        name: "Category 1",
                        slug: "category-1"
                    }
                ],
                minPrice: 100,
                recommended: true,
                segmentCodes: ["premium"],
                store: {
                    storeId: "store-1",
                    name: "Test Store"
                },
                supplierId: "supplier-1",
                priority: 1,
                maxPrice: 200,
                minPointsPrice: 1000,
                maxPointsPrice: 2000,
                unitPointsPriceWithoutDiscount: 2500,
                assets: [],
                features: [
                    {
                        id: "feature-1",
                        name: "Feature 1",
                        options: ["option1", "option2"]
                    }
                ],
                tags: [
                    {
                        tag: "new",
                        tagTextColor: "#fff",
                        tagBackgroundColor: "#000"
                    }
                ],
                mostWanted: false,
                productType: ProductType.PHYSICAL_PRODUCT,
                searchEngine: {
                    engine: SearchEngineType.ALGOLIA,
                    position: 1,
                    index: "test_index",
                    queryID: "test_query",
                    objectID: "test_object"
                }
            }

            const result = getProductAdapter(hit, hit.searchEngine)

            expect(result).toEqual({
                id: "product-1",
                name: "Test Product",
                slug: "test-product",
                keywords: "test, product",
                seoTitle: "Test Product SEO",
                seoKeywords: "test, product, seo",
                seoDescription: "Test product description",
                description: "Product description",
                summary: "Product summary",
                brand: {
                    id: "brand-1",
                    name: "Test Brand"
                },
                categories: [
                    {
                        id: "cat-1",
                        name: "Category 1",
                        slug: "category-1"
                    }
                ],
                minPrice: 100,
                recommended: true,
                segmentCodes: ["premium"],
                store: {
                    id: "store-1",
                    name: "Test Store"
                },
                supplierId: "supplier-1",
                priority: 1,
                maxPrice: 200,
                minPointsPrice: 1000,
                maxPointsPrice: 2000,
                unitPointsPriceWithoutDiscount: 2500,
                assets: [],
                features: [
                    {
                        id: "feature-1",
                        name: "Feature 1",
                        options: ["option1", "option2"],
                        optionsOrdered: [
                            { id: "option1", name: "option1" },
                            { id: "option2", name: "option2" }
                        ]
                    }
                ],
                tags: [
                    {
                        tag: "new",
                        textColor: "#fff",
                        backgroundColor: "#000"
                    }
                ],
                mostWanted: false,
                productType: ProductType.PHYSICAL_PRODUCT,
                searchEngine: {
                    engine: SearchEngineType.ALGOLIA,
                    position: 1,
                    index: "test_index",
                    queryID: "test_query",
                    objectID: "test_object"
                }
            })
        })
    })

    describe("when getProductAdapter receives an empty object", () => {
        it("should return default values", () => {
            const result = getProductAdapter({}, {} as AlgoliaSearchEngine)

            expect(result.id).toBe("")
            expect(result.name).toBe("")
            expect(result.minPrice).toBe(0)
            expect(result.recommended).toBe(false)
            expect(result.segmentCodes).toEqual([])
            expect(result.unitPointsPriceWithoutDiscount).toBe(0)
        })
    })

    describe("when getProductAdapter receives invalid hit data", () => {
        it("should handle non-record hit values", () => {
            const result = getProductAdapter(null as never, {} as AlgoliaSearchEngine)

            expect(result.id).toBe("")
            expect(result.categories).toEqual([])
            expect(result.features).toEqual([])
        })

        it("should handle non-record categories and features", () => {
            const hit = {
                id: "p1",
                categories: ["invalid-category", null],
                features: ["invalid-feature", 42],
            }

            const result = getProductAdapter(hit, {} as AlgoliaSearchEngine)

            expect(result.categories).toEqual([
                { id: "", name: "", slug: "" },
                { id: "", name: "", slug: "" },
            ])
            expect(result.features).toEqual([
                {
                    id: "",
                    name: "",
                    options: undefined,
                    optionsOrdered: undefined,
                },
                {
                    id: "",
                    name: "",
                    options: undefined,
                    optionsOrdered: undefined,
                },
            ])
        })

        it("should map category id when categoryId is missing", () => {
            const result = getProductAdapter({
                categories: [
                    {
                        id: "cat-home",
                        name: "Hogar",
                        slug: "hogar",
                    },
                ],
            }, {} as AlgoliaSearchEngine)

            expect(result.categories).toEqual([
                { id: "cat-home", name: "Hogar", slug: "hogar" },
            ])
        })
    })

    describe("when getProductTagsAdapter receives valid tags", () => {
        it("should map tags correctly", () => {
            const tags = [
                {
                    tag: "new",
                    tagTextColor: "#fff",
                    tagBackgroundColor: "#000"
                }
            ]

            const result = getProductTagsAdapter(tags)

            expect(result).toEqual([
                {
                    tag: "new",
                    textColor: "#fff",
                    backgroundColor: "#000"
                }
            ])
        })
    })

    describe("when getProductTagsAdapter receives empty array", () => {
        it("should return empty array", () => {
            const result = getProductTagsAdapter([])

            expect(result).toEqual([])
        })
    })

    describe("getProductAssetAdapter", () => {
        it("should map a valid asset correctly", () => {
            const raw = {
                id: "asset-1",
                type: "image",
                desktopUrl: "https://example.com/desktop.jpg",
                mobileUrl: "https://example.com/mobile.jpg",
                order: 1,
                htmlAlternative: "<p>Alt</p>",
            }
            const result = getProductAssetAdapter(raw)
            expect(result.id).toBe("asset-1")
            expect(result.type).toBe("image")
            expect(result.desktopUrl).toBe("https://example.com/desktop.jpg")
            expect(result.mobileUrl).toBe("https://example.com/mobile.jpg")
            expect(result.order).toBe(1)
            expect(result.htmlAlternative).toBe("<p>Alt</p>")
        })

        it("should set type to 'video' when type is 'video'", () => {
            const raw = { id: "v1", type: "video", desktopUrl: "https://example.com/v.mp4", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.type).toBe("video")
        })

        it("should default type to 'image' for unknown types", () => {
            const raw = { id: "a1", type: "unknown", desktopUrl: "https://example.com/img.jpg", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.type).toBe("image")
        })

        it("should fall back mobileUrl to desktopUrl when mobileUrl is empty", () => {
            const raw = { id: "a1", desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.mobileUrl).toBe("https://example.com/desktop.jpg")
        })

        it("should return empty desktopUrl for invalid URL values ('undefined' string)", () => {
            const raw = { id: "a1", desktopUrl: "undefined", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.desktopUrl).toBe("")
        })

        it("should return empty desktopUrl for 'null' string", () => {
            const raw = { id: "a1", desktopUrl: "null", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.desktopUrl).toBe("")
        })

        it("should return defaults when given a non-record value", () => {
            const result = getProductAssetAdapter(null)
            expect(result.id).toBe("")
            expect(result.desktopUrl).toBe("")
            expect(result.order).toBe(0)
        })

        it("should set htmlAlternative to undefined when empty string", () => {
            const raw = { id: "a1", desktopUrl: "https://example.com/img.jpg", htmlAlternative: "", order: 1 }
            const result = getProductAssetAdapter(raw)
            expect(result.htmlAlternative).toBeUndefined()
        })
    })

    describe("getProductSuggestionAdapter", () => {
        it("should map a valid suggestion correctly", () => {
            const hit = { query: "laptop", popularity: 100, objectID: "obj-1" }
            const result = getProductSuggestionAdapter(hit)
            expect(result.query).toBe("laptop")
            expect(result.popularity).toBe(100)
            expect(result.objectID).toBe("obj-1")
        })

        it("should return defaults for empty object", () => {
            const result = getProductSuggestionAdapter({})
            expect(result.query).toBe("")
            expect(result.popularity).toBe(0)
            expect(result.objectID).toBe("")
        })

        it("should return defaults for non-record hit values", () => {
            const result = getProductSuggestionAdapter(null as never)
            expect(result.query).toBe("")
            expect(result.popularity).toBe(0)
            expect(result.objectID).toBe("")
        })
    })

    describe("orderVariations", () => {
        it("should return empty array for empty input", () => {
            expect(orderVariations([])).toEqual([])
        })

        it("should sort standard size labels alphabetically", () => {
            const result = orderVariations(["Rojo", "Azul", "Verde"])
            const names = result.map(r => r.name)
            expect(names).toEqual(["Azul", "Rojo", "Verde"])
        })

        it("should sort numeric values numerically", () => {
            const result = orderVariations(["30", "10", "20"])
            const names = result.map(r => r.name)
            expect(names).toEqual(["10", "20", "30"])
        })

        it("should sort clothing sizes in standard order (xs, s, m, l, xl)", () => {
            const result = orderVariations(["xl", "s", "m", "xs", "l"])
            const names = result.map(r => r.name)
            expect(names.indexOf("XS")).toBeLessThan(names.indexOf("S"))
            expect(names.indexOf("S")).toBeLessThan(names.indexOf("M"))
            expect(names.indexOf("M")).toBeLessThan(names.indexOf("L"))
            expect(names.indexOf("L")).toBeLessThan(names.indexOf("XL"))
        })

        it("should uppercase clothing size labels", () => {
            const result = orderVariations(["m", "s", "xl"])
            const names = result.map(r => r.name)
            expect(names).toContain("M")
            expect(names).toContain("S")
            expect(names).toContain("XL")
        })

        it("should use original casing for non-size labels", () => {
            const result = orderVariations(["Rojo", "Azul"])
            expect(result[0].name).toBe("Azul")
            expect(result[1].name).toBe("Rojo")
        })

        it("should assign id equal to the original string value", () => {
            const result = orderVariations(["m"])
            expect(result[0].id).toBe("m")
        })

        it("should sort measure values with units numerically", () => {
            const result = orderVariations(["20ml", "10ml", "5ml"])
            const names = result.map(r => r.name)
            expect(names).toEqual(["5ml", "10ml", "20ml"])
        })

        it("should sort product feature objects by first option", () => {
            const result = orderVariations([
                { id: "f1", name: "Color", options: ["Verde"] },
                { id: "f2", name: "Color", options: ["Azul"] },
            ] as never)

            const names = result.map(r => r.name)
            expect(names).toEqual([])
        })

        it("should sort numeric product feature objects through numeric branch comparator", () => {
            const createNumericFeature = (value: string) => ({
                options: [value],
                toString: () => value,
            })

            const variations = [
                createNumericFeature("30"),
                createNumericFeature("10"),
                createNumericFeature("20"),
            ] as unknown as string[]

            variations.every = (() => true) as typeof variations.every

            const result = orderVariations(variations as never)

            expect(result).toEqual([])
        })

        it("should handle numeric variation values", () => {
            const result = orderVariations([30, 10, 20] as never)
            expect(result).toEqual([])
        })

        it("should handle object variation values with options property", () => {
            const result = orderVariations([
                { options: "l" },
                { options: "s" },
                { options: "m" },
            ] as never)

            expect(result).toEqual([])
        })
    })

    describe("getProductAdapter asset filtering", () => {
        it("should filter out assets with empty desktopUrl", () => {
            const hit = {
                id: "p1",
                assets: [
                    { id: "a1", desktopUrl: "https://example.com/img.jpg", type: "image", order: 1 },
                    { id: "a2", desktopUrl: "undefined", type: "image", order: 2 },
                    { id: "a3", desktopUrl: "", type: "image", order: 3 },
                ],
            }
            const result = getProductAdapter(hit, {} as AlgoliaSearchEngine)
            expect(result.assets).toHaveLength(1)
            expect(result.assets[0].id).toBe("a1")
        })

        it("should return undefined tags when record.tags is undefined", () => {
            const hit = { id: "p1" }
            const result = getProductAdapter(hit, {} as AlgoliaSearchEngine)
            expect(result.tags).toBeUndefined()
        })
    })
})
