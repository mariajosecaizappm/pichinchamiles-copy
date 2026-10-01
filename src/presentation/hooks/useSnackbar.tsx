"use client"

import Snackbar from "@/presentation/components/Snackbar"
import React, { ComponentType } from "react"
import { createRoot, Root } from "react-dom/client"

type SnackbarOptions = {
    icon: ComponentType
    title?: string
    content: React.ReactNode | ((close: () => void) => React.ReactNode)
    className?: string
    headerClassName?: string
    footer?: React.ReactNode | ((close: () => void) => React.ReactNode)
    autoDismiss?: number
    dataTestid?: string
}

let containerEl: HTMLElement | null = null
let root: Root | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null
let originalOverflow: string | null = null


const ensureMount = () => {
    if (globalThis.window === undefined) return
    if (!containerEl) {
        containerEl = document.createElement("div")
        document.body.appendChild(containerEl)
        root = createRoot(containerEl)
    }
}

const useSnackbar = () => {
    const addSnackbar = (opts: SnackbarOptions) => {
        if (globalThis.window === undefined) return
        ensureMount()

        if (originalOverflow === null) {
            originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
        }

        if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
        }

        const close = () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
                timeoutId = null
            }
            root?.render(null)
            document.body.style.overflow = originalOverflow ?? ''
            originalOverflow = null
        }


        if (opts.autoDismiss) {
            timeoutId = setTimeout(close, opts.autoDismiss)
        }

        root?.render(
            <>
                {/* backdrop */}
                <div
                    style={{ background: "rgba(110, 110, 115, 0.48)" }}
                    className="fixed inset-0 z-50"
                    aria-hidden
                    onClick={close}
                />
                <div className="fixed inset-0 top-0 z-50 flex justify-center lg:justify-end pointer-events-none px-6 pt-28 lg:pt-2">
                    <div className="pointer-events-auto w-full max-w-[456px]" data-testid={opts.dataTestid}>
                        <Snackbar
                            icon={opts.icon}
                            title={opts.title}
                            content={typeof opts.content === "function" ? opts.content(close) : opts.content}
                            onClose={close}
                            className={opts.className}
                            headerClassName={opts.headerClassName}
                            footer={typeof opts.footer === "function" ? opts.footer(close) : opts.footer}
                        />
                    </div>
                </div>
            </>
        )
    }
    return { addSnackbar }
}

export default useSnackbar
