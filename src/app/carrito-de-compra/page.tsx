import type { Metadata } from "next"
import ShoppingCartDetailContainer from "@/presentation/pages/ShoppingCartDetail"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.carrito

export default function ShoppingCartPage() {
    return <ShoppingCartDetailContainer />
}
