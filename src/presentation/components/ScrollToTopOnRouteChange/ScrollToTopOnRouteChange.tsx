"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/** Resets window scroll on pathname change only (keeps `{ scroll: false }` query updates). */
const ScrollToTopOnRouteChange = () => {
    const pathname = usePathname()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

export default ScrollToTopOnRouteChange
