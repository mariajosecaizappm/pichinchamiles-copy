import { redirect } from "next/navigation";
import links from "@/presentation/config/links";

export default function UtiliceSusMillasPage() {
    redirect(links.products)
}
