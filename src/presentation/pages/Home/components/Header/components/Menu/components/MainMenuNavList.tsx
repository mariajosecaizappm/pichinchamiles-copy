import { MemberType } from "@/domain/entity/Member/member"
import useSession from "@/presentation/hooks/useSession"
import useContactLinkGuard from "@/presentation/hooks/useContactLinkGuard"
import Link from "next/link"
import { MenuItem } from "../HomeMenuConfig"
import ArrowIcon from "./Icons/ArrowIcon"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import links from "@/presentation/config/links";
import {EventName} from "@/presentation/analytics/types";

const MainMenuNavList = ({ items, setActiveSubmenu, handleDrawerChange, activeSubmenu }: {
    items: MenuItem[]
    setActiveSubmenu: (item: MenuItem) => void
    handleDrawerChange: () => void
    activeSubmenu: MenuItem | null
}) => {
    const { member } = useSession();
    const { track } = useAnalytics();
    const handleContactClick = useContactLinkGuard();
    return (
        <nav aria-label="Menú principal">
            <ul className="flex flex-col gap-5 md:gap-1">

                
                {member && (
                    <li className="text-blue-500 leading-6 text-base md:text-[22px] font-slab md:leading-7 md:px-2 md:py-4 rounded-lg md:border border-transparent flex items-center self-stretch gap-4">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2C9.1 2 10 2.9 10 4C10 5.1 9.1 6 8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2ZM8 12C10.7 12 13.8 13.29 14 14H2C2.23 13.28 5.31 12 8 12ZM8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
                        </svg>
                        Hola, {member.memberType === MemberType.PERSONAL ? member.firstName : member.companyName}
                    </li>
                )}

                {items.map((item) => {
                    const isActive = activeSubmenu?.label === item.label;
                    return (
                        <li
                            key={item.label}
                            className={`text-blue-500 leading-6 text-base md:text-[22px] font-slab md:leading-7 rounded-lg md:border border-transparent ${isActive ? "md:border-blue-500" : ""}`}
                        >
                            {item.submenus && item.submenus.length > 0 ? (
                                <button
                                    onClick={() => setActiveSubmenu(item)}
                                    className="flex items-center self-stretch justify-between w-full cursor-pointer h-full md:px-2 md:py-4"
                                    aria-haspopup="true"
                                    aria-expanded={isActive}
                                    aria-label={`Ir a ${item.label.toLowerCase()}`}
                                >
                                    <span className={`${isActive ? "font-semibold" : ""}`}>{item.label}</span>
                                    <span aria-hidden="true">
                                        <ArrowIcon />
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    onClick={(e) => {
                                        handleContactClick(e, item.href!);
                                        handleDrawerChange();
                                        if(item.href === links.transferMiles) track(EventName.CLICKED_TRANSFER);
                                    }}
                                    href={item.href!}
                                    className="flex items-center self-stretch justify-between md:px-2 md:py-4"
                                    aria-label={`Ir a ${item.label.toLowerCase()}`}
                                >
                                    <span>{item.label}</span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    )
}


export default MainMenuNavList