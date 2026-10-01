"use client"
import { cn, Divider } from "@heroui/react"
import React, { ComponentType, FC } from "react"
import { Icon as AppIcon } from "../icons/Icon"

type SnackbarProps = {
    icon: ComponentType
    title?: string
    content: React.ReactNode
    onClose: () => void
    className?: string
    headerClassName?: string
    headerTitleClassName?: string
    footer?: React.ReactNode
}

const Snackbar: FC<SnackbarProps> = ({
    icon: Icon,
    title,
    content,
    onClose,
    className,
    headerClassName,
    headerTitleClassName,
    footer,
}) => {

    return (
        <div
            className={cn(
                "bg-white rounded-xl shadow-xl overflow-hidden self-stretch font-sans",
                className,
            )}
            role="alertdialog"
            aria-labelledby="snackbar-title"
        >
            <div className="flex flex-col w-full">
                <div
                    className={cn(`flex items-center justify-between gap-2 [&>svg]:w-12 [&>svg]:h-12 [&>svg]:min-w-12 [&>svg]:min-h-12 [&>p]:shrink-0 ${headerClassName}`)}>

                    <div className="py-4 pl-5">
                        <p id="snackbar-title" className={cn("font-medium", headerTitleClassName)}>
                            {title}
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="p-4 flex items-center justify-center">
                            <button
                                type="button"
                                aria-label="Cerrar"
                                data-testid="closeModal"
                                onClick={onClose}
                                className="text-grayscale-400 hover:bg-default-100 hover:opacity-70 rounded-full"
                            >
                                <span className="flex items-center justify-center text-blue-500 h-6 w-6">
                                    <AppIcon name="icon-close" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <Divider className="bg-darkGrayishBlue-300" />
            </div>

            <div className="p-6 flex flex-col items-center gap-2">
                <Icon />
                {content}
            </div>

            {footer ? (
                <div className="flex flex-col w-full">
                    <Divider className="bg-darkGrayishBlue-300" />
                    {footer}
                </div>
            ) : null}
        </div>
    )
}

export default Snackbar
