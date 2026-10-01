"use client"
import { clsx } from "clsx"
import type { AutocompleteContentController } from "./AutocompleteFieldContext"

const AutocompleteContent = ({
    props,
    state,
    inputRef,
    inputId,
    describedBy,
    isInvalid,
    startContent,
    selected,
    showSelectedLabel,
    openField,
    handleChange,
    handleInputClick,
    handleBlur,
    handleFocus,
}: AutocompleteContentController) => (
    <div className="flex min-w-0 flex-1 items-center gap-2 text-grayscale-400">
        {startContent && (
            <button
                type="button"
                tabIndex={-1}
                className="flex shrink-0 items-center border-0 bg-transparent p-0 text-grayscale-400"
                onClick={event => {
                    event.stopPropagation()
                    openField()
                }}
            >
                {startContent}
            </button>
        )}
        <div className="relative min-w-0 flex-1">
            {showSelectedLabel && selected && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center truncate text-sm font-medium text-grayscale-500"
                >
                    {selected.label}
                </span>
            )}
            <input
                ref={inputRef}
                id={inputId}
                type="text"
                autoComplete="off"
                disabled={props.disabled}
                aria-invalid={isInvalid}
                aria-describedby={describedBy}
                className={clsx(
                    "w-full min-w-0 bg-transparent p-0 text-sm font-medium text-grayscale-500 outline-none",
                    isInvalid ? "placeholder:text-danger" : "placeholder:text-grayscale-300",
                    showSelectedLabel && "text-transparent caret-transparent",
                )}
                value={state.search}
                placeholder={selected ? "" : props.placeholder}
                onFocus={handleFocus}
                onClick={handleInputClick}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </div>
    </div>
)

export default AutocompleteContent
