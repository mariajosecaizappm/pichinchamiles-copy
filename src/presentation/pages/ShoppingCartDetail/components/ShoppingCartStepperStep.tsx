"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import Icon from "@/presentation/components/icons/Icon";

type ShoppingCartStepperStepProps = {
    stepId: number;
    icon: ReactNode;
    isActive: boolean;
    isCompleted: boolean;
};

const ShoppingCartStepperStep = ({
    stepId,
    icon,
    isActive,
    isCompleted,
}: ShoppingCartStepperStepProps) => {
    return (
        <li className="flex lg:w-[90px] flex-col items-center">
            <span
                className={clsx(
                    "flex items-center justify-center rounded-full p-3",
                    "size-10 lg:size-[60px]",
                    isCompleted && "bg-success-500 text-white",
                    isActive && !isCompleted && "bg-blue-500 text-white",
                    !isActive && !isCompleted && "border-2 border-grayscale-400 bg-white text-grayscale-400"
                )}
            >
                {isCompleted ? (
                    <Icon
                        name="icon-check"
                        width={26}
                        height={20}
                        color="white"
                        aria-hidden
                    />
                ) : (
                    icon
                )}
            </span>
            <span
                className={clsx(
                    "mt-3 hidden text-center text-sm leading-5 lg:block",
                    isActive ? "text-blue-500" : "text-grayscale-400"
                )}
            >
                {stepId === 1 && "Carrito de compras"}
                {stepId === 2 && (
                    <>
                        Dirección
                        <br />
                        de envío
                    </>
                )}
                {stepId === 3 && "Datos de facturación"}
                {stepId === 4 && "Confirmación de pedido"}
            </span>
        </li>
    );
};

export default ShoppingCartStepperStep;
