import links from "@/presentation/config/links"
import { redirect } from "next/navigation"


const Page = () => {
    redirect(links.myTransactions)
}

export default Page