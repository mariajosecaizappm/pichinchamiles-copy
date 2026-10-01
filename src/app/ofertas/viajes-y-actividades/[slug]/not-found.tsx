import type { Metadata } from "next"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.notFound

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <h1 className="text-2xl font-bold text-blue-500">Oferta no encontrada</h1>
        </div>
    )
}

export default NotFoundPage
