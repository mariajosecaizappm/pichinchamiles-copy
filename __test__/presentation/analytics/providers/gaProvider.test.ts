import { beforeEach, describe, expect, it, vi } from "vitest"
import gaProvider from "@/presentation/analytics/providers/gaProvider"
import { EventName } from "@/presentation/analytics/types"

const sendGAEventMock = vi.hoisted(() => vi.fn())

vi.mock("@next/third-parties/google", () => ({
    sendGAEvent: sendGAEventMock,
}))

describe("gaProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("has the correct provider name", () => {
        expect(gaProvider.name).toBe("gaProvider")
    })

    describe("when tracking LOADED_USER event", () => {
        it("sends set_cif event with padded cif (16 chars zero-padded)", () => {
            gaProvider.track({
                name: EventName.LOADED_USER,
                payload: {
                    cif: "12345",
                    identification: "encrypted-id",
                },
            })

            expect(sendGAEventMock).toHaveBeenCalledWith("event", "set_cif", {
                cif: "0000000000012345",
            })
        })

        it("pads short cifs with leading zeros to 16 characters", () => {
            gaProvider.track({
                name: EventName.LOADED_USER,
                payload: {
                    cif: "1",
                    identification: undefined,
                },
            })

            expect(sendGAEventMock).toHaveBeenCalledWith("event", "set_cif", {
                cif: "0000000000000001",
            })
        })

        it("does not truncate cifs longer than 16 characters", () => {
            gaProvider.track({
                name: EventName.LOADED_USER,
                payload: {
                    cif: "12345678901234567890",
                    identification: undefined,
                },
            })

            expect(sendGAEventMock).toHaveBeenCalledWith("event", "set_cif", {
                cif: "12345678901234567890",
            })
        })

        it("does not send any event when cif is empty/falsy", () => {
            gaProvider.track({
                name: EventName.LOADED_USER,
                payload: {
                    cif: "",
                    identification: undefined,
                },
            })

            expect(sendGAEventMock).not.toHaveBeenCalled()
        })
    })

    describe("when tracking other events", () => {
        it("does not send GA events for non-LOADED_USER events", () => {
            gaProvider.track({
                name: EventName.VIEWED_PRODUCTS,
                payload: {
                    products: [],
                    identification: undefined,
                },
            })

            gaProvider.track({
                name: EventName.LOGIN,
                payload: {
                    status: "success",
                    identification: undefined,
                },
            })

            gaProvider.track({
                name: EventName.VIEWED_HOME,
                payload: {
                    identification: undefined,
                },
            })

            expect(sendGAEventMock).not.toHaveBeenCalled()
        })
    })
})
