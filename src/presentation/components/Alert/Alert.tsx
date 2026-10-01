"use client"

import React from 'react';
import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";
import SpriteIcon from "../icons/Icon";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "warning" | "info" | "success" | "error";
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    icon?: string;
    onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ variant = "warning", children, className, contentClassName, icon, onClose, ...props }, ref) => {
        const styles = React.useMemo(() => {
            switch (variant) {
            case "warning":
                return {
                    container: "bg-warning-50 border-pureOrange-200 p-3",
                    icon: "text-warning-500",
                    defaultIcon: "ic:round-warning",
                };
            case "info":
            default:
                return {
                    container: "bg-information-50 border-information-300",
                    icon: "text-information-500",
                    defaultIcon: "ic:round-info",
                };
            }
        }, [variant]);

        let alertIcon;
        if (icon) {
            alertIcon = (
                <Icon
                    icon={icon}
                    className={cn("mt-0.5 shrink-0 text-2xl", styles.icon)}
                    aria-hidden="true"
                />
            );
        } else if (variant === "warning") {
            alertIcon = (
                <SpriteIcon name="icon-info" className={cn("mt-0.5 shrink-0 text-2xl", styles.icon)} aria-hidden="true" />
            );
        } else {
            alertIcon = (
                <Icon
                    icon={styles.defaultIcon}
                    className={cn("mt-0.5 shrink-0 text-2xl", styles.icon)}
                    aria-hidden="true"
                />
            );
        }

        return (
            <div
                ref={ref}
                role="alert"
                aria-live="assertive"
                className={cn(
                    "flex flex-row items-start gap-3 rounded-lg border p-4",
                    styles.container,
                    className
                )}
                {...props}
            >
                {alertIcon}
                <div className={cn("text-grayscale-500 text-[14px] leading-[20px] font-normal", contentClassName)}>
                    {children}
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="shrink-0 text-grayscale-500 hover:text-grayscale-700 transition-colors cursor-pointer"
                    >
                        <Icon icon="mdi:close" className="text-xl" aria-hidden="true" />
                    </button>
                )}
            </div>
        );
    }
);

Alert.displayName = "Alert";

export default Alert;