import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const programCurrencyAdapter = vi.fn()
    return {programCurrencyAdapter}
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}))

vi.mock("@/data/adapters/Currency/currencyAdapter", () => ({
    programCurrencyAdapter: mocks.programCurrencyAdapter,
}))

describe("CurrencyRepository", () => {
    beforeEach(() => {
        mocks.programCurrencyAdapter.mockReset()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when getProgramCurrency is called", () => {
        it("should request currencies and adapt response", async () => {
            vi.resetModules()
            const apiCurrencies = {
                entities: [
                    {type: "points", priority: 1, currencyId: "points-id"},
                    {type: "coin", priority: 1, currencyId: "coins-id"},
                ],
            }
            const adaptedCurrency = {
                pointsCurrencyId: "points-id",
                coinsCurrencyId: "coins-id",
            }

            mocks.programCurrencyAdapter.mockReturnValueOnce(adaptedCurrency)

            const {default: CurrencyRepository} = await import(
                "@/data/repository/Currency/CurrencyRepository"
            )
            const repository = new CurrencyRepository()

            const result = await repository.getProgramCurrency()

            expect(mocks.programCurrencyAdapter).toHaveBeenCalledWith(apiCurrencies)
            expect(result).toBe(adaptedCurrency)
        })
    })
})
