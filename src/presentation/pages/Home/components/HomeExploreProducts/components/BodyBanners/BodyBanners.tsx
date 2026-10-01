"use client"


import { Banner } from "@/domain/entity/Banner/banner";
import MarketingBanners from "../../../../UseYourMiles/Products/Banners/MarketingBanners";

const BodyBanners = ({
    banners
}: {
    banners: Banner[]
}) => {
    return (
        <div className="py-6 px-6 lg:px-11.75 w-full">
            <div className=" lg:max-w-[1272px]  mx-auto">
                <MarketingBanners banners={banners} />
            </div>
        </div>
    )
};

export default BodyBanners;