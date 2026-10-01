"use client"

import links from "@/presentation/config/links";
import useSession from "@/presentation/hooks/useSession";
import { useRouter } from "next/navigation";
import { OrdersSkeleton } from "./components/Layout";

type Props = {
    children: React.ReactNode
}

const OrdersWrapper = ({ children }: Props) => {
    const { member, isValidatingSession } = useSession();
    const router = useRouter();
    
    if (isValidatingSession) {
        return (
            <div className="min-h-85">
                <OrdersSkeleton />
            </div>
        )
    }
    
    if (!member) {
        router.replace(links.home);
        return null;
    }
    
    return (
        <div className="min-h-85">
            {children}
        </div>
    )
}

export default OrdersWrapper;