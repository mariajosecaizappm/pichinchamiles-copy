import type { Metadata } from "next"
import PrivacyPoliciesPage from "@/presentation/pages/PrivacyPolicies"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.politicasPrivacidad

const Index = () => {
    return <PrivacyPoliciesPage />
}

export default Index
