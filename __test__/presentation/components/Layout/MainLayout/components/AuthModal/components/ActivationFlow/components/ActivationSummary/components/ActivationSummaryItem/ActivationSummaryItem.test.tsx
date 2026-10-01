import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import ActivationSummaryItem from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow/components/ActivationSummary/components/ActivationSummaryItem/ActivationSummaryItem"

describe("ActivationSummaryItem", () => {
    describe("when rendered", () => {
        it("should render label and value", () => {
            render(<ActivationSummaryItem label="Nombres" value="Juan" />)

            expect(screen.getByText("Nombres")).toBeInTheDocument()
            expect(screen.getByText("Juan")).toBeInTheDocument()
        })
    })
})

