import links from "@/presentation/config/links"
import TabLinks, { TabLink } from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks"

const OffersNavbar = () => {

    const tabs: TabLink[] = [
        {
            id: "offers-products",
            label: "Productos",
            href: `${links.offers}${links.productsList}`
        },
        {
            id: "offers-travels",
            label: "Viajes y actividades",
            href: `${links.offers}${links.travelAndActivities}`
        }
    ]

    return (
        <div className="body-container pt-4 lg:p-4">
            <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-6">
                <div className="md:flex-1">
                    <h1 className="text-blue-500 text-3xl font-slab text-center lg:text-left">Ofertas</h1>
                </div>
                <div className="w-full p-4 lg:p-0 lg:max-w-[288px]">
                    <TabLinks tabs={tabs} />
                </div>
            </div>
        </div>
    )
}

export default OffersNavbar