"use client"
import { Button, ButtonProps as HeroUIButtonProps } from "@heroui/react"
import { cn } from "@heroui/theme"
import React from "react"

export interface ButtonProps extends HeroUIButtonProps {
    testId?: string;
}

const BaseButton: React.FC<ButtonProps> = ({
    className,
    color,
    testId,
    ...props
}) => {
    return (
        <Button
            className={cn(
                "w-full h-12 rounded-sm text-sm leading-6 font-semibold",
                color === "primary" &&
                    "bg-yellow-500 text-blue-500 data-[disabled=true]:bg-yellow-200 data-[disabled=true]:text-blue-200 data-[disabled=true]:opacity-100",
                color === "secondary" &&
                    "border border-darkGrayishBlue-300 bg-darkGrayishBlue-200 text-blue-500",
                className
            )}
            color={color}
            data-testid={testId}
            {...props}
        />
    )
}

export default BaseButton
