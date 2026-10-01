import type { Metadata } from "next"
import illustration from "@/presentation/assets/404.svg"
import { Button } from "@/presentation/components/Form/components/Button"
import links from "@/presentation/config/links"
import pageMetadata from "@/presentation/config/metadata"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = pageMetadata.notFound

const NotFound = () => {
    return (
        <div>
            <section className="flex w-full flex-col items-center justify-center py-15.5 body-container">
                <div className="flex flex-col items-center">
                    <div className="w-62 h-62 md:w-80 md:h-80 flex items-center justify-center p-7 md:p-10">
                        <Image
                            src={illustration}
                            alt="Ilustración página no encontrada"
                            width={320}
                            height={320}
                            className="w-full h-full"
                            priority
                        />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="font-slab text-[28px] font-semibold leading-7 text-blue-500">
                            Esta página no existe
                        </h1>
                        <p className="py-4">
                            Es posible que el enlace no exista o se haya eliminado la página.
                        </p>
                        <Button
                            as={Link}
                            href={links.products}
                            color="primary"
                            className="w-full md:max-w-52 md:mx-auto"
                        >
                            Ir al inicio
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NotFound
