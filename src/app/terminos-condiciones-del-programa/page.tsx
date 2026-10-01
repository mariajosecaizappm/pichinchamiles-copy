import type { Metadata } from "next"
import TermsConditionsProgramPage from "@/presentation/pages/TermsConditionsProgram"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.terminosPrograma

const Index = () => {
    return <TermsConditionsProgramPage />
}

export default Index
