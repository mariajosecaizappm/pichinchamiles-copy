import clsx from "clsx"

const gapMap: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
}

export const RowStyles = (
    gap: "sm" | "md" | "lg" | "xl" | "none" | undefined
) => clsx("flex flex-wrap w-full", gap && gapMap[gap])
