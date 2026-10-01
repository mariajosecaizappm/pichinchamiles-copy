import List from "@/presentation/components/List";
import { productsRedemption } from '../data/productsRedemption';

const ProductsRedemptionSection: React.FC = () => (
    <List items={productsRedemption} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
);

export default ProductsRedemptionSection;
