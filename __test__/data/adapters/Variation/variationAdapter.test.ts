import {describe, it, expect} from "vitest"
import {getVariationAdapter} from "@/data/adapters/Variation/variationAdapter"

describe("getVariationAdapter", () => {
    it("should adapt basic variation from API", () => {
        const apiResponse = {
            id: "var-123",
            reference: "REF-ABC",
            stock: 10,
            storeStock: 5,
            price: 99.99,
            pointsPrice: 500,
            taxes: 12.5,
            tags: [],
            assets: [],
            features: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.id).toBe("var-123")
        expect(result.reference).toBe("REF-ABC")
        expect(result.stock).toBe(10)
        expect(result.storeStock).toBe(5)
        expect(result.price).toBe(99.99)
        expect(result.pointsPrice).toBe(500)
        expect(result.taxes).toBe(12.5)
    })

    it("should handle variation with features", () => {
        const apiResponse = {
            id: "var-456",
            features: [
                {name: "color", option: "red"},
                {name: "size", option: "M"},
            ],
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.features).toHaveLength(2)
        expect(result.features[0]).toEqual({name: "color", option: "red"})
        expect(result.features[1]).toEqual({name: "size", option: "M"})
    })

    it("should handle variation with copayment", () => {
        const apiResponse = {
            id: "var-789",
            copayment: {
                initialization: {points: 100, coins: 10},
                minimumPointsValue: 200,
                pointsConversionRatePercentage: "MC4wNQ==",
            },
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.copayment).toBeDefined()
        expect(result.copayment?.initialization.points).toBe(100)
        expect(result.copayment?.initialization.coins).toBe(10)
    })

    it("should handle undefined copayment", () => {
        const apiResponse = {
            id: "var-000",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.copayment).toBeUndefined()
    })

    it("should parse discount data", () => {
        const apiResponse = {
            id: "var-discount",
            discountType: "percentage",
            discountValue: 20,
            discountValidTo: "2024-12-31T23:59:59Z",
            discountValidFrom: "2024-01-01T00:00:00Z",
            discountTag: "20% OFF",
            discountTagBackgroundColor: "#FF0000",
            discountTagTextColor: "#FFFFFF",
            discountStatus: "active",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.discountType).toBe("percentage")
        expect(result.discountValue).toBe(20)
        expect(result.discountValidTo).toBe("2024-12-31T23:59:59Z")
        expect(result.discountValidFrom).toBe("2024-01-01T00:00:00Z")
        expect(result.discountTag).toBe("20% OFF")
        expect(result.discountTagBackgroundColor).toBe("#FF0000")
        expect(result.discountTagTextColor).toBe("#FFFFFF")
        expect(result.discountStatus).toBe("active")
    })

    it("should handle dimensions", () => {
        const apiResponse = {
            id: "var-dimensions",
            width: "10.5",
            height: "20.0",
            length: "30.25",
            weight: "1.5",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.width).toBe(10.5)
        expect(result.height).toBe(20.0)
        expect(result.length).toBe(30.25)
        expect(result.weight).toBe(1.5)
    })

    it("should handle undefined dimensions", () => {
        const apiResponse = {
            id: "var-no-dimensions",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.width).toBeUndefined()
        expect(result.height).toBeUndefined()
        expect(result.length).toBeUndefined()
        expect(result.weight).toBe(0)
    })

    it("should adapt assets with valid desktopUrl", () => {
        const apiResponse = {
            id: "var-assets",
            tags: [],
            assets: [
                {id: "asset-1", desktopUrl: "http://example.com/1.jpg", type: "image"},
                {id: "asset-2", desktopUrl: "http://example.com/2.jpg", type: "image"},
                {id: "asset-3", desktopUrl: "", type: "image"}, // Should be filtered out
            ],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.assets).toHaveLength(2)
        expect(result.assets[0].id).toBe("asset-1")
        expect(result.assets[1].id).toBe("asset-2")
    })

    it("should handle empty arrays", () => {
        const apiResponse = {
            id: "var-empty",
            tags: [],
            assets: [],
            features: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.tags).toEqual([])
        expect(result.assets).toEqual([])
        expect(result.features).toEqual([])
    })

    it("should handle null input gracefully", () => {
        const result = getVariationAdapter(null)

        expect(result.id).toBe("")
        expect(result.reference).toBe("")
        expect(result.stock).toBe(0)
        expect(result.price).toBe(0)
    })

    it("should handle non-object input", () => {
        const result = getVariationAdapter("invalid")

        expect(result.id).toBe("")
        expect(result.tags).toEqual([])
        expect(result.assets).toEqual([])
    })

    it("should adapt tags when provided", () => {
        const apiResponse = {
            id: "var-tags",
            tags: [
                {tag: "New", backgroundColor: "#00FF00", textColor: "#000000"},
                {tag: "Sale", backgroundColor: "#FF0000", textColor: "#FFFFFF"},
            ],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.tags).toHaveLength(2)
        expect(result.tags[0].tag).toBe("New")
        expect(result.tags[1].tag).toBe("Sale")
    })

    it("should adapt features with default values for missing fields", () => {
        const apiResponse = {
            id: "var-partial-features",
            features: [
                {name: "color"}, // Missing option
                {option: "large"}, // Missing name
            ],
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.features).toHaveLength(2)
        expect(result.features[0].name).toBe("color")
        expect(result.features[0].option).toBe("")
        expect(result.features[1].name).toBe("")
        expect(result.features[1].option).toBe("large")
    })

    it("should adapt searchEngine from Algolia", () => {
        const apiResponse = {
            id: "var-search",
            searchEngine: {
                objectID: "var-search",
                _highlightResult: {
                    name: { value: "Product Name", matchLevel: "full" },
                },
            },
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.searchEngine).toBeDefined()
        expect(result.searchEngine.objectID).toBe("var-search")
    })

    it("should handle zero values for numeric fields", () => {
        const apiResponse = {
            id: "var-zero",
            stock: 0,
            storeStock: 0,
            price: 0,
            pointsPrice: 0,
            taxes: 0,
            discountValue: 0,
            weight: 0,
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.stock).toBe(0)
        expect(result.price).toBe(0)
        expect(result.weight).toBe(0)
    })

    it("should handle assets without desktopUrl", () => {
        const apiResponse = {
            id: "var-no-assets",
            tags: [],
            assets: [
                {id: "asset-1"}, // Missing desktopUrl
                {id: "asset-2", desktopUrl: null},
            ],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.assets).toEqual([])
    })

    it("should handle invalid discount status", () => {
        const apiResponse = {
            id: "var-discount",
            discountStatus: "invalid_status",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.discountStatus).toBe("invalid_status")
    })

    it("should handle undefined searchEngine", () => {
        const apiResponse = {
            id: "var-no-search",
            tags: [],
            assets: [],
        }

        const result = getVariationAdapter(apiResponse)

        expect(result.searchEngine).toBeUndefined()
    })
})
