"use client"
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
} from "@heroui/react"
import React from "react"
import Icon from "../icons/Icon"

interface BaseModalProps extends Omit<ModalProps, "onOpenChange" | "onClose"> {
  children: React.ReactNode
  footer?: React.ReactNode
  headerButton?: React.ReactNode
  closeButtonAriaLabel?: string
  onClose?: (isOpen: boolean) => void
  hideHeader?: boolean
}

const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    children,
    footer,
    classNames,
    headerButton,
    placement = "top",
    closeButtonAriaLabel = "Cerrar modal",
    hideHeader = false,
    hideCloseButton,
    ...props
}) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onClose} 
            placement={placement}
            hideCloseButton={hideCloseButton}
            closeButton={
                hideCloseButton ? null : (
                    <button data-testid="closeModal" type="button" aria-label={closeButtonAriaLabel}>
                        <Icon name="icon-close" />
                    </button>
                )
            }
            classNames={{
                ...classNames,
                wrapper: `!p-0 sm:!p-0 md:!p-6 ${classNames?.wrapper || ''}`,
                backdrop: `bg-[rgba(74,74,80,0.8)] ${classNames?.backdrop || ''}`,
                base: `!m-0 w-full max-w-full h-[100%] max-h-[100%] !rounded-none md:!m-auto md:w-full md:max-w-[456px] md:!h-auto md:max-h-[calc(100vh-4rem)] md:!rounded-xl overflow-hidden ${classNames?.base || ''}`,
                header: `p-[20px] border-b border-darkGrayishBlue-300 min-h-[62px] ${classNames?.header || ''}`,
                closeButton: `top-[20px] !right-[20px] p-0 text-blue-500 hover:opacity-70 ${classNames?.closeButton || ''}`,
                body: `p-6 typo-main-caption-book overflow-y-auto ${classNames?.body || ''}`,
                footer: `p-6 border-t border-darkGrayishBlue-300 ${classNames?.footer || ''}`,
            }}
            {...props}
        >
            <ModalContent>
                {() => (
                    <>
                        {!hideHeader && headerButton ? (
                            <ModalHeader className="flex flex-col gap-1">
                                {headerButton}
                            </ModalHeader>
                        ) : null}
                        <ModalBody>{children}</ModalBody>
                        {footer ? <ModalFooter>{footer}</ModalFooter> : null}
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default BaseModal
