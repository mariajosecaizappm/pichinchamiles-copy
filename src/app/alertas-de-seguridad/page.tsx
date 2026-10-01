import type { Metadata } from "next"
import SecurityAlertsPage from "@/presentation/pages/SecurityAlerts"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.alertasSeguridad

const Index = () => {
    return <SecurityAlertsPage />
}

export default Index
