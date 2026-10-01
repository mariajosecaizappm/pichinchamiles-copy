import { cn } from "@heroui/react"

const StatusChipWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <span className={cn("flex gap-1 items-center rounded-2xl border p-1 pr-2 text-xs leading-4 font-medium h-6", className)}>
            {children}
        </span>
    )
}

export default StatusChipWrapper