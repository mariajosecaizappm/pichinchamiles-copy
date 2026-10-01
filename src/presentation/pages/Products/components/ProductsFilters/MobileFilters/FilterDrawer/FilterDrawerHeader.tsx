import { DrawerHeader } from "@heroui/react"

const FilterDrawerHeader = ({ onClose }: { onClose: () => void }) => {
    return (
        <DrawerHeader className="px-5 py-4 h-16 border-b border-darkGrayishBlue-300">
            <div className="flex items-center justify-between w-full">
                <span>
                    Filtros
                </span>
                <button type="button" className="w-6 h-6 flex items-center justify-center text-grayscale-400" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </DrawerHeader>
    )
}

export default FilterDrawerHeader