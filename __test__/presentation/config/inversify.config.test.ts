import {describe, it, expect, vi} from "vitest"

vi.mock("algoliasearch", () => ({
    algoliasearch: () => ({
        searchSingleIndex: vi.fn(),
    }),
}))

import container from "@/presentation/config/inversify.config"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import ServiceTypes from "@/domain/entity/Types/ServiceTypes"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

describe("inversify.config", () => {
    it("should have AuthRepository bound", () => {
        expect(container.isBound(RepositoryTypes.AuthRepository)).toBe(true)
    })

    it("should have BannerRepository bound", () => {
        expect(container.isBound(RepositoryTypes.BannerRepository)).toBe(true)
    })

    it("should have MemberRepository bound", () => {
        expect(container.isBound(RepositoryTypes.MemberRepository)).toBe(true)
    })

    it("should have CurrencyRepository bound", () => {
        expect(container.isBound(RepositoryTypes.CurrencyRepository)).toBe(true)
    })

    it("should have BasketRepository bound", () => {
        expect(container.isBound(RepositoryTypes.BasketRepository)).toBe(true)
    })

    it("should have PaymentRepository bound", () => {
        expect(container.isBound(RepositoryTypes.PaymentRepository)).toBe(true)
    })

    it("should have OrderRepository bound", () => {
        expect(container.isBound(RepositoryTypes.OrderRepository)).toBe(true)
    })

    it("should have TransactionRepository bound", () => {
        expect(container.isBound(RepositoryTypes.TransactionRepository)).toBe(true)
    })

    it("should have RequirementRepository bound", () => {
        expect(container.isBound(RepositoryTypes.RequirementRepository)).toBe(true)
    })

    it("should have EncryptionService bound", () => {
        expect(container.isBound(ServiceTypes.EncryptionService)).toBe(true)
    })

    it("should have RefreshTokenUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.RefreshTokenUseCase)).toBe(true)
    })

    it("should have GetHomeContentUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetHomeContentUseCase)).toBe(true)
    })

    it("should have LoadAuthMemberUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.LoadAuthMemberUseCase)).toBe(true)
    })

    it("should have CloseSessionUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.CloseSessionUseCase)).toBe(true)
    })

    it("should have UpdateMemberUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.UpdateMemberUseCase)).toBe(true)
    })

    it("should have GetExploreProductsContentUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetExploreProductsContentUseCase)).toBe(true)
    })

    it("should have GetDisneySearchUrlUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetDisneySearchUrlUseCase)).toBe(true)
    })

    it("should have ProductsSearchUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.ProductsSearchUseCase)).toBe(true)
    })

    it("should have GetTravelsContentUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetTravelsContentUseCase)).toBe(true)
    })

    it("should have GetHotelsLocationsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetHotelsLocationsUseCase)).toBe(true)
    })

    it("should have GetHotelsSearchUrlUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetHotelsSearchUrlUseCase)).toBe(true)
    })

    it("should have GetActivitiesLocationsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetActivitiesLocationsUseCase)).toBe(true)
    })

    it("should have GetActivitiesSearchUrlUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetActivitiesSearchUrlUseCase)).toBe(true)
    })

    it("should have GetCarRentalSearchUrlUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetCarRentalSearchUrlUseCase)).toBe(true)
    })

    it("should have GetCarRentalLocationsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetCarRentalLocationsUseCase)).toBe(true)
    })

    it("should have GetRecommendedProductsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetRecommendedProductsUseCase)).toBe(true)
    })

    it("should have AddProductToCartUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.AddProductToCartUseCase)).toBe(true)
    })

    it("should have GetOfferCampaignUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetOfferCampaignUseCase)).toBe(true)
    })

    it("should have GetPaymentStatusUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetPaymentStatusUseCase)).toBe(true)
    })

    it("should have ProductRedemptionUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.ProductRedemptionUseCase)).toBe(true)
    })

    it("should have GetKountSessionUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetKountSessionUseCase)).toBe(true)
    })

    it("should have GetBankStatementUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetBankStatementUseCase)).toBe(true)
    })

    it("should have ExportTransactionsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.ExportTransactionsUseCase)).toBe(true)
    })

    it("should have GetTransactionsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetTransactionsUseCase)).toBe(true)
    })

    it("should have GetRequierimentTypesUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetRequierimentTypesUseCase)).toBe(true)
    })

    it("should have CreateRequerimentUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.CreateRequerimentUseCase)).toBe(true)
    })

    it("should have EncryptTextUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.EncryptTextUseCase)).toBe(true)
    })

    it("should have GetFeePaymentUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetFeePaymentUseCase)).toBe(true)
    })

    it("should have GetFaqsUseCase bound", () => {
        expect(container.isBound(UseCaseTypes.GetFaqsUseCase)).toBe(true)
    })
})
