import React from "react"
import {render, screen} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import OtpFormAccordion from "@/presentation/components/Layout/OtpForm/components/OtpFormAccordion/OtpFormAccordion"

const mocks = vi.hoisted(() => {
    let lastAccordionProps: any = null
    let lastAccordionItemProps: any = null

    return {
        getAccordionProps: () => lastAccordionProps,
        getAccordionItemProps: () => lastAccordionItemProps,
        setAccordionProps: (props: any) => (lastAccordionProps = props),
        setAccordionItemProps: (props: any) => (lastAccordionItemProps = props),
        reset: () => {
            lastAccordionProps = null
            lastAccordionItemProps = null
        },
    }
})

vi.mock("@heroui/react", async () => {
    const React = await import("react")

    return {
        Accordion: (props: any) => {
            mocks.setAccordionProps(props)
            return (
                <div
                    data-testid="heroui-accordion"
                    data-props={JSON.stringify({
                        className: props.className,
                        showDivider: props.showDivider,
                        itemClasses: props.itemClasses,
                    })}
                >
                    {props.children}
                </div>
            )
        },
        AccordionItem: (props: any) => {
            mocks.setAccordionItemProps(props)
            return (
                <div data-testid="heroui-accordion-item">
                    <div data-testid="accordion-item-title">
                        {props.title}
                    </div>
                    <div data-testid="accordion-item-content">
                        {props.children}
                    </div>
                </div>
            )
        },
    }
})

describe("OtpFormAccordion", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.reset()
    })

    describe("when rendered", () => {
        it("should render the accordion title", () => {
            render(<OtpFormAccordion />)

            expect(
                screen.getByText("¿No recibiste el código de seguridad?"),
            ).toBeInTheDocument()
        })

        it("should pass Accordion configuration", () => {
            render(<OtpFormAccordion />)

            const props = mocks.getAccordionProps()
            expect(props).toBeTruthy()
            expect(props.className).toBe("w-full px-0 mt-4")
            expect(props.showDivider).toBe(false)

            expect(props.itemClasses.base).toBe("w-full")
            expect(props.itemClasses.title).toContain("typo-main-caption-medium")
            expect(props.itemClasses.title).toContain("text-center")
            expect(props.itemClasses.title).toContain("cursor-pointer")
            expect(props.itemClasses.trigger).toContain("!justify-center")
        })

        it("should pass AccordionItem labels", () => {
            render(<OtpFormAccordion />)

            const props = mocks.getAccordionItemProps()
            expect(props).toBeTruthy()
            expect(props.title).toBe("¿No recibiste el código de seguridad?")
            expect(props["aria-label"]).toBe(
                "¿No recibiste el código de seguridad?",
            )
        })

        it("should rotate the indicator upward when open", () => {
            render(<OtpFormAccordion />)

            const props = mocks.getAccordionProps()
            expect(props.itemClasses.indicator).toContain(
                "data-[open=true]:rotate-180",
            )
            expect(mocks.getAccordionItemProps().indicator).toBeTruthy()
        })

        it("should use IconChevronDown as indicator", () => {
            render(<OtpFormAccordion />)

            const indicator = mocks.getAccordionItemProps().indicator
            expect(indicator.type).toBeTruthy()
            expect(indicator.type.name || indicator.type.displayName).toMatch(
                /IconChevronDown/,
            )
        })

        it("should render the help message and phone number", () => {
            render(<OtpFormAccordion />)

            const message = screen.getByText(
                /En caso de no recibir el código necesitas actualizar tus datos de contacto/i,
            )
            expect(message).toHaveClass("bg-darkGrayishBlue-100")
            expect(message).toHaveClass("border-darkGrayishBlue-300")
            expect(message).toHaveClass("rounded-lg")
            expect(message).toHaveClass("typo-main-legal-medium")

            const phone = screen.getByText("1800 - BPMILE (276-453)")
            expect(phone).toHaveClass("text-information-500")
            expect(phone).toHaveClass("font-medium")

            const phoneContainer = message.closest("div")
            expect(phoneContainer).toHaveAttribute("aria-label", "En caso de no recibir el código actualiza tus datos de contacto llamando al uno ochocientos B P M I L E, dos siete seis cuatro cinco tres.")
        })
    })
})

