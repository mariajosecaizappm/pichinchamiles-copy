import { MenuItem } from "../HomeMenuConfig"
import ArrowIcon from "./Icons/ArrowIcon"

const SubmenuBackButton = ({ setActiveSubmenu }: { setActiveSubmenu: (item: MenuItem | null) => void }) => {
    return (
        <button
            onClick={() => setActiveSubmenu(null)}
            className="flex items-center gap-1 text-information-500 cursor-pointer"
            aria-label="Volver al menú principal"
        >
            <span className="rotate-180">
                <ArrowIcon />
            </span>
            <span className="text-sm font-medium leading-5 -mb-0.5">Menú principal</span>
        </button>
    )
}

export default SubmenuBackButton