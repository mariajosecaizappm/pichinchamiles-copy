"use client"

import React, { createContext, useState, useCallback, useEffect, useMemo } from "react"

type AnnouncementPriority = "polite" | "assertive"

interface Announcement {
    message: string
    priority: AnnouncementPriority
}

export interface ScreenReaderContextType {
    announce: (message: string, priority?: AnnouncementPriority) => void
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
}

export const ScreenReaderContext = createContext<ScreenReaderContextType | null>(null)

interface ScreenReaderProviderProps {
    children: React.ReactNode
}

export const ScreenReaderProvider: React.FC<ScreenReaderProviderProps> = ({ children }) => {
    const [politeMessage, setPoliteMessage] = useState("")
    const [assertiveMessage, setAssertiveMessage] = useState("")
    const [queue, setQueue] = useState<Announcement[]>([])

    const processQueue = useCallback(() => {
        if (queue.length === 0) return

        const nextAnnouncement = queue[0]

        // Force re-read by clearing first, then setting the new message
        if (nextAnnouncement.priority === "assertive") {
            setAssertiveMessage("")
            setTimeout(() => setAssertiveMessage(nextAnnouncement.message), 50)
        } else {
            setPoliteMessage("")
            setTimeout(() => setPoliteMessage(nextAnnouncement.message), 50)
        }

        setQueue((prev) => prev.slice(1))
    }, [queue])

    useEffect(() => {
        if (queue.length > 0) {
            const timer = setTimeout(processQueue, 100)
            return () => clearTimeout(timer)
        }
    }, [queue, processQueue])

    const announce = useCallback((message: string, priority: AnnouncementPriority = "polite") => {
        setQueue((prev) => [...prev, { message, priority }])
    }, [])

    const success = useCallback((message: string) => {
        announce(message, "polite")
    }, [announce])

    const error = useCallback((message: string) => {
        announce(message, "assertive")
    }, [announce])

    const info = useCallback((message: string) => {
        announce(message, "polite")
    }, [announce])

    const contextValue = useMemo(
        () => ({ announce, success, error, info }),
        [announce, success, error, info]
    )

    return (
        <ScreenReaderContext.Provider value={contextValue}>
            {children}

            {/* Polite live region - for informational messages */}
            <output
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {politeMessage}
            </output>

            {/* Assertive live region - for urgent/error messages */}
            <div
                aria-live="assertive"
                aria-atomic="true"
                role="alert"
                className="sr-only"
            >
                {assertiveMessage}
            </div>
        </ScreenReaderContext.Provider>
    )
}

export { useScreenReader } from "../../hooks/useScreenReader"

