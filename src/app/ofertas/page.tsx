import links from "@/presentation/config/links"
import { redirect } from "next/navigation"

const Page = () => {
    redirect(`${links.offers}/${links.productsList}`)
}

export default Page