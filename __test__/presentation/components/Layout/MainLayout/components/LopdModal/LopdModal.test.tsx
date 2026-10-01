import React from "react"
import {act, render, screen, waitFor} from "@testing-library/react"
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import links from "@/presentation/config/links"
import {
    LOPD_ONLY_CONSENT_MODAL_MESSAGE,
    TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE,
    TERMS_ONLY_CONSENT_MODAL_MESSAGE,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers"

const mocks = vi.hoisted(() => {
    const clearConsent = vi.fn()
    const isSkippedLopd = vi.fn()
    const skipLopd = vi.fn()
    const updateMemberAcceptLopd = vi.fn()
    const containerGet = vi.fn()
    const getUserName = vi.fn(() => "Juan Perez")
    const useSelector = vi.fn()
    const useDispatch = vi.fn(() => vi.fn())
    const usePathname = vi.fn(() => "/")

    let session: any = {
        member: null,
        consent: null,
        cif: "cif-123",
        isValidatingSession: false,
    }

    let lastModalProps: any = null
    let lastLopdFormProps: any = null

    return {
        clearConsent,
        isSkippedLopd,
        skipLopd,
        updateMemberAcceptLopd,
        containerGet,
        getUserName,
        useSelector,
        useDispatch,
        usePathname,
        getSession: () => session,
        setSession: (next: any) => {
            session = next
        },
        getLastModalProps: () => lastModalProps,
        setLastModalProps: (p: any) => {
            lastModalProps = p
        },
        getLastLopdFormProps: () => lastLopdFormProps,
        setLastLopdFormProps: (p: any) => {
            lastLopdFormProps = p
        },
        reset: () => {
            lastModalProps = null
            lastLopdFormProps = null
        },
    }
})

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        member: mocks.getSession().member,
        consent: mocks.getSession().consent,
        cif: mocks.getSession().cif,
        isValidatingSession: mocks.getSession().isValidatingSession,
        clearConsent: mocks.clearConsent,
    }),
}))

vi.mock("@/presentation/helpers/member", () => ({
    getUserName: mocks.getUserName,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("react-redux", () => ({
    useSelector: mocks.useSelector,
    useDispatch: mocks.useDispatch,
}))

vi.mock("next/navigation", () => ({
    usePathname: mocks.usePathname,
}))

vi.mock("@/presentation/components/Modal", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastModalProps(props)
            if (!props.isOpen) return null
            return (
                <div data-testid="mock-modal">
                    <button
                        type="button"
                        data-testid="mock-close"
                        onClick={() => props.onClose?.()}
                    >
                        close
                    </button>
                    {props.children}
                </div>
            )
        },
    }
})

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.setLastLopdFormProps(props)
                return <div data-testid="mock-lopd-form" />
            },
        }
    },
)

import LopdModal from "@/presentation/components/Layout/MainLayout/components/LopdModal/LopdModal"

