import loginModalFrame from "@/presentation/assets/login-modal-frame.avif";
import exploreFrame from "@/presentation/assets/explore-frame.avif";
import cartFrame from "@/presentation/assets/cart-frame.avif";

export type ExchangeStep = {
    title: string;
    description: string;
    image: string;
    step: number;
};

export const EXCHANGE_STEPS: ExchangeStep[] = [
    {
        step: 1,
        title: "Accede con tu identificación",
        description:
            "Ingresa con tu número de identificación. Si es tu primera vez, crea una contraseña.",
        image: loginModalFrame.src,
    },
    {
        step: 2,
        title: "Explora y elige tu recompensa",
        description:
            "Descubre las opciones disponibles y elige la que más te guste.",
        image: exploreFrame.src,
    },
    {
        step: 3,
        title: "Canjea y disfruta",
        description:
            "Confirma tu canje y recibe los detalles para aprovechar tu beneficio.",
        image: cartFrame.src,
    },
];