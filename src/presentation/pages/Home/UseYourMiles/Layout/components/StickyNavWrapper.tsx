"use client"

import { cn } from "@heroui/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

type Props = {
    className?: string;
    children: ReactNode;
}

const StickyNavWrapper = ({ children, className }: Props) => {
    const [isStuck, setIsStuck] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsStuck(!entry.isIntersecting),
            { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
        )

        const sentinel = document.createElement("div")
        sentinel.style.height = "1px"
        sentinel.style.marginBottom = "-1px"
        el.parentElement?.insertBefore(sentinel, el)
        observer.observe(sentinel)

        return () => {
            observer.disconnect()
            sentinel.remove()
        }
    }, [])

    return (
        <div
            ref={ref}
            className={cn(
                className,
                isStuck && "shadow-[0px_8px_8px_-8px_rgba(7,7,7,0.16)] transition-shadow duration-200"
            )}
        >
            {children}
        </div>
    )
}

export default StickyNavWrapper