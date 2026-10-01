import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => {
    let state: any = {
        user: {
            isLogged: false,
        },
    }

    const containerGet = vi.fn()
    const isValidUvSession = vi.fn()
    const refresh = vi.fn()

    return {
        getState: () => state,
        setState: (next: any) => {
            state = next
        },
        containerGet,
        isValidUvSession,
        refresh,
    }
})

vi.mock("react-redux", () => ({
    useSelector: (selector: any) => selector(mocks.getState()),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession"

describe("useUvSession", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset()
        mocks.isValidUvSession.mockReset()
        mocks.refresh.mockReset()

        mocks.setState({
            user: {
                isLogged: false,
            },
        })

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.VerifyUvSessionUseCase) {
                return { isValidUvSession: mocks.isValidUvSession }
            }
            if (type === UseCaseTypes.RefreshTokenUseCase) {
                return { refresh: mocks.refresh }
            }
            return {}
        })
    })

    describe("when verifyUvSession is called", () => {
        it("should resolve use cases from container", () => {
            renderHook(() => useUvSession())

            expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.VerifyUvSessionUseCase)
            expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.RefreshTokenUseCase)
        })

        it("should not refresh token when user is not logged", async () => {
            mocks.isValidUvSession.mockReturnValue(false)

            const { result } = renderHook(() => useUvSession())

            await act(async () => {
                await result.current.verifyUvSession()
            })

            expect(mocks.isValidUvSession).toHaveBeenCalledTimes(1)
            expect(mocks.refresh).not.toHaveBeenCalled()
        })

        it("should not refresh token when user is logged and UV session is valid", async () => {
            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            mocks.isValidUvSession.mockReturnValue(true)

            const { result } = renderHook(() => useUvSession())

            await act(async () => {
                await result.current.verifyUvSession()
            })

            expect(mocks.isValidUvSession).toHaveBeenCalledTimes(1)
            expect(mocks.refresh).not.toHaveBeenCalled()
        })

        it("should refresh token when user is logged and UV session is not valid", async () => {
            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            mocks.isValidUvSession.mockReturnValueOnce(false)
            mocks.isValidUvSession.mockReturnValueOnce(true)
            mocks.refresh.mockResolvedValue(undefined)

            const { result } = renderHook(() => useUvSession())

            await act(async () => {
                await result.current.verifyUvSession()
            })

            expect(mocks.isValidUvSession).toHaveBeenCalledTimes(2)
            expect(mocks.refresh).toHaveBeenCalledTimes(1)
        })

        it("should await refresh token completion", async () => {
            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            let uvValid = false
            mocks.isValidUvSession.mockImplementation(() => uvValid)

            let resolveRefresh: () => void = () => {}
            const refreshPromise = new Promise<void>((resolve) => {
                resolveRefresh = resolve
            })
            mocks.refresh.mockImplementation(() => refreshPromise.then(() => {
                uvValid = true
            }))

            const { result } = renderHook(() => useUvSession())

            let verifyCompleted = false
            let verifyError: unknown = null
            act(() => {
                result.current.verifyUvSession().then(
                    () => { verifyCompleted = true },
                    (e) => { verifyError = e }
                )
            })

            expect(verifyCompleted).toBe(false)

            await act(async () => {
                resolveRefresh()
                await refreshPromise
            })

            await act(async () => {
                await new Promise(process.nextTick)
            })

            expect(verifyError).toBeNull()
            expect(verifyCompleted).toBe(true)
            expect(mocks.refresh).toHaveBeenCalledTimes(1)
        })

        it("should throw error when refresh token fails", async () => {
            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            mocks.isValidUvSession.mockReturnValue(false)
            const error = new Error("refresh failed")
            mocks.refresh.mockRejectedValue(error)

            const { result } = renderHook(() => useUvSession())

            let caughtError: unknown = null
            await act(async () => {
                try {
                    await result.current.verifyUvSession()
                } catch (e) {
                    caughtError = e
                }
            })

            expect(caughtError).toBe(error)
        })

        it("should read isLogged from redux state", async () => {
            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            mocks.isValidUvSession.mockReturnValue(true)

            const { result, rerender } = renderHook(() => useUvSession())
            await act(async () => {
                await result.current.verifyUvSession()
            })
            expect(mocks.refresh).not.toHaveBeenCalled()

            mocks.setState({
                user: {
                    isLogged: true,
                },
            })
            mocks.isValidUvSession.mockReset()
            mocks.isValidUvSession.mockReturnValueOnce(false)
            mocks.isValidUvSession.mockReturnValueOnce(true)
            rerender()
            await act(async () => {
                await result.current.verifyUvSession()
            })
            expect(mocks.refresh).toHaveBeenCalledTimes(1)
        })
    })
})
