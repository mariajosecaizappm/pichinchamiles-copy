import type { Metadata } from "next"
import pageMetadata from "@/presentation/config/metadata"
import dynamic from "next/dynamic";
import OffersSkeleton from "@/presentation/pages/Offers/components/skeletons/OffersSkeleton";

export const metadata: Metadata = pageMetadata.ofertasViajesYActividades
const ActivityOffers = dynamic(()=> import("@/presentation/pages/Offers/Activities"), {
    ssr: true,
    loading: OffersSkeleton
})

const Page = () => {
    return <ActivityOffers />
}

export default Page