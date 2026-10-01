"use client"
import {useEffect, useRef} from "react"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import type { Container } from "inversify"
import type { default as LoadAuthMemberUseCase } from "@/domain/interactors/Auth/LoadAuthMemberUseCase"
import {useDispatch} from "react-redux"
import {setValidatingSession} from "@/presentation/redux/features/userSlice"
import useSession from "@/presentation/hooks/useSession"
import TokenService from "@/domain/services/TokenService"

const AuthInitializer = () => {
    const dispatch = useDispatch()
    const { initSession } = useSession()
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true
        const run = async () => {
            try {
                const token = await TokenService.getToken()
                if (!token) {
                    dispatch(setValidatingSession({ validating: false }))
                    return
                }
                dispatch(setValidatingSession({ validating: true }))
                const { default: container } = await import("@/presentation/config/inversify.config")
                const useCase = (container as Container).get<LoadAuthMemberUseCase>(UseCaseTypes.LoadAuthMemberUseCase)
                const authMember = await useCase.loadAuthMember()
                initSession(authMember)
            } catch {
            } finally {
                dispatch(setValidatingSession({ validating: false }))
            }
        }

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            const id = window.requestIdleCallback(run, { timeout: 2000 })
            return () => window.cancelIdleCallback(id)
        }

        const timeoutId = setTimeout(run, 0)
        return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}

export default AuthInitializer
