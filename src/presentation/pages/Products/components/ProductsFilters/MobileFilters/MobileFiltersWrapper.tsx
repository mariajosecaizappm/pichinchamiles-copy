"use client"
import { cn } from "@heroui/react"
import { ScrollMenu } from "react-horizontal-scrolling-menu"

type ItemType = React.ReactElement<{ itemId: string }>

type Props = {
    children: ItemType | ItemType[]
    className?: string
}

const MobileFilters = ({ children, className }: Props) => {


    return (
        <ScrollMenu
            wrapperClassName="relative overflow-hidden w-full"
            scrollContainerClassName={cn("flex gap-2.5 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden px-6 py-2", className)}
        >
            {children}
        </ScrollMenu>
    )
}


export default MobileFilters