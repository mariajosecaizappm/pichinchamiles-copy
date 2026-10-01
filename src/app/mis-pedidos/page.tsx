import { decryptText } from "@/data/provider/crypto/actions";
import Orders from "@/presentation/pages/Orders"

type PageProps = {
    searchParams: Promise<{ orderNumber?: string; consumptions?: string, "pending-order"?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
    const { orderNumber, consumptions, "pending-order": pendingOrder } = await searchParams
    const decryptedConsumptions = consumptions ? await decryptText(consumptions) : undefined
    const decryptedPendingOrder = pendingOrder ? await decryptText(pendingOrder) : undefined
    
    return (
        <Orders orderNumber={orderNumber} consumptions={decryptedConsumptions} pendingOrder={decryptedPendingOrder} />
    )
}

export default Page