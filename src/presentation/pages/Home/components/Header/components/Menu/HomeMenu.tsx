"use client";

import { Category } from "@/domain/entity/Category/structure/category";
import { useFocusTrap } from "@/presentation/hooks/useFocusTrap";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import useSession from "@/presentation/hooks/useSession";
import {
    cn,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    useDisclosure
} from "@heroui/react";
import { useMemo, useRef, useState } from "react";
import LoginButton from "../../../Button/LoginButton";
import CloseMenuButton from "./components/CloseMenuButtont";
import CloseSessionButton from "./components/CloseSessionButton";
import MainMenuNavList from "./components/MainMenuNavList";
import SubmenuBackButton from "./components/SubMenuBackButton";
import SubMenuNavList from "./components/SubMenuNavList";
import { buildNavItems, MenuItem } from "./HomeMenuConfig";
import links from "@/presentation/config/links";
import MenuTrigger from "./components/MenuTrigger";

type Props = {
    productCategories?: Category[]
    isDisabled?: boolean
}

const HomeMenu = ({
    productCategories,
    isDisabled = false
}: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [activeSubmenu, setActiveSubmenu] = useState<MenuItem | null>(null);
    const { isDesktop } = useIsDesktop();
    const { member } = useSession();
    const menuRef = useRef<HTMLButtonElement>(null);

    const handleDrawerChange = () => {
        setActiveSubmenu(null);
        onOpenChange();
    };

    const handleEscape = () => {
        handleDrawerChange();
        menuRef.current?.focus();
    };

    const focusTrapRef = useFocusTrap({
        isActive: isOpen,
        onEscape: handleEscape
    });

    const NAV_ITEMS = useMemo(() =>
        buildNavItems(productCategories?.map(c => ({ label: c.name, href: `${links.productsList}/categoria/${c.slug}` })) || [], !!member),
    [productCategories, member]
    );

    const getDrawerMaxWidth = () => {
        if (!isDesktop) return "rounded-none max-w-[284px]";
        return activeSubmenu ? "max-w-[799px] rounded-r-lg!" : "max-w-[471px]";
    };

    return (
        <>
            <MenuTrigger onClick={onOpen} isOpen={isOpen} isDisabled={isDisabled} />
            <Drawer
                ref={focusTrapRef}
                id="navigation-menu"
                size={isDesktop ? "full" : "xs"}
                hideCloseButton
                scrollBehavior="inside"
                classNames={{
                    // Desktop: independent column scrolls. Mobile: single body scroll.
                    base: cn(
                        "text-grayscale-500 items-start flex-1 self-stretch overflow-y-hidden max-h-none h-full",
                        getDrawerMaxWidth()
                    ),
                    backdrop: "bg-neutral-600/80 z-60",
                    body: isDesktop ? "overflow-hidden" : "overflow-y-auto",
                    wrapper: "typo-main-caption-book z-70"

                }}
                aria-label="Menú de navegación principal"
                aria-modal="true"
                isOpen={isOpen}
                onOpenChange={handleDrawerChange}
                placement="left">
                <DrawerContent>
                    {isDesktop ? (
                        <DrawerBody className="w-full h-full p-0 flex flex-row gap-0 overflow-hidden">
                            <div className="flex flex-col w-full h-full max-w-117.75 bg-white shadow-[8px_0px_8px_-8px_rgba(7,7,7,0.16)] z-10 overflow-hidden">
                                <div className="px-10 py-4.5 shrink-0">
                                    <CloseMenuButton onClick={handleDrawerChange} />
                                </div>
                                <div className="px-8 py-4 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    <MainMenuNavList
                                        items={NAV_ITEMS}
                                        setActiveSubmenu={setActiveSubmenu}
                                        handleDrawerChange={handleDrawerChange}
                                        activeSubmenu={activeSubmenu}
                                    />
                                </div>
                                <DrawerFooter className="flex items-center justify-center w-full p-4 shrink-0 shadow-[0px_-8px_8px_-8px_rgba(7,7,7,0.16)]">
                                    {
                                        member ? (
                                            <div className="w-full">
                                                <CloseSessionButton />
                                            </div>
                                        ) : (
                                            <LoginButton className="w-full max-w-[220px]" size="lg" />
                                        )
                                    }
                                </DrawerFooter>
                            </div>
                            {
                                activeSubmenu && (
                                    <div className="px-10 pt-20 pb-10 w-full h-full max-w-[328px] bg-darkGrayishBlue-50 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                        <SubMenuNavList
                                            handleDrawerChange={handleDrawerChange}
                                            activeSubmenu={activeSubmenu} />
                                    </div>
                                )
                            }
                        </DrawerBody>

                    ) : (
                        <>
                            <DrawerBody className="w-full p-6 flex flex-col gap-6">
                                {!activeSubmenu ? (
                                    <>
                                        <CloseMenuButton onClick={handleDrawerChange} />
                                        <MainMenuNavList
                                            items={NAV_ITEMS}
                                            setActiveSubmenu={setActiveSubmenu}
                                            handleDrawerChange={handleDrawerChange}
                                            activeSubmenu={activeSubmenu}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <SubmenuBackButton setActiveSubmenu={setActiveSubmenu} />
                                        <SubMenuNavList activeSubmenu={activeSubmenu} handleDrawerChange={handleDrawerChange} />
                                    </>
                                )}
                            </DrawerBody>
                            {
                                !member ? (
                                    <DrawerFooter className="flex items-center justify-center w-full p-4 shadow-[0px_-8px_8px_-8px_rgba(7,7,7,0.16)]">
                                        {
                                            member ? (
                                                <div className="w-full">
                                                    <CloseSessionButton />
                                                </div>
                                            ) : (
                                                <LoginButton className="w-full" size="lg" />
                                            )
                                        }
                                    </DrawerFooter>
                                ) : (
                                    <>
                                        {
                                            !activeSubmenu && (
                                                <DrawerFooter className="flex items-center justify-center w-full p-4 shadow-[0px_-8px_8px_-8px_rgba(7,7,7,0.16)]">
                                                    <div className="w-full">
                                                        <CloseSessionButton />
                                                    </div>
                                                </DrawerFooter>
                                            )
                                        }
                                    </>
                                )
                            }
                        </>
                    )}
                </DrawerContent>
            </Drawer>

        </>
    );
};













export default HomeMenu;
