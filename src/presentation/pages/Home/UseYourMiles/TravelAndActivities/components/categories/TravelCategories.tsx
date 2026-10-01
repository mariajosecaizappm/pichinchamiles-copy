"use client"

import links from "@/presentation/config/links";
import CarouselCategories from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/CarouselCategories";
import CategoryPill from "../../../Layout/components/CategoryPill";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import IconTravel from "@/presentation/components/icons/IconTravel";
import IconBed from "@/presentation/components/icons/IconBed";
import IconCar from "@/presentation/components/icons/IconCar";
import IconSwim from "@/presentation/components/icons/IconSwim";
import IconVacation from "@/presentation/components/icons/IconVacation";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import { getActiveTabIndex } from "./TravelCategoriesConfig";

const TravelCategories = () => {
    const pathName = usePathname();
    const isFlightsActive = pathName === links.flights || pathName === links.travelAndActivities;
    const isHotelsActive = pathName.startsWith(links.hotels);
    const isCarsActive = pathName.startsWith(links.carRental);
    const isActivitiesActive = pathName.startsWith(links.activities);
    const isDisneyActive = pathName.startsWith(links.disney);
    const { track } = useAnalytics();
    const handleClickPill = (pillId: string) => track(EventName.CLICKED_REDEMPTION, {tab: pillId});

    const items = useMemo(() => [
        {
            id: "flights",
            content: (
                <CategoryPill
                    key="flights"
                    onClick={()=> handleClickPill("flights")}
                    label="Vuelos"
                    href={links.flights}
                    icon={<IconTravel />}
                    active={isFlightsActive}
                    role="tab"
                    ariaSelected={isFlightsActive}
                    ariaLabel={`Categoría vuelos, ${isFlightsActive ? 'seleccionado' : 'no seleccionado'}`}
                />
            )
        }, {
            id: "hotels",
            content: (
                <CategoryPill
                    active={isHotelsActive}
                    key="hotels"
                    onClick={()=> handleClickPill("hotels")}
                    label="Hoteles"
                    href={links.hotels}
                    icon={<IconBed />}
                    role="tab"
                    ariaSelected={isHotelsActive}
                    ariaLabel={`Categoría hoteles, ${isHotelsActive ? 'seleccionado' : 'no seleccionado'}`}
                />
            )
        },
        {
            id: "cars",
            content: (
                <CategoryPill
                    active={isCarsActive}
                    key="cars"
                    onClick={()=> handleClickPill("cars")}
                    label="Autos"
                    href={links.carRental}
                    icon={<IconCar />}
                    role="tab"
                    ariaSelected={isCarsActive}
                    ariaLabel={`Categoría autos, ${isCarsActive ? 'seleccionado' : 'no seleccionado'}`}
                />
            )
        },
        {
            id: "activities",
            content: (
                <CategoryPill
                    active={isActivitiesActive}
                    key="activities"
                    onClick={()=> handleClickPill("activities")}
                    label="Actividades"
                    href={links.activities}
                    icon={<IconSwim />}
                    role="tab"
                    ariaSelected={isActivitiesActive}
                    ariaLabel={`Categoría actividades, ${isActivitiesActive ? 'seleccionado' : 'no seleccionado'}`}
                />
            )
        }, {
            id: "disney",
            content: (
                <CategoryPill
                    active={isDisneyActive}
                    key="disney"
                    onClick={()=> handleClickPill("disney")}
                    label="Disney"
                    href={links.disney}
                    icon={<IconVacation />}
                    role="tab"
                    ariaSelected={isDisneyActive}
                    ariaLabel={`Categoría disney, ${isDisneyActive ? 'seleccionado' : 'no seleccionado'}`}
                />
            )
        }
    ], [isActivitiesActive, isCarsActive, isDisneyActive, isFlightsActive, isHotelsActive])

    const activeIndex = getActiveTabIndex(isFlightsActive, isHotelsActive, isCarsActive, isActivitiesActive, isDisneyActive);

    return (
        <div
            className="text-blue-500 flex justify-center w-full"
            role="tablist"
            aria-label="Categorías de viaje"
        >
            <CarouselCategories
                showArrows={false}
                items={items.map(item => item.content)}
                activeItemIndex={activeIndex}
                ariaLabel={`Carrusel de categorías de viajes: El carrusel incluye las ${items.length} categorías de viajes.`}
                itemClassName='grid place-items-center'
                scrollContainerClassName="lg:max-w-full"
            />
        </div>

    );
};

export default TravelCategories;
