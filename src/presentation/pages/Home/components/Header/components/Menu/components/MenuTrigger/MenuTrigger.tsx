import { cn } from "@heroui/react"
import MenuIcon from "@/presentation/pages/Home/components/Header/components/Icons/MenuIcon"


type Props = {
    onClick?: () => void
    isOpen?: boolean
    isDisabled?: boolean
}

const MenuTrigger = ({ onClick, isOpen = false, isDisabled = false }: Props) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Abrir menú de navegación"
            aria-expanded={isOpen}
            aria-controls="navigation-menu"
            disabled={isDisabled}
            className={cn(
                "flex p-1 items-center gap-2.5 text-blue-500 cursor-pointer",
                isDisabled && "cursor-not-allowed opacity-50"
            )}>
            <MenuIcon className="w-4.5 h-3"/>
            <span className="hidden md:block text-xl font-semibold">Menú</span>
        </button>
    )
}

export default MenuTrigger