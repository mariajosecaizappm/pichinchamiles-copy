import Link from "next/link";
import Button from "@/presentation/components/Form/components/Button/Button";
import IconEmptyCart from "@/presentation/components/icons/IconEmptyCart";
import ShoppingCartRecommendedProducts from "./ShoppingCartRecommendedProducts";
import links from "@/presentation/config/links";

const EmptyShoppingCart = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="flex min-h-[335px] w-full items-center justify-center rounded-lg border border-grayscale-100 bg-white">
                <div className="flex w-full max-w-[408px] flex-col items-center gap-4 px-6 text-center">
                    <div className="flex size-24 items-center justify-center rounded-lg bg-white p-2">
                        <div className="flex size-20 items-center justify-center rounded-full bg-darkGrayishBlue-100 p-2">
                            <IconEmptyCart className="h-[47px] w-[54px]" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold leading-6 text-blue-500">
                            Carrito vacío
                        </h2>
                        <p className="text-base font-normal leading-6 text-grayscale-500">
                            Aún no tienes productos agregados a tu carrito. Revisa las recomendaciones
                            que tenemos para ti en Pichincha Miles.
                        </p>
                    </div>
                    <Link href={links.productsList} className="w-full max-w-[360px] pt-2">
                        <Button color="primary" className="h-12">
                            Ir al catálogo de productos
                        </Button>
                    </Link>
                </div>
            </section>
            <ShoppingCartRecommendedProducts />
        </div>
    );
};

export default EmptyShoppingCart;
