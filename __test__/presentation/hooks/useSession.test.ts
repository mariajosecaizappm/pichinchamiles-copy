import {renderHook, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import useSession from "@/presentation/hooks/useSession"
import {MemberType} from "@/domain/entity/Member/member"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import { EventName } from "@/presentation/analytics/types"

const mocks = vi.hoisted(() => {
    const dispatch = vi.fn()
    let state: any = {
        user: {
            information: null,
            isLogged: false,
            balance: 0,
            isValidatingSession: true,
            basket: null,
            programCurrency: null,
            consent: null,
            cif: null,
        },
    }

    const routerPush = vi.fn()
    const containerGet = vi.fn()
    const closeSession = vi.fn()
    const clearLopdPreference = vi.fn()
    const track = vi.fn()

    return {
        dispatch,
        getState: () => state,
        setState: (next: any) => {
            state = next
        },
        routerPush,
        containerGet,
        closeSession,
        clearLopdPreference,
        track,
    }
})

vi.mock("react-redux", () => ({
    useDispatch: () => mocks.dispatch,
    useSelector: (selector: any) => selector(mocks.getState()),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.routerPush,
    }),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({
        track: mocks.track,
    }),
}))

describe("useSession", () => {
    beforeEach(() => {
        mocks.dispatch.mockReset()
        mocks.routerPush.mockReset()
        mocks.containerGet.mockReset()
        mocks.closeSession.mockReset()
        mocks.clearLopdPreference.mockReset()
        mocks.track.mockReset()

        mocks.setState({
            user: {
                information: null,
                isLogged: false,
                balance: 0,
                isValidatingSession: true,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: null,
            },
        })

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.CloseSessionUseCase) {
                return {closeSession: mocks.closeSession}
            }
            if (type === UseCaseTypes.UpdateLopdUseCase) {
                return {clearLopdPreference: mocks.clearLopdPreference}
            }
            return {}
        })
    })

    describe("when onOpenAuthModal is called", () => {
        it("should dispatch openAuthModal and track OPEN_AUTH_MODAL event", () => {
            const {result} = renderHook(() => useSession())

            act(() => {
                result.current.onOpenAuthModal()
            })

            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({type: "authModal/openAuthModal"}),
            )
            expect(mocks.track).toHaveBeenCalledWith(EventName.OPEN_AUTH_MODAL)
        })
    })

    describe("when onCloseAuthModal is called", () => {
        it("should dispatch closeAuthModal", () => {
            const {result} = renderHook(() => useSession())

            act(() => {
                result.current.onCloseAuthModal()
            })

            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({type: "authModal/closeAuthModal"}),
            )
        })
    })

    describe("when initSession is called", () => {
        it("should dispatch startSession with authMember and track LOADED_USER with cif", () => {
            const {result} = renderHook(() => useSession())
            const authMember = {
                member: {memberType: MemberType.PERSONAL} as any,
                cif: "1234567890",
            } as any

            act(() => {
                result.current.initSession(authMember)
            })

            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "user/startSession",
                    payload: authMember,
                }),
            )
            expect(mocks.track).toHaveBeenCalledWith(
                EventName.LOADED_USER,
                { cif: "1234567890" },
            )
        })
    })

    describe("when closeSession is called", () => {
        it("should call use case and then dispatch closeSession and redirect", async () => {
            mocks.closeSession.mockResolvedValue(undefined)
            const {result} = renderHook(() => useSession())

            await act(async () => {
                await result.current.closeSession()
            })

            expect(mocks.closeSession).toHaveBeenCalledTimes(1)
            expect(mocks.clearLopdPreference).toHaveBeenCalledTimes(1)
            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({type: "user/closeSession"}),
            )
            expect(mocks.routerPush).toHaveBeenCalledWith("/")
        })

        it("should still dispatch closeSession and redirect when use case fails", async () => {
            mocks.closeSession.mockRejectedValue(new Error("boom"))
            const {result} = renderHook(() => useSession())

            await act(async () => {
                await result.current.closeSession()
            })

            expect(mocks.clearLopdPreference).toHaveBeenCalledTimes(1)
            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({type: "user/closeSession"}),
            )
            expect(mocks.routerPush).toHaveBeenCalledWith("/")
        })
    })

    describe("when filterBanners is called", () => {
        it("should return all banners when member is null", () => {
            const {result} = renderHook(() => useSession())
            const banners = [
                {segmentCodes: ["A"]} as any,
                {segmentCodes: ["B"]} as any,
            ]

            const filtered = result.current.filterBanners(banners as any)
            expect(filtered).toEqual(banners)
        })

        it("should filter banners by member segment when member exists", () => {
            mocks.setState({
                user: {
                    information: {segment: "A", memberType: MemberType.PERSONAL} as any,
                    isLogged: true,
                    balance: 0,
                    isValidatingSession: false,
                    basket: null,
                    programCurrency: null,
                    consent: null,
                    cif: null,
                },
            })

            const {result} = renderHook(() => useSession())
            const banners = [
                {segmentCodes: ["A", "C"]} as any,
                {segmentCodes: ["B"]} as any,
            ]

            const filtered = result.current.filterBanners(banners as any)
            expect(filtered).toEqual([banners[0]])
        })
    })

    describe("when update helper methods are called", () => {
        it("should dispatch updateBasket", () => {
            const { result } = renderHook(() => useSession())
            act(() => {
                result.current.updateBasket({ buyerId: "b", items: [] } as any)
            })
            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: "user/updateBasket" }),
            )
        })

        it("should dispatch clearBasket", () => {
            const { result } = renderHook(() => useSession())
            act(() => {
                result.current.clearBasket()
            })
            expect(mocks.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "user/updateBasket",
                    payload: { basket: null },
                }),
            )
        })

        it("should dispatch updateBalance, updateGender and updateEmail", () => {
            const { result } = renderHook(() => useSession())
            act(() => {
                result.current.updateBalance(123)
                result.current.updateGender("F")
                result.current.updateEmail("a@a.com")
            })
            expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "user/updateBalance" }))
            expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "user/updateGender" }))
            expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "user/updateEmail" }))
        })

        it("should dispatch clearConsent", () => {
            const { result } = renderHook(() => useSession())
            act(() => {
                result.current.clearConsent()
            })
            expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "user/updateConsent" }))
        })
    })
})
