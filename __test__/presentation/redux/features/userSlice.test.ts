import {describe, it, expect} from "vitest"
import userReducer, {
    closeSession,
    setValidatingSession,
    startSession,
    updateBalance,
    updateBasket,
    updateConsent,
    updateEmail,
    updateGender,
    updateMemberLegalConsent,
} from "@/presentation/redux/features/userSlice"
import {MemberType} from "@/domain/entity/Member/member"

describe("userSlice", () => {
    describe("when reducer initializes", () => {
        it("should return the initial state", () => {
            const state = userReducer(undefined, {type: "unknown"})

            expect(state).toEqual({
                information: null,
                balance: 0,
                programCurrency: null,
                isLogged: false,
                isValidatingSession: true,
                basket: null,
                cif: "",
                consent: null,
            })
        })
    })

    describe("when startSession is dispatched", () => {
        it("should set user information and mark session as logged", () => {
            const authMember = {
                member: {memberType: MemberType.PERSONAL, enrollmentEmail: "a@b.com"} as any,
                balance: 100,
                currency: {code: "USD"} as any,
                basket: {items: []} as any,
                cif: "cif-123",
                consent: {accepted: true} as any,
            }

            const state = userReducer(undefined, startSession(authMember as any))

            expect(state.isLogged).toBe(true)
            expect(state.information).toBe(authMember.member)
            expect(state.balance).toBe(100)
            expect(state.programCurrency).toBe(authMember.currency)
            expect(state.basket).toBe(authMember.basket)
            expect(state.cif).toBe("cif-123")
            expect(state.consent).toBe(authMember.consent)
        })
    })

    describe("when closeSession is dispatched", () => {
        it("should reset session state", () => {
            const startState = {
                information: {memberType: MemberType.PERSONAL} as any,
                balance: 50,
                programCurrency: {code: "USD"} as any,
                isLogged: true,
                isValidatingSession: false,
                basket: {items: [1]} as any,
                cif: "cif-123",
                consent: {accepted: true} as any,
            }

            const state = userReducer(startState as any, closeSession())

            expect(state).toEqual({
                information: null,
                programCurrency: null,
                balance: 0,
                isLogged: false,
                isValidatingSession: false,
                basket: null,
                cif: "",
                consent: null,
            })
        })
    })

    describe("when updateBalance is dispatched", () => {
        it("should update balance", () => {
            const startState = userReducer(undefined, {type: "unknown"})
            const state = userReducer(startState, updateBalance({balance: 999}))
            expect(state.balance).toBe(999)
        })
    })

    describe("when updateEmail is dispatched", () => {
        it("should update enrollmentEmail when information exists", () => {
            const startState = {
                ...userReducer(undefined, {type: "unknown"}),
                information: {enrollmentEmail: "old@b.com", memberType: MemberType.PERSONAL} as any,
            }
            const state = userReducer(startState as any, updateEmail({email: "new@b.com"}))
            expect(state.information?.enrollmentEmail).toBe("new@b.com")
        })

        it("should not update enrollmentEmail when information is missing", () => {
            const startState = userReducer(undefined, {type: "unknown"})
            const state = userReducer(startState, updateEmail({email: "new@b.com"}))
            expect(state.information).toBeNull()
        })
    })

    describe("when updateGender is dispatched", () => {
        it("should update gender when member is personal", () => {
            const startState = {
                ...userReducer(undefined, {type: "unknown"}),
                information: {gender: "M", memberType: MemberType.PERSONAL} as any,
            }
            const state = userReducer(startState as any, updateGender({gender: "F"}))
            expect((state.information as any)?.gender).toBe("F")
        })

        it("should not update gender when member is corporate", () => {
            const startState = {
                ...userReducer(undefined, {type: "unknown"}),
                information: {gender: "M", memberType: MemberType.CORPORATE} as any,
            }
            const state = userReducer(startState as any, updateGender({gender: "F"}))
            expect((state.information as any)?.gender).toBe("M")
        })
    })

    describe("when updateBasket is dispatched", () => {
        it("should update basket", () => {
            const startState = userReducer(undefined, {type: "unknown"})
            const state = userReducer(startState, updateBasket({basket: {items: [1]} as any}))
            expect(state.basket).toEqual({items: [1]})
        })
    })

    describe("when setValidatingSession is dispatched", () => {
        it("should update isValidatingSession", () => {
            const startState = userReducer(undefined, {type: "unknown"})
            const state = userReducer(startState, setValidatingSession({validating: false}))
            expect(state.isValidatingSession).toBe(false)
        })
    })

    describe("when updateConsent is dispatched", () => {
        it("should update consent", () => {
            const startState = userReducer(undefined, {type: "unknown"})
            const consent = {accepted: true} as any
            const state = userReducer(startState, updateConsent({consent}))
            expect(state.consent).toBe(consent)
        })
    })

    describe("when updateMemberLegalConsent is dispatched", () => {
        it("should update legal consent flags when information exists", () => {
            const startState = {
                ...userReducer(undefined, {type: "unknown"}),
                information: {
                    acceptedTermsAndCondition: false,
                    acceptLopd: false,
                    memberType: MemberType.PERSONAL,
                } as any,
            }

            const state = userReducer(
                startState as any,
                updateMemberLegalConsent({
                    acceptedTermsAndCondition: true,
                    acceptLopd: true,
                })
            )

            expect(state.information?.acceptedTermsAndCondition).toBe(true)
            expect(state.information?.acceptLopd).toBe(true)
        })

        it("should not update state when information is missing", () => {
            const startState = userReducer(undefined, {type: "unknown"})

            const state = userReducer(
                startState,
                updateMemberLegalConsent({
                    acceptedTermsAndCondition: true,
                    acceptLopd: true,
                })
            )

            expect(state.information).toBeNull()
        })
    })
})
