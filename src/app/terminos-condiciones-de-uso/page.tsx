import type { Metadata } from "next"
import TermsConditionsUse from "@/presentation/pages/TermsConditionsUse"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.terminosUso

const Index = () => {
    return <TermsConditionsUse />
}

export default Index
