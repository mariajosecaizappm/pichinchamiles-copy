import Button from "@/presentation/pages/Home/components/Button"
import { Chip, cn } from "@heroui/react"

type Props = {
    children: React.ReactNode
    count?: number
} & React.ComponentProps<typeof Button>

const MobileFilterTrigger = ({ children, count = 0, className, ...props }: Props) => {
    const hasActive = count > 0
    return (
        <Button
            size={"sm"}
            variant="bordered"
            color="default"
            className={cn(
                "text-information-500 border-darkGrayishBlue-300 rounded-lg text-xs font-medium leading-5 h-10 py-2.5 pr-2 gap-1 hover:bg-darkGrayishBlue-100 disabled:opacity-50 disabled:cursor-not-allowed",
                hasActive && "bg-darkGrayishBlue-100",
                className,
            )}
            endContent={
                <span className="w-5 h-5 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.175 7.15833L10 10.975L13.825 7.15833L15 8.33333L10 13.3333L5 8.33333L6.175 7.15833Z" fill="currentColor"/>
                    </svg>
                </span>
            }
            {...props}
        >
            {children}
            {hasActive && (
                <Chip
                    size="sm"
                    classNames={{
                        base: "h-4 min-w-4 w-4 bg-darkCyan-500 flex items-center justify-center py-[2.5px] px-1.5",
                        content: "text-white text-[8px] leading-[11px] font-bold text-center",
                    }}
                >
                    {count}
                </Chip>
            )}
        </Button>
    )
}

export default MobileFilterTrigger