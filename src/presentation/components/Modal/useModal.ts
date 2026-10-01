"use client"

import { useContext } from "react"
import { ModalComponent, ModalContext } from "./ModalProvider"

const useModal = (modalId?: string) => {
    const {
        isOpen,
        openModal,
        closeModal,
        closeAllModals,
        hasOpenModal,
        activeModalId,
    } = useContext(ModalContext)

    const scopedOpenModal = <TProps extends object>(
        Component: ModalComponent<TProps>,
        props?: TProps,
        id?: string
    ) => {
        return openModal(Component, props, id ?? modalId)
    }

    const scopedCloseModal = (id?: string) => {
        closeModal(id ?? modalId)
    }

    return {
        isOpen: modalId ? hasOpenModal(modalId) : isOpen,
        activeModalId,
        openModal: scopedOpenModal,
        closeModal: scopedCloseModal,
        closeAllModals,
        hasOpenModal,
    }
}

export default useModal
