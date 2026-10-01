"use client"

import { CategoryGroup } from "@/domain/entity/Category/structure/category";
import Button from "@/presentation/pages/Home/components/Button";
import { cn } from "@heroui/react";
import Link from "next/link";


type Props = {
    category: CategoryGroup
    count?: number
    href: string;
    replace?: boolean;
    scroll?: boolean;
    className?: string;
} & Omit<React.ComponentProps<typeof Button>, "href">

const SubcategoryChip = ({
    category,
    count,
    href,
    replace,
    scroll,
    className,
    ...buttonProps
}: Props) => {
    return (
        <Button
            as={Link}
            href={href}
            replace={replace}
            scroll={scroll}
            {...buttonProps}
            size="sm"
            variant="bordered"
            className={cn("rounded-full text-grayscale-500 bg-darkGrayishBlue-100 border-darkGrayishBlue-400 min-w-16.25 hover:bg-blue-400 hover:text-white hover:border-blue-400 px-4 py-0.5 h-8 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500 data-[active=true]:min-w-25 font-medium text-sm leading-5 outline-none! focus:outline-none! active:outline-none! focus-visible:outline-none! data-[focus=true]:outline-none! data-[focus-visible=true]:outline-none!", className)}
        >
            {category.name}{count !== undefined ? ` (${count})` : ""}
        </Button>
    )
}

export default SubcategoryChip