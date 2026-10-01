"use client"
import useSession from "@/presentation/hooks/useSession"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

const Logo = () => {
    const {isLogged} = useSession()
    
    return (
        <div className={clsx("mx-auto", isLogged ? "lg:mr-auto lg:ml-0" : "lg:mx-auto")}>
            <Link href="/" aria-label="Ir al inicio de Pichincha Miles">
                <Image
                    src={"/pm-logo.svg"}
                    alt="Pichincha Miles Logo"
                    className="h-7.75 md:h-12 w-auto"
                    width={155}
                    priority
                    height={32}
                    unoptimized
                    fetchPriority="high"
                />
            </Link>
        </div>
    )
}

export default Logo