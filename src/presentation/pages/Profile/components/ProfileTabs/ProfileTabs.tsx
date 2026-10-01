import links from "@/presentation/config/links"
import TabLinks, { TabLink } from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks"

const PROFILE_TAB_CLASS_NAMES = {
    active: "typo-main-caption-semi-bold text-blue-500 md:typo-main-body-semi-bold",
    inactive: "typo-main-caption-book hover:text-grayscale-700 md:typo-main-body-book",
} as const

const ProfileTabs = () => {
    const tabs: TabLink[] = [
        {
            id: "transacciones",
            label: "Historial de transacciones",
            href: links.myTransactions
        },
        {
            id: "profile",
            label: "Información personal",
            href: links.myInformation
        },
        {
            id: "addresses",
            label: "Direcciones",
            href: links.myAddresses
        },
        {
            id: "security",
            label: "Seguridad",
            href: links.mySecurity
        }
    ]
    return (
        <div className="pt-3 md:mb-4">
            <TabLinks
                tabs={tabs}
                className="w-full whitespace-nowrap overflow-x-auto body-container [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
                classNames={PROFILE_TAB_CLASS_NAMES}
            />
        </div>
    )
}

export default ProfileTabs