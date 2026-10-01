import React from "react"
import {fireEvent, render, screen} from "@testing-library/react"
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import {
    createLopdFormSchema,
    defaultLopdFormConfig,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdFormConfig"

const mocks = vi.hoisted(() => {
    const onSubmit = vi.fn(async () => undefined)
    const onTermsLinkClick = vi.fn()
    const onRemindLater = vi.fn(async () => undefined)

    let lastFormProps: any = null
    let lastCheckboxProps: any[] = []
    let lastFormButtonProps: any = null
    let lastButtonProps: any = null

    return {
        onSubmit,
        onTermsLinkClick,
        onRemindLater,
        getLastFormProps: () => lastFormProps,
        setLastFormProps: (p: any) => {
            lastFormProps = p
        },
        getLastCheckboxProps: () => lastCheckboxProps,
        pushLastCheckboxProps: (p: any) => {
            lastCheckboxProps.push(p)
        },
        getLastFormButtonProps: () => lastFormButtonProps,
        setLastFormButtonProps: (p: any) => {
            lastFormButtonProps = p
        },
        getLastButtonProps: () => lastButtonProps,
        setLastButtonProps: (p: any) => {
            lastButtonProps = p
        },
        reset: () => {
            lastFormProps = null
            lastCheckboxProps = []
            lastFormButtonProps = null
            lastButtonProps = null
        },
    }
})

vi.mock("@/presentation/components/Form/context/Form", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastFormProps(props)
            return (
                <div data-testid="mock-form">
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
                    {props.children}
                </div>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormCheckbox", async () => {
    const React = await import("react")
    return {
        FormCheckbox: (props: any) => {
            mocks.pushLastCheckboxProps(props)
            return (
                <div data-testid={`mock-form-checkbox-${props.testId}`}>
                    <div data-testid="mock-checkbox-label">{props.label}</div>
                </div>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/controls/FormButton", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastFormButtonProps(props)
            return (
                <button type="button" data-testid={`mock-form-button-${props.testId}`}>
                    {props.children}
                </button>
            )
        },
    }
})

vi.mock("@/presentation/components/Form/components/Button", async () => {
    const React = await import("react")
    return {
        Button: (props: any) => {
            mocks.setLastButtonProps(props)
            return (
                <button
                    type="button"
                    data-testid={`mock-button-${props.testId}`}
                    onClick={() => props.onPress?.()}
                >
                    {props.children}
                </button>
            )
        },
    }
})

import LopdForm from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdForm"

describe("LopdForm", () => {
    beforeEach(() => {
        mocks.onSubmit.mockReset()
        mocks.onTermsLinkClick.mockReset()
        mocks.onRemindLater.mockReset()
        mocks.reset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered for LOPD-only consent", () => {
        it("should render form config, accept button and remind later", () => {
            render(
                <LopdForm
                    showTermsCheckbox={false}
                    showLopdCheckbox={true}
                    onSubmit={mocks.onSubmit}
                    onTermsLinkClick={mocks.onTermsLinkClick}
                    onRemindLater={mocks.onRemindLater}
                />,
            )

            expect(screen.getByTestId("mock-form")).toBeInTheDocument()

            const formProps = mocks.getLastFormProps()
            expect(formProps.initialValues).toBe(defaultLopdFormConfig)
            expect(formProps.schema.describe()).toEqual(
                createLopdFormSchema({ withTerms: false, withLopd: true }).describe(),
            )
            expect(formProps.className).toContain("flex flex-col")

            const checkboxProps = mocks.getLastCheckboxProps()
            expect(checkboxProps).toHaveLength(1)
            expect(checkboxProps[0]).toMatchObject({
                testId: "acceptedLopd",
                name: "acceptedLopd",
            })

            const link = screen.getByRole("link", {
                name: "Leer documento de tratamiento de datos personales. Enlace",
            })
            expect(link).toHaveAttribute(
                "href",
                "https://s3.amazonaws.com/resources.miles.com.ec/public/documents/pichinchamilesec/lopd/autorizacion-para-tratamiento-de-documentos-personales-v01-1.pdf",
            )

            expect(screen.getByTestId("mock-form-button-submitLopd")).toHaveTextContent("Sí, autorizo")
            expect(screen.getByTestId("mock-button-remindMeLater")).toHaveTextContent(
                "Recordar más tarde",
            )

            const buttonProps = mocks.getLastButtonProps()
            expect(buttonProps).toMatchObject({
                color: "secondary",
                type: "button",
                testId: "remindMeLater",
            })
        })
    })

    describe("when rendered for pending terms consent", () => {
        it("should render terms checkbox and accept button", () => {
            render(
                <LopdForm
                    showTermsCheckbox={true}
                    showLopdCheckbox={false}
                    onSubmit={mocks.onSubmit}
                    onTermsLinkClick={mocks.onTermsLinkClick}
                />,
            )

            const formProps = mocks.getLastFormProps()
            const checkboxProps = mocks.getLastCheckboxProps()
            expect(checkboxProps).toHaveLength(1)
            expect(checkboxProps[0]).toMatchObject({
                testId: "acceptedTermsAndCondition",
                name: "acceptedTermsAndCondition",
            })
            expect(formProps.schema.describe()).toEqual(
                createLopdFormSchema({ withTerms: true, withLopd: false }).describe(),
            )
            expect(screen.getByTestId("mock-form-button-submitLopd")).toHaveTextContent("Sí, autorizo")
            expect(screen.queryByTestId("mock-button-remindMeLater")).not.toBeInTheDocument()
        })

        it("should not render remind later when terms and LOPD are both pending", () => {
            render(
                <LopdForm
                    showTermsCheckbox={true}
                    showLopdCheckbox={true}
                    onSubmit={mocks.onSubmit}
                    onTermsLinkClick={mocks.onTermsLinkClick}
                    onRemindLater={mocks.onRemindLater}
                />,
            )

            expect(screen.queryByTestId("mock-button-remindMeLater")).not.toBeInTheDocument()
        })
    })

    describe("when remind me later is pressed", () => {
        it("should call onRemindLater", () => {
            render(
                <LopdForm
                    showTermsCheckbox={false}
                    showLopdCheckbox={true}
                    onSubmit={mocks.onSubmit}
                    onTermsLinkClick={mocks.onTermsLinkClick}
                    onRemindLater={mocks.onRemindLater}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-button-remindMeLater"))

            expect(mocks.onRemindLater).toHaveBeenCalledTimes(1)
            expect(mocks.onSubmit).not.toHaveBeenCalled()
        })
    })

    describe("when form is submitted", () => {
        it("should call onSubmit handler", () => {
            render(
                <LopdForm
                    showTermsCheckbox={false}
                    showLopdCheckbox={true}
                    onSubmit={mocks.onSubmit}
                    onTermsLinkClick={mocks.onTermsLinkClick}
                />,
            )

            fireEvent.click(screen.getByTestId("mock-form-submit"))

            expect(mocks.onSubmit).toHaveBeenCalledWith({
                acceptedLopd: true,
                acceptedTermsAndCondition: true,
            })
        })
    })

    describe("createLopdFormSchema accept button rules", () => {
        const bothPendingSchema = createLopdFormSchema({ withTerms: true, withLopd: true })
        const lopdOnlySchema = createLopdFormSchema({ withTerms: false, withLopd: true })

        it("should be invalid when no checkbox is selected", () => {
            expect(
                bothPendingSchema.isValidSync({
                    acceptedTermsAndCondition: false,
                    acceptedLopd: false,
                }),
            ).toBe(false)
        })

        it("should be invalid when only LOPD is selected", () => {
            expect(
                bothPendingSchema.isValidSync({
                    acceptedTermsAndCondition: false,
                    acceptedLopd: true,
                }),
            ).toBe(false)
        })

        it("should be valid when only terms are selected", () => {
            expect(
                bothPendingSchema.isValidSync({
                    acceptedTermsAndCondition: true,
                    acceptedLopd: false,
                }),
            ).toBe(true)
        })

        it("should be valid when both are selected", () => {
            expect(
                bothPendingSchema.isValidSync({
                    acceptedTermsAndCondition: true,
                    acceptedLopd: true,
                }),
            ).toBe(true)
        })

        it("should be invalid for LOPD-only consent when checkbox is not selected", () => {
            expect(
                lopdOnlySchema.isValidSync({
                    acceptedTermsAndCondition: false,
                    acceptedLopd: false,
                }),
            ).toBe(false)
        })

        it("should be valid for LOPD-only consent when checkbox is selected", () => {
            expect(
                lopdOnlySchema.isValidSync({
                    acceptedTermsAndCondition: false,
                    acceptedLopd: true,
                }),
            ).toBe(true)
        })
    })
})
