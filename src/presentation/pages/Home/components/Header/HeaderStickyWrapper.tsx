"use client";

import {
    nonStickyPathsDesktop,
    nonStickyPathsMobile,
    shouldHeaderStick,
} from "./data";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode } from "react";

type HeaderStickyWrapperProps = {
    children: ReactNode;
};

const HeaderStickyWrapper = ({ children }: HeaderStickyWrapperProps) => {
    const pathname = usePathname() ?? "";
    const shouldStickOnMobile = shouldHeaderStick(pathname, nonStickyPathsMobile);
    const shouldStickOnDesktop = shouldHeaderStick(pathname, nonStickyPathsDesktop);

    return (
        <header
            className={clsx(
                "py-[12.5px] gap-3 bg-white px-4 flex flex-col items-center justify-center shadow-[0px_8px_8px_-8px_rgba(7,7,7,0.16)]",
                {
                    "sticky top-0 z-50": shouldStickOnMobile,
                    "lg:sticky lg:top-0 lg:z-50": shouldStickOnDesktop,
                    "lg:static": !shouldStickOnDesktop,
                },
            )}
        >
            {children}
        </header>
    );
};

export default HeaderStickyWrapper;
