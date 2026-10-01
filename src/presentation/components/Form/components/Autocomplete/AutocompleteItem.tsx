"use client"
import { clsx } from "clsx"
import { useEffect, useRef } from "react"
import type { AutocompleteOption } from "./types"

export type AutocompleteItemProps = {
    option: AutocompleteOption
    isActive: boolean
    isSelected: boolean
    onSelect: () => void
}

const AutocompleteItem = ({ option, isActive, isSelected, onSelect }: AutocompleteItemProps) => {
    const itemRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (isActive) itemRef.current?.scrollIntoView?.({ block: "nearest" })
    }, [isActive])

    return (
        <button
            ref={itemRef}
            type="button"
            tabIndex={-1}
            aria-current={isSelected || undefined}
            onClick={onSelect}
            className={clsx(
                "flex h-10 w-full items-center border-grayscale-100 px-4 py-2 text-left text-sm text-grayscale-400 outline-none first:border-t hover:bg-darkGrayishBlue-100",
                (isSelected || isActive) && "bg-darkGrayishBlue-100",
            )}
        >
            <span className="truncate">{option.label}</span>
        </button>
    )
}

export default AutocompleteItem
