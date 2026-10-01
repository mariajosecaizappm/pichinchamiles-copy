"use client"

import React, { useContext } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import Alert from "@/presentation/components/Alert";
import { formatMiles } from "@/presentation/helpers/quantities";
import useSession from "@/presentation/hooks/useSession";
import { useProductDetailsContext } from "../context/useProductDetailsContext";
import { isMaxStockAlreadyInCart } from "@/presentation/helpers/product";
import { COPAYMENT_PERCENTAGE } from "./ProductForm/ProductFormConfig";

const PaymentAlerts = () => {
    const { isLogged, balance, basket } = useSession();
    const { values } = useContext(FormContext)
    const {
        pointsPrice,
        minCopaymentPoints,
        variation,
    } = useProductDetailsContext();

    const paymentMethod = values.paymentType as PaymentMethod
    const quantity = (values.quantity as number) || 1
    const calculatedMinCopaymentPoints = minCopaymentPoints * quantity;

    const userBalance = balance ?? 0;
    const totalPointsNeeded = pointsPrice * quantity;

    if (isMaxStockAlreadyInCart(basket, variation)) {
        return (
            <Alert variant="warning" className="w-full">
                ¡Ya lo tienes en tu carrito! Es la <span className="font-bold">última</span> unidad disponible.
            </Alert>
        );
    }

    if (!isLogged) return null;

    if (paymentMethod === PaymentMethod.POINTS) {
        if (userBalance < totalPointsNeeded) {
            if (userBalance >= calculatedMinCopaymentPoints && calculatedMinCopaymentPoints > 0) {
                return (
                    <Alert variant="info" icon="ic:round-info" className="w-full">
                        Debido a la cantidad de millas en tu cuenta, necesitarás usar la opción de pago con millas + tarjeta de crédito para completar el canje.
                    </Alert>
                );
            } else {
                const missingMiles = totalPointsNeeded - userBalance;
                return (
                    <Alert variant="warning" className="w-full">
                        Te faltan <span className="font-bold">{formatMiles(missingMiles)} millas</span>. Sigue acumulando millas para poder canjear o puedes hacerlo a través de copago, millas + tarjeta de crédito.
                    </Alert>
                );
            }
        }
    } else if (paymentMethod === PaymentMethod.COPAYMENT) {
        if (userBalance < calculatedMinCopaymentPoints) {
            return (
                <Alert variant="warning" className="w-full">
                    Lo sentimos, no tienes suficientes millas para realizar el canje. Necesitas al menos el <span className="font-bold">{COPAYMENT_PERCENTAGE}% de tu compra en millas</span> para usar la opción Pago con millas + tarjeta de crédito.
                </Alert>
            );
        }
    }

    return null;
};

export default PaymentAlerts;
