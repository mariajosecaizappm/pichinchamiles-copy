import type { MouseEvent } from "react"

export const firstParam = (value: string | string[] | undefined): string | undefined =>
    typeof value === "string" ? value : value?.[0]

export const titleCaseSlug = (slug: string): string =>
    slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())

export const getPathnameFromHref = (href: string): string => href.split(/[?#]/)[0]

export const isPdfHref = (href?: string): boolean =>
    !!href && getPathnameFromHref(href).toLowerCase().endsWith(".pdf")

export const isExternalHref = (href: string): boolean =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")

export const handleAppLinkClick = <T extends Element>(
    href: string,
    event: MouseEvent<T>,
    onClick?: (event: MouseEvent<T>) => void,
): void => {
    onClick?.(event)
    if (event.defaultPrevented || isExternalHref(href)) return

    if (getPathnameFromHref(href) === window.location.pathname) {
        window.scrollTo(0, 0)
    }
}
