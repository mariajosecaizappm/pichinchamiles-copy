import illustration from "@/presentation/assets/empty-orders.svg";
import { Button } from "@/presentation/components/Form/components/Button";
import links from "@/presentation/config/links";
import Image from "next/image";
import Link from "next/link";

const EmptyOrders = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 text-blue-500 p-4 rounded-lg border border-information-100 h-min">
            <section className="flex items-center justify-center">
                <figure className="w-60 h-60 aspect-square flex items-center justify-center">
                    <Image
                        src={illustration}
                        alt="Ilustración historial de pedidos vacío"
                        width={240}
                        height={240}
                        className="w-full h-full"
                        priority
                    />
                </figure>
            </section>
            <p className="text-[18px] text-center font-medium">
                Tus próximos beneficios te esperan. Realiza tu primer pedido cuando quieras.
            </p>
            <Button color="primary" as={Link} href={links.productsList} className="max-w-44 mx-auto">
                Ver catálogo
            </Button>
        </div>
    )
}

export default EmptyOrders