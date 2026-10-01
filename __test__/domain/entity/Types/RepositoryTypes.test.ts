import { describe, it, expect } from "vitest"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"

describe("RepositoryTypes", () => {
    it("should be a frozen object", () => {
        expect(Object.isFrozen(RepositoryTypes)).toBe(true)
    })

    it("should have all expected repository symbols", () => {
        expect(typeof RepositoryTypes.AuthRepository).toBe('symbol')
        expect(typeof RepositoryTypes.BannerRepository).toBe('symbol')
        expect(typeof RepositoryTypes.PqrsRepository).toBe('symbol')
        expect(typeof RepositoryTypes.MemberRepository).toBe('symbol')
        expect(typeof RepositoryTypes.CurrencyRepository).toBe('symbol')
        expect(typeof RepositoryTypes.BasketRepository).toBe('symbol')
        expect(typeof RepositoryTypes.CampaignRepository).toBe('symbol')
        expect(typeof RepositoryTypes.CategoryRepository).toBe('symbol')
        expect(typeof RepositoryTypes.ApigeeRepository).toBe('symbol')
        expect(typeof RepositoryTypes.ProductRepository).toBe('symbol')
        expect(typeof RepositoryTypes.RequirementRepository).toBe('symbol')
    })

    it("should have correct symbol descriptions", () => {
        expect(RepositoryTypes.AuthRepository.toString()).toBe("Symbol(AuthRepository)")
        expect(RepositoryTypes.BannerRepository.toString()).toBe("Symbol(BannerRepository)")
        expect(RepositoryTypes.PqrsRepository.toString()).toBe("Symbol(PqrsRepository)")
        expect(RepositoryTypes.MemberRepository.toString()).toBe("Symbol(MemberRepository)")
        expect(RepositoryTypes.CurrencyRepository.toString()).toBe("Symbol(CurrencyRepository)")
        expect(RepositoryTypes.BasketRepository.toString()).toBe("Symbol(BasketRepository)")
        expect(RepositoryTypes.CampaignRepository.toString()).toBe("Symbol(CampaignRepository)")
        expect(RepositoryTypes.CategoryRepository.toString()).toBe("Symbol(CategoryRepository)")
        expect(RepositoryTypes.ApigeeRepository.toString()).toBe("Symbol(ApigeeRepository)")
        expect(RepositoryTypes.ProductRepository.toString()).toBe("Symbol(ProductRepository)")
        expect(RepositoryTypes.RequirementRepository.toString()).toBe("Symbol(RequirementRepository)")
    })

    it("should have unique symbols for each repository", () => {
        const symbols = Object.values(RepositoryTypes)
        const uniqueSymbols = new Set(symbols)
        expect(uniqueSymbols.size).toBe(symbols.length)
    })
})
