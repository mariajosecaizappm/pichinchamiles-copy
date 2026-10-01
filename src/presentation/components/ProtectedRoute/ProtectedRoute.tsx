"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import links from "@/presentation/config/links"
import useSession from "@/presentation/hooks/useSession"

type ProtectedRouteProps = {
    children: ReactNode
    fallback?: ReactNode
    redirectTo?: string
}

const ProtectedRoute = ({
    children,
    fallback = null,
    redirectTo = links.home,
}: ProtectedRouteProps) => {
    const router = useRouter()
    const { member, isValidatingSession } = useSession()

    useEffect(() => {
        if (!isValidatingSession && !member) {
            router.replace(redirectTo)
        }
    }, [member, isValidatingSession, redirectTo, router])

    if (isValidatingSession || !member) {
        return fallback
    }

    return children
}

export default ProtectedRoute
