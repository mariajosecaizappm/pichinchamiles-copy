import { cn } from "@heroui/react"
import CleanFilters from "./CleanFilters/CleanFilters"

type Props = {
    children: React.ReactNode
    onClearFilters: () => void
    isLoading?: boolean
    className?: string
}

const DesktopFiltersWrapper = ({ children, onClearFilters, isLoading, className }: Props) => (
    <aside className={cn("hidden lg:block lg:sticky lg:self-start w-full max-w-77 shrink-0 bg-white", className)}>
        <div className="flex flex-col gap-3">
            <div className="pt-4 flex flex-col gap-4">
                <h5 className="text-xl font-semibold px-4">Filtros</h5>
            </div>
            <CleanFilters onClearFilters={onClearFilters} isLoading={isLoading} />
            {children}
        </div>
    </aside>
)

export default DesktopFiltersWrapper
