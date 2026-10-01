import React from "react"
import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import links from "@/presentation/config/links"

const mocks = vi.hoisted(() => {
    const updateLopd = vi.fn()
    const updateMember = vi.fn()
    const containerGet = vi.fn()
    const dispatch = vi.fn()
    const onClose = vi.fn()
    const onRemindLater = vi.fn(async () => undefined)
    const push = vi.fn()

    let lastLopdFormProps: any = null

    return {
        updateLopd,
        updateMember,
        containerGet,
        dispatch,
        onClose,
        onRemindLater,
        push,
        getLastLopdFormProps: () => lastLopdFormProps,
        setLastLopdFormProps: (p: any) => {
            lastLopdFormProps = p
        },
        reset: () => {
            lastLopdFormProps = null
        },
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("react-redux", () => ({
    useDispatch: () => mocks.dispatch,
}))

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: mocks.push }),
}))

vi.mock(
    "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdForm",
    async () => {
        const React = await import("react")
        return {
            default: (props: any) => {
                mocks.setLastLopdFormProps(props)
                return (
                    <div data-testid="mock-lopd-form">
                        <button
                            type="button"
                            data-testid="mock-form-submit"
                            onClick={() => props.onSubmit?.({
                                acceptedLopd: true,
                                acceptedTermsAndCondition: true,
                            })}
                        >
                            submit
                        </button>
                        <button
                            type="button"
                            data-testid="mock-terms-link"
                            onClick={(event) => props.onTermsLinkClick?.(event)}
                        >
                            terms
                        </button>
                    </div>
                )
            },
        }
    },
)

import LopdFormContainer from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdFormContainer"

describe("LopdFormContainer", () => {
    const member: any = {
        identificationNumber: "1717171717",
        acceptedTermsAndCondition: true,
        acceptLopd: false,
    }
    const cif = "cif-123"
    const consent: any = {hasConsent: false}

    beforeEach(() => {
        mocks.updateLopd.mockReset()
        mocks.updateMember.mockReset()
        mocks.containerGet.mockReset()
        mocks.dispatch.mockReset()
        mocks.onClose.mockReset()
        mocks.onRemindLater.mockReset()
        mocks.push.mockReset()
        mocks.reset()

        mocks.containerGet.mockImplementation((type: any) => {
            if (type === UseCaseTypes.UpdateLopdUseCase) {
                return {updateLopd: mocks.updateLopd}
            }
            if (type === UseCaseTypes.UpdateMemberUseCase) {
                return {updateMember: mocks.updateMember}
            }
            return {}
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered for LOPD-only consent", () => {
        it("should pass computed props to LopdForm", () => {
            render(
                <LopdFormContainer
                    member={member}
                    cif={cif}
                    consent={consent}
                    onClose={mocks.onClose}
                    onRemindLater={mocks.onRemindLater}
                />,
            )

            expect(mocks.getLastLopdFormProps()).toMatchObject({
                showTermsCheckbox: false,
                showLopdCheckbox: true,
                variant: "modal",
            })
            expect(typeof mocks.getLastLopdFormProps().onSubmit).toBe("function")
            expect(typeof mocks.getLastLopdFormProps().onTermsLinkClick).toBe("function")
        })
    })

    describe("when rendered for pending terms consent", () => {
        it("should show terms checkbox only", () => {
            render(
                <LopdFormContainer
                    member={{ ...member, acceptedTermsAndCondition: false, acceptLopd: true }}
                    cif={cif}
                    consent={{ hasConsent: true }}
                    onClose={mocks.onClose}
                />,
            )

            expect(mocks.getLastLopdFormProps()).toMatchObject({
                showTermsCheckbox: true,
                showLopdCheckbox: false,
            })
        })
    })

    describe("when terms link is clicked", () => {
        it("should navigate to terms page", () => {
            render(
                <LopdFormContainer
                    member={{ ...member, acceptedTermsAndCondition: false, acceptLopd: true }}
                    cif={cif}
                    consent={{ hasConsent: true }}
                    onClose={mocks.onClose}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-terms-link"))

            expect(mocks.push).toHaveBeenCalledWith(links.termsAndConditions)
        })
    })

    describe("when form is submitted", () => {
        it("should update lopd, dispatch consent updates and close", async () => {
            render(
                <LopdFormContainer
                    member={member}
                    cif={cif}
                    consent={consent}
                    onClose={mocks.onClose}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-form-submit"))

            await waitFor(() => {
                expect(mocks.updateLopd).toHaveBeenCalledWith(member, cif, consent, true)
            })

            await waitFor(() => {
                expect(mocks.dispatch).toHaveBeenCalled()
            })

            await waitFor(() => {
                expect(mocks.onClose).toHaveBeenCalledTimes(1)
            })
        })

        it("should update member when terms were pending", async () => {
            render(
                <LopdFormContainer
                    member={{ ...member, acceptedTermsAndCondition: false, acceptLopd: true }}
                    cif={cif}
                    consent={{ hasConsent: true }}
                    onClose={mocks.onClose}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-form-submit"))

            await waitFor(() => {
                expect(mocks.updateMember).toHaveBeenCalledWith({
                    acceptedTermsAndCondition: true,
                })
            })

            expect(mocks.updateLopd).not.toHaveBeenCalled()
            expect(mocks.onClose).toHaveBeenCalledTimes(1)
        })
    })
})
