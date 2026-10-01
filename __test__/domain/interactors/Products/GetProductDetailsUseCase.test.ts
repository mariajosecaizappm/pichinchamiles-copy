import { describe, it, expect, vi, beforeEach } from "vitest"
import GetProductDetailsUseCase from "@/domain/interactors/Products/GetProductDetailsUseCase"
import { Product } from "@/domain/entity/Product/product"

describe("GetProductDetailsUseCase", () => {
    const mockProduct: Product = {
        id: "prod-1",
        name: "Test Product",
        slug: "test-product",
        description: "Test description",
        brand: "Test Brand",
        categories: [],
        minPointsPrice: 100,
        unitPointsPriceWithoutDiscount: 150,
        tags: []
    } as unknown as Product

    const mockProductRepository = {
        getProductBySlug: vi.fn()
    }

    const mockVariationRepository = {
        getVariations: vi.fn()
    }


    const createUseCase = () => {
        return new GetProductDetailsUseCase(
            mockProductRepository as unknown as ReturnType<typeof mockProductRepository.getProductBySlug>,
            mockVariationRepository as unknown as ReturnType<typeof mockVariationRepository.getVariations>,
        )
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should get product details successfully", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([
            { id: "var-1", pointsPrice: 100, productId: "prod-1" },
            { id: "var-2", pointsPrice: 150, productId: "prod-1" }
        ])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result.product).toEqual(mockProduct)
        expect(result.variations).toHaveLength(2)
        expect(mockProductRepository.getProductBySlug).toHaveBeenCalledWith("test-product")
        expect(mockVariationRepository.getVariations).toHaveBeenCalledWith({
            productId: "prod-1",
            page: 1,
            pageSize: 40
        })
    })

    it("should handle empty variations", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result.product).toEqual(mockProduct)
        expect(result.variations).toHaveLength(0)
    })

    it("should handle product with no variations", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result).toEqual({
            product: mockProduct,
            variations: []
        })
    })

    it("should call repositories with correct parameters", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([])

        const useCase = createUseCase()
        await useCase.getProductDetails("my-product-slug")

        expect(mockProductRepository.getProductBySlug).toHaveBeenCalledExactlyOnceWith("my-product-slug")
        expect(mockVariationRepository.getVariations).toHaveBeenCalledExactlyOnceWith({
            productId: "prod-1",
            page: 1,
            pageSize: 40
        })
    })

    it("should pass correct page size", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([])

        const useCase = createUseCase()
        await useCase.getProductDetails("test-product")

        const variationCall = mockVariationRepository.getVariations.mock.calls[0][0]
        expect(variationCall.pageSize).toBe(40)
        expect(variationCall.page).toBe(1)
    })

    it("should handle repository errors", async () => {
        mockProductRepository.getProductBySlug.mockRejectedValue(new Error("Product not found"))

        const useCase = createUseCase()
        
        await expect(useCase.getProductDetails("non-existent")).rejects.toThrow("Product not found")
    })

    it("should handle variation repository errors", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockRejectedValue(new Error("Variations failed"))

        const useCase = createUseCase()
        
        await expect(useCase.getProductDetails("test-product")).rejects.toThrow("Variations failed")
    })

    it("should create use case with injected repositories", () => {
        const useCase = createUseCase()
        
        expect(useCase).toBeDefined()
        expect(typeof useCase.getProductDetails).toBe("function")
    })

    it("should return correct ProductVariation structure", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([{ id: "var-1", pointsPrice: 100 }])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result).toHaveProperty("product")
        expect(result).toHaveProperty("variations")
        expect(Array.isArray(result.variations)).toBe(true)
    })

    it("should handle multiple variations with different prices", async () => {
        mockProductRepository.getProductBySlug.mockResolvedValue(mockProduct)
        mockVariationRepository.getVariations.mockResolvedValue([
            { id: "var-1", pointsPrice: 100 },
            { id: "var-2", pointsPrice: 200 },
            { id: "var-3", pointsPrice: 300 }
        ])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result.variations).toHaveLength(3)
        expect(result.variations[0].pointsPrice).toBe(100)
        expect(result.variations[1].pointsPrice).toBe(200)
        expect(result.variations[2].pointsPrice).toBe(300)
    })

    it("should handle product with complex data", async () => {
        const complexProduct: Product = {
            ...mockProduct,
            features: [
                { name: "Color", option: "Red" },
                { name: "Size", option: "Large" }
            ],
            assets: [
                { id: "asset-1", desktopUrl: "http://example.com/1.jpg", type: "image", order: 1 }
            ]
        } as unknown as Product

        mockProductRepository.getProductBySlug.mockResolvedValue(complexProduct)
        mockVariationRepository.getVariations.mockResolvedValue([])

        const useCase = createUseCase()
        const result = await useCase.getProductDetails("test-product")

        expect(result.product).toEqual(complexProduct)
    })

    it("should handle empty slug", async () => {
        mockProductRepository.getProductBySlug.mockRejectedValue(new Error("Slug required"))

        const useCase = createUseCase()
        
        await expect(useCase.getProductDetails("")).rejects.toThrow("Slug required")
    })
})
