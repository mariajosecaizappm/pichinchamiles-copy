import { isMobileDevice } from "@/presentation/helpers/device"

const FOCUSABLE_INPUT_SELECTOR =
    'input:not([type="hidden"]), textarea, select, [contenteditable="true"]'

export function isFocusableInput(element: Element): element is HTMLElement {
    return element instanceof HTMLElement && element.matches(FOCUSABLE_INPUT_SELECTOR)
}

export function scrollFocusedInputIntoView(element: HTMLElement): void {
    if (!isMobileDevice()) return

    requestAnimationFrame(() => {
        window.setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 300)
    })
}

export function handleScrollFocusedInputIntoView(
    event: React.FocusEvent<HTMLElement>,
): void {
    if (isFocusableInput(event.target)) {
        scrollFocusedInputIntoView(event.target)
    }
}
