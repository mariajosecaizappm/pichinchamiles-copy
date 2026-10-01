"use client"

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import useSession from "@/presentation/hooks/useSession";

const HomeRedirect = () => {
    const searchParams = useSearchParams();
    const { isLogged, onOpenAuthModal } = useSession();

    useEffect(() => {
        const flowParam = searchParams.get("flow");
        if(flowParam && flowParam === "login" && !isLogged) onOpenAuthModal();
    }, [searchParams]);

    return null
};

export default HomeRedirect;