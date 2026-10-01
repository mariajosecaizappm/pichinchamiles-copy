import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import AddressAccordion from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/AddressAccordion/AddressAccordion"
import {MemberType} from "@/domain/entity/Member/member"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

vi.mock("@heroui/react", async () => {
    const React = await import("react")
    return {
        Accordion: ({ onSelectionChange, children }: { onSelectionChange?: (keys: unknown) => void; children: React.ReactNode }) => {
            React.useEffect(() => {
                // Call onSelectionChange when component mounts to simulate expansion
                if (onSelectionChange) {
                    onSelectionChange("1") // Simulate expansion
                }
            }, [onSelectionChange])
            return <div>{children}</div>
        },
        AccordionItem: (props: { "data-testid"?: string, title?: string, children: React.ReactNode }) => (
            <div data-testid={props["data-testid"] ?? "accordion-item"}>
                <div>{props.title}</div>
                <div>{props.children}</div>
            </div>
        ),
    }
})

vi.mock("@/presentation/components/providers/ScreenReaderProvider", () => ({
    ScreenReaderContext: { current: null },
    useScreenReader: () => ({
        info: vi.fn()
    }),
    ScreenReaderProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe("AddressAccordion", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when rendered", () => {
        it("should show member address information", () => {
            render(
                <ScreenReaderProvider>
                    <AddressAccordion
                        member={{
                            memberType: MemberType.PERSONAL,
                            state: "Pichincha",
                            city: "Quito",
                            address: "Av. 1",
                        } as any}
                    />
                </ScreenReaderProvider>,
            )

            expect(screen.getByTestId("addressAccordion")).toBeInTheDocument()
            expect(screen.getByText("Dirección registrada")).toBeInTheDocument()
            expect(screen.getByText("Provincia – Pichincha")).toBeInTheDocument()
            expect(screen.getByText("Ciudad – Quito")).toBeInTheDocument()
            expect(screen.getByText("Dirección – Av. 1")).toBeInTheDocument()
        })

        it("should apply custom className", () => {
            render(
                <ScreenReaderProvider>
                    <AddressAccordion
                        className="custom-class"
                        member={{
                            memberType: MemberType.PERSONAL,
                            state: "Pichincha",
                            city: "Quito",
                            address: "Av. 1",
                        } as any}
                    />
                </ScreenReaderProvider>,
            )

            const accordion = screen.getByTestId("addressAccordion").closest('.border')
            expect(accordion).toHaveClass("custom-class")
        })
    })
})