describe("LopdModal", () => {
    beforeEach(() => {
        mocks.clearConsent.mockReset()
        mocks.isSkippedLopd.mockReset()
        mocks.skipLopd.mockReset()
        mocks.updateMemberAcceptLopd.mockReset()
        mocks.containerGet.mockReset()
        mocks.getUserName.mockReset()
        mocks.useSelector.mockReset()
        mocks.useDispatch.mockReset()
        mocks.usePathname.mockReset()
        mocks.reset()

        mocks.useSelector.mockImplementation((selector: (state: unknown) => unknown) =>
            selector({ authModal: { isOpen: false } })
        )
        mocks.usePathname.mockReturnValue("/")

        mocks.containerGet.mockImplementation(() => ({
            isSkippedLopd: mocks.isSkippedLopd,
            skipLopd: mocks.skipLopd,
            updateMemberAcceptLopd: mocks.updateMemberAcceptLopd,
        }))

        mocks.isSkippedLopd.mockResolvedValue(false)

        mocks.setSession({
            member: null,
            consent: null,
            cif: "cif-123",
            isValidatingSession: false,
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when there is no member", () => {
        it("should keep the modal closed and not check skipped", async () => {
            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })

            expect(mocks.isSkippedLopd).not.toHaveBeenCalled()
            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
        })
    })

    describe("when member has not accepted LOPD", () => {
        it("should open the modal after checking skipped and render content", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.isSkippedLopd).toHaveBeenCalledWith("1717171717")
            })

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            expect(mocks.getUserName).toHaveBeenCalled()
            expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent("Hola Juan Perez,")
            expect(screen.getByText(LOPD_ONLY_CONSENT_MODAL_MESSAGE)).toBeInTheDocument()
            expect(screen.getByTestId("mock-lopd-form")).toBeInTheDocument()

            const lopdFormProps = mocks.getLastLopdFormProps()
            expect(lopdFormProps).toMatchObject({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                cif: "cif-123",
                consent: null,
            })
            expect(typeof lopdFormProps.onClose).toBe("function")
            expect(typeof lopdFormProps.onRemindLater).toBe("function")

            const modalProps = mocks.getLastModalProps()
            expect(modalProps.scrollBehavior).toBe("inside")
            expect(typeof modalProps.onClose).toBe("function")
        })
    })

    describe("when member has skipped LOPD previously", () => {
        it("should keep the modal closed even if member has not accepted LOPD", async () => {
            mocks.isSkippedLopd.mockResolvedValue(true)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.isSkippedLopd).toHaveBeenCalledWith("1717171717")
            })

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
        })
    })

    describe("when consent has not been granted", () => {
        it("should open the modal even if member has accepted LOPD", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: true},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })
        })
    })

    describe("when consent hasConsent=true but member.acceptLopd=false", () => {
        it("should auto-sync acceptLopd and keep LOPD modal hidden", async () => {
            mocks.updateMemberAcceptLopd.mockResolvedValueOnce(undefined)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: true},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.updateMemberAcceptLopd).toHaveBeenCalledWith(true)
            })

            expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
        })

        it("should not auto-sync while isValidatingSession is true", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: true},
                cif: "cif-123",
                isValidatingSession: true,
            })

            render(<LopdModal />)

            await new Promise(resolve => setTimeout(resolve, 30))
            expect(mocks.updateMemberAcceptLopd).not.toHaveBeenCalled()
        })

        it("should handle sync errors without crashing and allow retry", async () => {
            mocks.updateMemberAcceptLopd.mockRejectedValueOnce(new Error("sync error"))
            const dispatchSpy = vi.fn()
            mocks.useDispatch.mockReturnValue(dispatchSpy)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: true},
                cif: "cif-123",
                isValidatingSession: false,
            })

            expect(() => render(<LopdModal />)).not.toThrow()

            await waitFor(() => {
                expect(mocks.updateMemberAcceptLopd).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe("when modal is closed (LOPD only, no pending terms)", () => {
        it("should set closed flag and clear consent WITHOUT persisting skip", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const modalProps = mocks.getLastModalProps()
            act(() => {
                modalProps.onClose()
            })

            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)
        })
    })

    describe("when form closes after submit (onClose)", () => {
        it("should clear consent and close the modal when terms pending (NO persist skip)", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const lopdFormProps = mocks.getLastLopdFormProps()
            act(() => {
                lopdFormProps.onClose()
            })

            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })

        it("should clear consent and close when LOPD-only flow (no persist skip on form submit close)", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const lopdFormProps = mocks.getLastLopdFormProps()
            act(() => {
                lopdFormProps.onClose()
            })

            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })
    })

    describe("when auth modal is open", () => {
        it("should keep the modal closed even if member has not accepted LOPD", async () => {
            mocks.useSelector.mockImplementation((selector: (state: unknown) => unknown) =>
                selector({ authModal: { isOpen: true } })
            )
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
        })
    })

    describe("when remind later is triggered", () => {
        it("should skip lopd for the member, clear consent and close when no pending terms", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-lopd-form")).toBeInTheDocument()
            })

            const lopdFormProps = mocks.getLastLopdFormProps()
            await act(async () => {
                await lopdFormProps.onRemindLater()
            })

            expect(mocks.skipLopd).toHaveBeenCalledWith("1717171717", 2592000)
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })

        it("should NOT persist skip when terms are pending, just clear consent and close", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-lopd-form")).toBeInTheDocument()
            })

            const lopdFormProps = mocks.getLastLopdFormProps()
            await act(async () => {
                await lopdFormProps.onRemindLater()
            })

            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })
    })

    describe("when member has not accepted terms and conditions", () => {
        it("should show combined message when both consents are pending", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: false},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            expect(screen.getByText(TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE)).toBeInTheDocument()
            expect(
                screen.queryByText(LOPD_ONLY_CONSENT_MODAL_MESSAGE),
            ).not.toBeInTheDocument()
        })

        it("should show combined message when terms are pending and member has accepted LOPD but consent is pending", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: {hasConsent: false},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            expect(screen.getByText(TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE)).toBeInTheDocument()
        })

        it("should show terms-only message when only terms consent is pending", async () => {
            mocks.isSkippedLopd.mockResolvedValue(true)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: {hasConsent: true},
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            expect(screen.getByText(TERMS_ONLY_CONSENT_MODAL_MESSAGE)).toBeInTheDocument()
            expect(
                screen.queryByText(TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE),
            ).not.toBeInTheDocument()
        })

        it("should open the modal even if LOPD was skipped (because terms are pending)", async () => {
            mocks.isSkippedLopd.mockResolvedValue(true)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })
        })

        it("should not allow dismissing the modal via close button or backdrop", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const modalProps = mocks.getLastModalProps()
            expect(modalProps.hideCloseButton).toBe(true)
            expect(modalProps.isDismissable).toBe(false)
            expect(modalProps.isKeyboardDismissDisabled).toBe(true)

            act(() => {
                modalProps.onClose()
            })

            expect(mocks.clearConsent).not.toHaveBeenCalled()
            expect(mocks.getLastModalProps()?.isOpen).toBe(true)
        })

        it("should close the modal only after form submission", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const lopdFormProps = mocks.getLastLopdFormProps()
            act(() => {
                lopdFormProps.onClose()
            })

            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(mocks.clearConsent).toHaveBeenCalledTimes(1)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })

        it("should NOT show LOPD modal when terms are pending (shouldShowForLopd suppressed)", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            const modalProps = mocks.getLastModalProps()
            expect(modalProps.hideCloseButton).toBe(true)
            expect(modalProps.isDismissable).toBe(false)
            expect(modalProps.isKeyboardDismissDisabled).toBe(true)
        })
    })

    describe("when user is on terms page with pending terms", () => {
        it("should keep the modal closed and rely on inline form", async () => {
            mocks.usePathname.mockReturnValue(links.termsAndConditions)
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: true, acceptedTermsAndCondition: false},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            render(<LopdModal />)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
            expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument()
        })
    })

    describe("when member becomes null after mount", () => {
        it("should reset local modal state", async () => {
            mocks.setSession({
                member: {identificationNumber: "1717171717", acceptLopd: false, acceptedTermsAndCondition: true},
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            const { rerender } = render(<LopdModal />)

            await waitFor(() => {
                expect(screen.getByTestId("mock-modal")).toBeInTheDocument()
            })

            mocks.setSession({
                member: null,
                consent: null,
                cif: "cif-123",
                isValidatingSession: false,
            })

            rerender(<LopdModal />)

            await waitFor(() => {
                expect(mocks.getLastModalProps()?.isOpen).toBe(false)
            })
        })
    })
})
