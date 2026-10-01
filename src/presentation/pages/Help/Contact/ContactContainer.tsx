"use client"

import useSession from "@/presentation/hooks/useSession"
import { useRouter } from "next/navigation"
import Contact from "./Contact"
import links from "@/presentation/config/links"

const ContactFormContainer = () => {
    const { isLogged, member, isValidatingSession } = useSession()
    const router = useRouter()
    
    if(isValidatingSession) {
        return null
    }

    if(!isLogged || !member) {
        router.push(links.home);
        return null;
    }


    return <Contact />
}

export default ContactFormContainer