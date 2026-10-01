"use client"

import { handleAppLinkClick } from "@/presentation/helpers/url"
import Link from "next/link"
import { ComponentProps, forwardRef, MouseEvent } from "react"

export type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
    href: string
}

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(
    ({ href, onClick, children, ...props }, ref) => {
        const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            handleAppLinkClick(href, event, onClick)
        }

        return (
            <Link ref={ref} href={href} onClick={handleClick} {...props}>
                {children}
            </Link>
        )
    },
)

AppLink.displayName = "AppLink"

export default AppLink
