import Breadcrumb, { type BreadcrumbItemProps } from "@/presentation/components/Breadcrumb/Breadcrumb"
import clsx from "clsx"

type Props = {
    items: BreadcrumbItemProps[]
}

const ProductsBreadcrumbs = ({ items }: Props) => {
    return (
        <div
            className={clsx(
                "min-w-0 w-full overflow-x-auto",
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
        >
            <Breadcrumb items={items} currentItemClassName="[&>span]:text-blue-500 [&>span]:font-semibold" />
        </div>
    )
}

export default ProductsBreadcrumbs
