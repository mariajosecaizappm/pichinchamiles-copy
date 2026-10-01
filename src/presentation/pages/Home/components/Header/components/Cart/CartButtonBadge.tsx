"use client"

import useSession from '@/presentation/hooks/useSession';
import { Badge } from "@heroui/badge";

type Props = {
    children: React.ReactNode;
}

const CartButtonBadge = ({ children }: Props) => {
    const { basket } = useSession();
    if (basket && basket?.items?.length > 0) return (
        <Badge content={basket?.items?.length || 0} className='bg-darkCyan-500 text-white border-none w-4 h-4 min-w-4 min-h-4 text-[8px]'>
            {children}
        </Badge>
    )

    return children
}

export default CartButtonBadge