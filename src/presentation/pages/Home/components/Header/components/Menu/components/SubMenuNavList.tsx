import Link from "next/link"
import { MenuItem } from "../HomeMenuConfig"
import { useEffect, useRef } from "react"
import useContactLinkGuard from "@/presentation/hooks/useContactLinkGuard"

const SubMenuNavList = ({ activeSubmenu, handleDrawerChange }: { activeSubmenu: MenuItem, handleDrawerChange: () => void }) => {
    const navRef = useRef<HTMLElement>(null)
    const handleContactClick = useContactLinkGuard()

    useEffect(() => {
        if (navRef.current) {
            requestAnimationFrame(() => {
                navRef.current?.focus()
            })
        }
    }, [activeSubmenu])

    return (
        <nav 
            ref={navRef}
            className="flex flex-col gap-4 md:gap-2" 
            aria-label={`Menú ${activeSubmenu.label.toLowerCase()}`}
            tabIndex={-1}
        >
            <span className="text-xl font-semibold text-blue-500">
                {
                    activeSubmenu.href ? (
                        <Link
                            onClick={handleDrawerChange}
                            href={activeSubmenu.href}
                            aria-label={`Ver ${activeSubmenu.label.toLowerCase()}`}
                        >
                            {activeSubmenu.label}
                        </Link>
                    ) : (
                        <h2 className="text-xl font-semibold text-blue-500">{activeSubmenu.label}</h2>
                    )
                }
            </span>
            <ul className="flex flex-col gap-5 md:gap-2">
                {activeSubmenu.submenus?.map((submenu) => (
                    <li key={submenu.href}>
                        <Link
                            onClick={(e) => { handleContactClick(e, submenu.href); handleDrawerChange(); }}
                            href={submenu.href}
                            className="self-stretch leading-6 text-base"
                            aria-label={`Ir a ${submenu.label.toLowerCase()}`}
                        >
                            <span>{submenu.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default SubMenuNavList