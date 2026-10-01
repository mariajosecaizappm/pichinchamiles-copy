"use client"

import React, {
    ComponentType,
    PropsWithChildren,
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import { createPortal } from "react-dom"

export type ModalInjectedProps = {
    isActive: boolean
    modalId: string
    onClose: () => void
}

export type ModalComponent<TProps extends object = Record<string, unknown>> = ComponentType<
    TProps & ModalInjectedProps
>

type ModalState = {
    id: string
    Component: ModalComponent<Record<string, unknown>>
    props: Record<string, unknown>
}

export type OpenModal = <TProps extends object>(
    Component: ModalComponent<TProps>,
    props?: TProps,
    id?: string
) => string

export type ModalContextValues = {
    isOpen: boolean
    activeModalId: string | null
    openModal: OpenModal
    closeModal: (id?: string) => void
    closeAllModals: () => void
    hasOpenModal: (id: string) => boolean
}

const MODAL_ROOT_ID = "main-layout-modal-root"

const noopOpenModal: OpenModal = (_Component, _props, id) => id ?? ""

export const ModalContext = createContext<ModalContextValues>({
    isOpen: false,
    activeModalId: null,
    openModal: noopOpenModal,
    closeModal: () => {},
    closeAllModals: () => {},
    hasOpenModal: () => false,
})

const ModalProvider = ({ children }: PropsWithChildren) => {
    const [isMounted, setIsMounted] = useState(false)
    const [modalStack, setModalStack] = useState<ModalState[]>([])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const closeModal = useCallback((id?: string) => {
        setModalStack(currentStack => {
            if (currentStack.length === 0) return currentStack

            if (!id) {
                return currentStack.slice(0, -1)
            }

            const modalIndex = [...currentStack].reverse().findIndex(modalState => modalState.id === id)
            if (modalIndex === -1) return currentStack

            const stackIndex = currentStack.length - modalIndex - 1
            return currentStack.filter((_, index) => index !== stackIndex)
        })
    }, [])

    const closeAllModals = useCallback(() => {
        setModalStack([])
    }, [])

    const hasOpenModal = useCallback((id: string) => {
        return modalStack.some(modalState => modalState.id === id)
    }, [modalStack])

    const openModal = useCallback<OpenModal>((Component, props, id) => {
        const modalId = id ?? `modal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

        setModalStack(currentStack => {
            const modalIndex = currentStack.findLastIndex(modalState => modalState.id === modalId)
            const previousModalState = modalIndex !== -1 ? currentStack[modalIndex] : null
            const nextProps = (props ?? {}) as Record<string, unknown>
            const nextModalState = {
                id: modalId,
                Component: Component as ModalComponent<Record<string, unknown>>,
                props: previousModalState ? { ...previousModalState.props, ...nextProps } : nextProps,
            }

            if (modalIndex === -1) {
                return [...currentStack, nextModalState]
            }

            return [
                ...currentStack.filter((_, index) => index !== modalIndex),
                nextModalState,
            ]
        })

        return modalId
    }, [])

    const value = useMemo(
        () => ({
            isOpen: modalStack.length > 0,
            activeModalId: modalStack[modalStack.length - 1]?.id ?? null,
            openModal,
            closeModal,
            closeAllModals,
            hasOpenModal,
        }),
        [modalStack, openModal, closeModal, closeAllModals, hasOpenModal]
    )

    const modalRoot = isMounted
        ? document.getElementById(MODAL_ROOT_ID) ?? document.body
        : null

    const activeModal =
        modalRoot
            ? modalStack.map((modalState, index) => {
                const Component = modalState.Component
                const isActive = index === modalStack.length - 1

                return createPortal(
                    <Component
                        {...modalState.props}
                        isActive={isActive}
                        modalId={modalState.id}
                        onClose={() => closeModal(modalState.id)}
                    />,
                    modalRoot,
                    `${modalState.id}-${index}`
                )
            })
            : null

    return (
        <ModalContext.Provider value={value}>
            {children}
            {activeModal}
        </ModalContext.Provider>
    )
}

export default ModalProvider
