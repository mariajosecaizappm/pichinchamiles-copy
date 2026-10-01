import type { Metadata } from "next"
import pageMetadata from "@/presentation/config/metadata"
import Home from "@/presentation/pages/Home/Home"

export const metadata: Metadata = pageMetadata.home

export const revalidate = 60

export default function Index() {
    return <Home />
}


