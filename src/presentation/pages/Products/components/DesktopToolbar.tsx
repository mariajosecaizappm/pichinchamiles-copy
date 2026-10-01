import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar"
import OrderBySelect from "./ProductsFilters/DesktopFilters/OrderBy"

const DesktopToolbar = () => (
    <div className="hidden lg:flex gap-3">
        <div className="flex-1 w-full">
            <ProductSearchBar />
        </div>
        <div className="w-full max-w-47">
            <OrderBySelect />
        </div>
    </div>
)

export default DesktopToolbar
