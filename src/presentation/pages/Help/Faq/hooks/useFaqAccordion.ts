"use client"

import type { Selection } from "@react-types/shared"
import { useCallback, useEffect, useRef, useState } from "react"
import { FaqCategoryWithQuestions } from "@/domain/entity/Pqrs/pqrs"

const STICKY_QUESTION_GAP = 100

const getFirstQuestionId = (categories: FaqCategoryWithQuestions[], categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.questions[0]?.id ?? null

export type UseFaqAccordionReturn = {
    currentCategoryId: string
    selectedKeys: Set<string>
    activeCategory: FaqCategoryWithQuestions | undefined
    stickyRef: React.RefObject<HTMLDivElement | null>
    accordionContainerRef: React.RefObject<HTMLDivElement | null>
    handleTabChange: (tabId: string) => void
    handleSelectionChange: (keys: Selection) => void
}

export const useFaqAccordion = (faqCategories: FaqCategoryWithQuestions[]): UseFaqAccordionReturn => {
    const [currentCategoryId, setCurrentCategoryId] = useState(() => faqCategories[0]?.id ?? "")
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => {
        const firstId = getFirstQuestionId(faqCategories, faqCategories[0]?.id ?? "")
        return firstId ? new Set([firstId]) : new Set<string>()
    })

    const shouldScrollRef = useRef(false)
    const shouldScrollToTopRef = useRef(false)
    const stickyRef = useRef<HTMLDivElement>(null)
    const accordionContainerRef = useRef<HTMLDivElement>(null)

    const handleTabChange = useCallback((tabId: string) => {
        setCurrentCategoryId(tabId)

        const firstId = getFirstQuestionId(faqCategories, tabId)
        shouldScrollRef.current = false
        shouldScrollToTopRef.current = true
        setSelectedKeys(firstId ? new Set([firstId]) : new Set<string>())
    }, [faqCategories])

    const handleSelectionChange = useCallback((keys: Selection) => {
        const newKeys = keys === "all" ? new Set<string>() : new Set<string>(keys as Iterable<string>)

        shouldScrollRef.current = true
        setSelectedKeys(newKeys)
    }, [])

    useEffect(() => {
        const openKey = Array.from(selectedKeys)[0] ?? null

        if (shouldScrollToTopRef.current) {
            shouldScrollToTopRef.current = false
            setTimeout(() => {
                const stickyElement = stickyRef.current
                const accordionElement = accordionContainerRef.current
                if (!stickyElement || !accordionElement) return
                const stickyBottom = stickyElement.getBoundingClientRect().bottom
                const accordionTop = accordionElement.getBoundingClientRect().top
                const delta = accordionTop - stickyBottom - 16
                if (Math.abs(delta) > 1) {
                    window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" })
                }
            }, 0)
            return
        }

        if (!openKey || !shouldScrollRef.current) {
            return
        }

        shouldScrollRef.current = false

        const openTrigger = accordionContainerRef.current?.querySelector<HTMLElement>(
            '[aria-expanded="true"]',
        )
        const activeElement = document.activeElement as HTMLElement | null
        const trigger = openTrigger ?? activeElement
        if (!trigger) return

        const stickyElement = stickyRef.current

        trigger.focus({ preventScroll: true })

        setTimeout(() => {
            if (!stickyElement || typeof trigger.getBoundingClientRect !== "function") {
                trigger.scrollIntoView({ behavior: "smooth", block: "nearest" })
                return
            }

            const stickyBottom = stickyElement.getBoundingClientRect().bottom
            const triggerTop = trigger.getBoundingClientRect().top
            const delta = triggerTop - stickyBottom - STICKY_QUESTION_GAP

            if (Math.abs(delta) > 1) {
                window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" })
            }
        }, 0)
    }, [currentCategoryId, selectedKeys])

    const activeCategory = faqCategories.find((category) => category.id === currentCategoryId)

    return {
        currentCategoryId,
        selectedKeys,
        activeCategory,
        stickyRef,
        accordionContainerRef,
        handleTabChange,
        handleSelectionChange,
    }
}
