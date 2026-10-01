import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AutocompleteItem from "@/presentation/components/Form/components/Autocomplete/AutocompleteItem"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete/types"

const QUITO: AutocompleteOption = { value: "1", label: "Quito" }

const scrollIntoView = vi.fn()

const renderItem = (props: Partial<React.ComponentProps<typeof AutocompleteItem>> = {}) =>
    render(
        <AutocompleteItem
            option={QUITO}
            isActive={false}
            isSelected={false}
            onSelect={vi.fn()}
            {...props}
        />,
    )

describe("AutocompleteItem", () => {
    beforeEach(() => {
        scrollIntoView.mockClear()
        Element.prototype.scrollIntoView = scrollIntoView
    })

    it("should render the option label", () => {
        renderItem()

        expect(screen.getByRole("button", { name: "Quito" })).toBeInTheDocument()
    })

    it("should report the selection on click", () => {
        const onSelect = vi.fn()
        renderItem({ onSelect })

        fireEvent.click(screen.getByRole("button"))

        expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it("should stay out of the tab order", () => {
        renderItem()

        expect(screen.getByRole("button")).toHaveAttribute("tabindex", "-1")
    })

    it("should mark the selected option", () => {
        renderItem({ isSelected: true })

        expect(screen.getByRole("button")).toHaveAttribute("aria-current", "true")
        expect(screen.getByRole("button")).toHaveClass("bg-darkGrayishBlue-100")
    })

    it("should not mark an unselected option", () => {
        renderItem()

        expect(screen.getByRole("button")).not.toHaveAttribute("aria-current")
        expect(screen.getByRole("button")).not.toHaveClass("bg-darkGrayishBlue-100")
    })

    it("should highlight the option under the keyboard cursor", () => {
        renderItem({ isActive: true })

        expect(screen.getByRole("button")).toHaveClass("bg-darkGrayishBlue-100")
    })

    it("should scroll the option under the keyboard cursor into view", () => {
        renderItem({ isActive: true })

        expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" })
    })

    it("should not scroll options that are not under the keyboard cursor", () => {
        renderItem()

        expect(scrollIntoView).not.toHaveBeenCalled()
    })
})
