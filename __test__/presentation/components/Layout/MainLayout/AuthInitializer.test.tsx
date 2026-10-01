import React from "react"
import {render, waitFor} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import AuthInitializer from "@/presentation/components/Layout/MainLayout/AuthInitializer"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import {setValidatingSession} from "@/presentation/redux/features/userSlice"

const mocks = vi.hoisted(() => {
    const containerGet = vi.fn()
    const loadAuthMember = vi.fn()
    const initSession = vi.fn()
    const dispatch = vi.fn()
    const tokenServiceGet = vi.fn()

    return {containerGet, loadAuthMember, initSession, dispatch, tokenServiceGet}
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("react-redux", () => ({
    useDispatch: () => mocks.dispatch,
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        initSession: mocks.initSession,
    }),
}))

vi.mock("@/domain/services/TokenService", () => ({
    default: {
        getToken: mocks.tokenServiceGet,
    },
}))

describe("AuthInitializer", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.loadAuthMember.mockReset()
        mocks.initSession.mockReset()
        mocks.dispatch.mockReset()
        mocks.tokenServiceGet.mockReset()

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.LoadAuthMemberUseCase) {
                return {loadAuthMember: mocks.loadAuthMember}
            }
            return {}
        })

        mocks.tokenServiceGet.mockResolvedValue({} as any)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when mounted", () => {
        it("should set validating true, load auth member, init session, then set validating false", async () => {
            const authMember = {member: {identificationNumber: "1723402878"}} as any
            mocks.loadAuthMember.mockResolvedValueOnce(authMember)

            render(<AuthInitializer />)

            await waitFor(() => {
                expect(mocks.dispatch).toHaveBeenCalledWith(
                    setValidatingSession({validating: true}),
                )
                expect(mocks.loadAuthMember).toHaveBeenCalledTimes(1)
                expect(mocks.initSession).toHaveBeenCalledWith(authMember)
                expect(mocks.dispatch).toHaveBeenCalledWith(
                    setValidatingSession({validating: false}),
                )
            })
        })

        it("should set validating false even when loading fails and should not init session", async () => {
            mocks.loadAuthMember.mockRejectedValueOnce(new Error("fail"))

            render(<AuthInitializer />)

            await waitFor(() => {
                expect(mocks.dispatch).toHaveBeenCalledWith(
                    setValidatingSession({validating: true}),
                )
                expect(mocks.loadAuthMember).toHaveBeenCalledTimes(1)
                expect(mocks.initSession).not.toHaveBeenCalled()
                expect(mocks.dispatch).toHaveBeenCalledWith(
                    setValidatingSession({validating: false}),
                )
            })
        })
    })

    describe("when rerendered with the same instance", () => {
        it("should run only once", async () => {
            mocks.loadAuthMember.mockResolvedValueOnce({} as any)

            const {rerender} = render(<AuthInitializer />)
            rerender(<AuthInitializer />)

            await waitFor(() => {
                expect(mocks.loadAuthMember).toHaveBeenCalledTimes(1)
                const validatingTrueCalls = mocks.dispatch.mock.calls.filter(
                    (c) => {
                        const arg = c[0]
                        return (
                            typeof arg === "object" &&
                            "payload" in arg &&
                            arg.payload?.validating === true
                        )
                    },
                )
                expect(validatingTrueCalls.length).toBe(1)
            })
        })
    })
})
