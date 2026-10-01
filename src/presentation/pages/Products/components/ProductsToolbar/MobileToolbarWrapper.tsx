"use client"

import useSession from "@/presentation/hooks/useSession"
import { cn } from "@heroui/react"
import StickyNavWrapper from "../../../Home/UseYourMiles/Layout/components/StickyNavWrapper"

type Props = {
    children: React.ReactNode
}

const MobileToolbar = ({ children }: Props) => {

    const { isLogged } = useSession()

    return (
        <StickyNavWrapper className={cn("sticky bg-white z-20 lg:hidden", isLogged ? "top-24 md:top-27" : "top-15 md:top-18")}>
            {children}
        </StickyNavWrapper>
    )

}

export default MobileToolbar
