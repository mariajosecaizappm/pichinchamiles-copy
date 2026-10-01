"use client"

import { extendVariants, Button as HerouiButton } from "@heroui/react";

const Button = extendVariants(HerouiButton, {
    variants: {
        variant: {
            "bordered": "border border-blue-500 rounded-sm",
        },
        // <- modify/add variants
        color: {
            primary: "bg-yellow-500 text-blue-500",
            secondary: "bg-darkGrayishBlue-200 text-blue-500",

        },
        size: {
            md: "py-2 px-4 h-8 md:h-12 md:py-3 md:px-6 rounded-sm text-xs md:text-sm font-semibold",
            lg: "py-3 px-6 h-12 rounded-sm text-sm font-semibold",
        },
    },
    defaultVariants: { // <- modify/add default variants
        color: "primary",
        size: "md",
    },
    compoundVariants: [ // <- modify/add compound variants
        {
            color: "primary",
            class: "bg-yellow-500 text-blue-500",
        },
        {
            variant: "bordered",
            class: "border border-blue-500 rounded-sm bg-transparent",
        },
    ],
});

export default Button;