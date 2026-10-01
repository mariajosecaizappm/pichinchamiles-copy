import IconCart from '@/presentation/components/icons/IconCart';
import Link from "next/link";
import CartButtonBadge from './CartButtonBadge';
import links from "@/presentation/config/links";
import useSession from "@/presentation/hooks/useSession";

const CartButton = () => {
    const { isLogged } = useSession()

    if(!isLogged) {
        return null;
    }

    return (
        <CartButtonBadge>
            <Link
                href={links.checkout}
                aria-label="Carrito"
                className='cursor pointer bg-darkGrayishBlue-200 rounded-sm border border-darkGrayishBlue-300 p-2 flex gap-2.5 items-center lg:px-4 lg:py-2'
            >
                <IconCart className='w-4 h-4 lg:w-5 lg:h-5' />
                <span className='hidden lg:block text-sm font-semibold font-sans text-blue-500'>Carrito</span>
            </Link>
        </CartButtonBadge>
    )
}

export default CartButton