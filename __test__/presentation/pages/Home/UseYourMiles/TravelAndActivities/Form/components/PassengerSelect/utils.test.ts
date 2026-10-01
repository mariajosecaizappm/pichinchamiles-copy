import { describe, it, expect } from "vitest"
import { buildPassengerCategories } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/utils"
import { PassengerConfig } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect/types"

describe("buildPassengerCategories", () => {
    const mockConfig: PassengerConfig = {
        maxPassengers: 10,
        maxAdultsPassengers: 7,
        maxChildrenPassegengers: 5,
        maxInfantsPassengers: 3,
        adultsLabel: "Adultos (más de 12 años)",
        childrensLabel: "Niños (de 2 a 11 años)",
        infantsLabel: "Bebés (de 0 a 23 meses)"
    }

    it("should return all three categories when all have capacity", () => {
        const result = buildPassengerCategories(1, 0, 0, mockConfig)
        expect(result).toHaveLength(3)
        expect(result[0].key).toBe("adults")
        expect(result[0].label).toBe("Adultos (más de 12 años)")
        expect(result[0].min).toBe(1)
        expect(result[0].max).toBe(7) // config.maxAdultsPassengers = 7
        expect(result[0].value).toBe(1)
        expect(result[0].state).toBe("default")
    })

    it("should return all categories even when maxInfants is 0", () => {
        const configWithNoInfants: PassengerConfig = {
            ...mockConfig,
            maxInfantsPassengers: 0
        }
        const result = buildPassengerCategories(1, 0, 0, configWithNoInfants)
        // Implementation now always returns all 3 categories
        expect(result).toHaveLength(3)
        // Infants category exists with max = Math.min(adults, config.maxInfantsPassengers)
        // With adults=1 and maxInfantsPassengers=0, max = 0
        const infantsCategory = result.find(cat => cat.key === "infants")
        expect(infantsCategory).toBeDefined()
        expect(infantsCategory?.max).toBe(0) // Math.min(1, 0) = 0
    })

    it("should use maxAdultsPassengers for adults max", () => {
        const result = buildPassengerCategories(5, 2, 0, mockConfig)
        // Adults max = config.maxAdultsPassengers = 7
        expect(result[0].max).toBe(7)
    })

    it("should calculate max based on config values", () => {
        const result = buildPassengerCategories(8, 1, 0, mockConfig)
        // Adults max = config.maxAdultsPassengers = 7
        expect(result[0].max).toBe(7)
        // Childrens max = maxChilds < config.maxChildrenPassegengers ? maxChilds : config.maxChildrenPassegengers
        // maxChilds = config.maxPassengers - adults = 10 - 8 = 2
        // config.maxChildrenPassegengers = 5, so max = 2
        expect(result[1].max).toBe(2)
    })

    it("should use custom labels from config", () => {
        const customConfig: PassengerConfig = {
            maxPassengers: 10,
            maxAdultsPassengers: 7,
            maxChildrenPassegengers: 5,
            maxInfantsPassengers: 3,
            adultsLabel: "Adultos (desde 10 años)",
            childrensLabel: "Niños (de 3 a 9 años)",
            infantsLabel: "Bebés (de 0 a 23 meses)"
        }
        const result = buildPassengerCategories(1, 0, 0, customConfig)
        expect(result[0].label).toBe("Adultos (desde 10 años)")
        expect(result[1].label).toBe("Niños (de 3 a 9 años)")
    })

    it("should set state to default for all categories", () => {
        const result = buildPassengerCategories(1, 0, 0, mockConfig)
        expect(result.every(cat => cat.state === "default")).toBe(true)
    })

    it("should handle zero values correctly", () => {
        const result = buildPassengerCategories(0, 0, 0, mockConfig)
        expect(result).toHaveLength(3)
        expect(result[0].value).toBe(0)
        expect(result[1].value).toBe(0)
        expect(result[2].value).toBe(0)
    })

    it("should use Disney configuration values correctly", () => {
        const disneyConfig: PassengerConfig = {
            maxPassengers: 20,
            maxAdultsPassengers: 10,
            maxChildrenPassegengers: 10,
            maxInfantsPassengers: 0,
            adultsLabel: "Adultos (desde 10 años)",
            childrensLabel: "Niños (de 3 a 9 años)",
            infantsLabel: "Bebés (de 0 a 23 meses)"
        }
        const result = buildPassengerCategories(2, 3, 0, disneyConfig)
        
        // Adults max = config.maxAdultsPassengers = 10
        expect(result[0].max).toBe(10)
        
        // Childrens max = maxChilds < config.maxChildrenPassegengers ? maxChilds : config.maxChildrenPassegengers
        // maxChilds = config.maxPassengers - adults = 20 - 2 = 18
        // config.maxChildrenPassegengers = 10, so max = 10
        expect(result[1].max).toBe(10)
        
        // Infants max = Math.min(adults, config.maxInfantsPassengers) = Math.min(2, 0) = 0
        expect(result[2].max).toBe(0)
    })
})
