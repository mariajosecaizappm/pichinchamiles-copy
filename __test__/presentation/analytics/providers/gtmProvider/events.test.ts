import { describe, expect, it } from "vitest"
import {
    loginEvents,
    activationEvents,
    redemptionEvents,
    conversionEvents,
    transferEvents,
} from "@/presentation/analytics/providers/gtmProvider/events"

const baseEventShape = {
    product: expect.any(String),
    userflow_type: expect.any(String),
}

const gtmEventShape = {
    ...baseEventShape,
    sub_product: expect.any(String),
    event: expect.any(String),
    step_name: expect.any(String),
}

describe("GTM Events", () => {
    describe("loginEvents", () => {
        it("has the expected number of login funnel steps", () => {
            expect(loginEvents).toHaveLength(9)
        })

        it("contains events with the correct base shape", () => {
            loginEvents.forEach(event => {
                expect(event).toEqual(expect.objectContaining({
                    ...gtmEventShape,
                    sub_product: "Login",
                    product: "pmiles",
                    userflow_type: "web",
                }))
            })
        })

        it("has correct event types for each step", () => {
            expect(loginEvents[0]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "01_PrincipalLogin",
            }))
            expect(loginEvents[1]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "01_PrincipalLogin",
            }))
            expect(loginEvents[2]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "02_LoginID",
            }))
            expect(loginEvents[3]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "02_LoginID",
            }))
            expect(loginEvents[4]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "03_LoginPass",
            }))
            expect(loginEvents[5]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "03_LoginPass",
            }))
            expect(loginEvents[6]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "04_LoginCodigoVerif",
            }))
            expect(loginEvents[7]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "04_LoginCodigoVerif",
            }))
            expect(loginEvents[8]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "05_LoginFinal",
            }))
        })
    })

    describe("activationEvents", () => {
        it("has the expected number of activation funnel steps", () => {
            expect(activationEvents).toHaveLength(7)
        })

        it("contains events with the correct base shape", () => {
            activationEvents.forEach(event => {
                expect(event).toEqual(expect.objectContaining({
                    ...gtmEventShape,
                    sub_product: "Activation",
                    product: "pmiles",
                    userflow_type: "web",
                }))
            })
        })

        it("has correct event types for each step", () => {
            expect(activationEvents[0]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "01_LoginID",
            }))
            expect(activationEvents[1]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "01_LoginID",
            }))
            expect(activationEvents[2]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "02_CodigoVerifi",
            }))
            expect(activationEvents[3]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "02_CodigoVerifi",
            }))
            expect(activationEvents[4]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "03_CreaPass",
            }))
            expect(activationEvents[5]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "03_CreaPass",
            }))
            expect(activationEvents[6]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "04_ActivationFinal",
            }))
        })
    })

    describe("transferEvents", () => {
        it("has the expected number of transfer funnel steps", () => {
            expect(transferEvents).toHaveLength(4)
        })

        it("contains events with the correct base shape", () => {
            transferEvents.forEach(event => {
                expect(event).toEqual(expect.objectContaining({
                    ...gtmEventShape,
                    sub_product: "transferir",
                    product: "pmiles",
                    userflow_type: "web",
                }))
            })
        })

        it("has correct event types for each step", () => {
            expect(transferEvents[0]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "01_PrincipalTransferir",
            }))
            expect(transferEvents[1]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "01_TransferirMillas",
            }))
            expect(transferEvents[2]).toEqual(expect.objectContaining({
                event: "onclick",
                step_name: "01_TransferirMillas",
            }))
            expect(transferEvents[3]).toEqual(expect.objectContaining({
                event: "funnel_step",
                step_name: "02_TransferirMillas",
            }))
        })
    })

    describe("redemptionEvents", () => {
        it("has the expected number of redemption funnel steps", () => {
            expect(redemptionEvents).toHaveLength(18)
        })

        it("contains events with the correct base shape", () => {
            redemptionEvents.forEach(event => {
                expect(event).toEqual(expect.objectContaining({
                    ...gtmEventShape,
                    sub_product: "redencion",
                    product: "pmiles",
                    userflow_type: "web",
                }))
            })
        })

        it("has correct funnel step values for key positions", () => {
            expect(redemptionEvents[0].step_name).toBe("01_Principal")
            expect(redemptionEvents[2].step_name).toBe("01_Categoria")
            expect(redemptionEvents[3].step_name).toBe("02_Subcategoria")
            expect(redemptionEvents[5].step_name).toBe("03_Shopping")
            expect(redemptionEvents[6].step_name).toBe("03_Shopping_Carrito")
            expect(redemptionEvents[7].step_name).toBe("03_Shopping_Copago")
            expect(redemptionEvents[8].step_name).toBe("03_Shopping_VerCarrito")
            expect(redemptionEvents[9].step_name).toBe("04_CarritoCompra")
            expect(redemptionEvents[11].step_name).toBe("05_CarritoCompra_Direc")
            expect(redemptionEvents[13].step_name).toBe("06_CarritoCompra_Fact")
            expect(redemptionEvents[15].step_name).toBe("07_CarritoCompra_Resum")
            expect(redemptionEvents[17].step_name).toBe("08_CarritoCompra_Exitoso")
        })
    })

    describe("conversionEvents", () => {
        it("has the expected number of conversion events", () => {
            expect(conversionEvents).toHaveLength(2)
        })

        it("has product redemption conversion event", () => {
            expect(conversionEvents[0]).toEqual(expect.objectContaining({
                event: "conversion_pmiles",
                sub_product: "redencion",
                product: "pmiles",
                userflow_type: "web",
                aux: "Productos",
            }))
        })

        it("has transfer conversion event", () => {
            expect(conversionEvents[1]).toEqual(expect.objectContaining({
                event: "conversion_pmiles",
                sub_product: "transferir",
                product: "pmiles",
                userflow_type: "web",
            }))
        })
    })
})
