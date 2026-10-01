"use client";

import { usePathname } from "next/navigation";
import links from "@/presentation/config/links";
import HomeTabsProductsContainer from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts";
import ActivitiesCategories from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/categories";


export function RightPanel() {
    const pathname = usePathname();
 
    if (pathname.startsWith(links.products)) return <HomeTabsProductsContainer  />;
    if (pathname.startsWith(links.travelAndActivities)) return <ActivitiesCategories/>
    return null;
}
