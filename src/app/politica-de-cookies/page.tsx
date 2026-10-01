import type { Metadata } from "next"
import CookiesPoliciesPage from "@/presentation/pages/CookiesPolicies"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.politicaCookies

const Index = () => {
    return <CookiesPoliciesPage />
}

export default Index
