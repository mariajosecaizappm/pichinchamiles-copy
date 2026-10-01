"use client"

import { useContext } from "react"
import { ScreenReaderContext } from "../components/providers/ScreenReaderProvider"
import type { ScreenReaderContextType } from "../components/providers/ScreenReaderProvider"

export const useScreenReader = (): ScreenReaderContextType => {
    const context = useContext(ScreenReaderContext)
    if (!context) {
        throw new Error("useScreenReader must be used within ScreenReaderProvider")
    }
    return context
}
