"use client";

import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar";
import useSession from "@/presentation/hooks/useSession";

const MobileStickyProductSearchBar = () => {
    const { isLogged } = useSession();

    return (
        <div className={`sticky z-30 bg-white lg:hidden ${isLogged ? "top-[97px]" : "top-[61px]"}`}>
            <div className="w-full max-w-330 px-4 mx-auto">
                <ProductSearchBar/>
            </div>
        </div>
    );
};

export default MobileStickyProductSearchBar;
