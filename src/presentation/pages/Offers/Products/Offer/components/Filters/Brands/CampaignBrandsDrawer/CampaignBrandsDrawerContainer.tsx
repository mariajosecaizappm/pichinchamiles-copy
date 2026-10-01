import useProductsOfferContext from "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext";
import BrandsDrawerBaseContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawerBaseContainer";

const CampaignBrandsDrawerContainer = () => {
    const { brandIds } = useProductsOfferContext()
    return <BrandsDrawerBaseContainer brandIds={brandIds} />
};

export default CampaignBrandsDrawerContainer;