import HomeExploreProductsBanner from "@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel";
import BodyBanners from "@/presentation/pages/Home/components/HomeExploreProducts/components/BodyBanners";
import NewItemsForYou from "@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou";
import Offers from "@/presentation/pages/Home/components/HomeExploreProducts/components/Offers";

const HomeProducts = () => {
    return (
        <>
            <HomeExploreProductsBanner/>
            <NewItemsForYou/>
            <Offers/>
            <BodyBanners/>
        </>
    );
};

export default HomeProducts;