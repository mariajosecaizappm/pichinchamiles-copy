"use client"

import TabLinks, { TabLink } from "./components/TabLinks";
import links from "@/presentation/config/links";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

const HomeTabs = () => {
    const { track } = useAnalytics();
    const tabsConfig: TabLink[] = [
        {
            id: "products",
            label: "Productos",
            href: links.products
        },
        {
            id: "travels",
            label: "Viajes y actividades",
            href: `${links.useYourMiles}${links.travelAndActivities}`
        }
    ];
    const handleTabClick = (tabId: string) => {
        if(tabId === tabsConfig[0].id) {
            track(EventName.CLICKED_REDEMPTION, {tab: tabId});
        }
    }

    return (
        <TabLinks onTabClick={handleTabClick} tabs={tabsConfig} />
    );
};

export default HomeTabs;
