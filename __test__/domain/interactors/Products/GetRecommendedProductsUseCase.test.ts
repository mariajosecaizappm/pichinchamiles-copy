import { describe, it, expect, vi, beforeEach } from "vitest";
import GetRecommendedProductsUseCase from "@/domain/interactors/Products/GetRecommendedProductsUseCase";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import { NumberComparator, SortListType } from "@/domain/entity/List/list";

const mockProductRepository = {
    getProducts: vi.fn(),
} satisfies Partial<IProductRepository> as IProductRepository;

describe("GetRecommendedProductsUseCase", () => {
    let useCase: GetRecommendedProductsUseCase;

    beforeEach(() => {
        vi.clearAllMocks();
        useCase = new GetRecommendedProductsUseCase(mockProductRepository);
    });

    describe("getPublicRecommendedProducts", () => {
        it("should fetch public recommended products from Algolia", async () => {
            const products = [{ id: "1" }, { id: "2" }];
            vi.mocked(mockProductRepository.getProducts).mockResolvedValue({
                data: products,
                pagination: { page: 1, pageSize: 12, total: 2, totalPages: 1 },
            });

            const result = await useCase.getPublicRecommendedProducts();

            expect(mockProductRepository.getProducts).toHaveBeenCalledWith({
                minPointsPrice: { value: 0, comparator: NumberComparator.GREATER_THAN },
                recommended: true,
                sort: { field: "priority", type: SortListType.ASC },
                page: 1,
                pageSize: 12,
            });
            expect(result).toEqual(products);
        });
    });
});
