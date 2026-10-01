import React, { useContext } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import { VariationCopayment } from "@/domain/entity/Product/variation";
import Alert from "@/presentation/components/Alert";
import { formatMiles, formatCopaymentAmount } from "@/presentation/helpers/quantities";
import useSession from "@/presentation/hooks/useSession";
import CopaymentCounter from "./CopaymentCounter";
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import {EventName} from "@/presentation/analytics/types";

type Props = {
    productUnitPoinsPrice: number;
    productUnitPrice: number;
    copayment: VariationCopayment;
}

const CopaymentSection = (props: Props) => {
    const { values } = useContext(FormContext)
    const { isLogged } = useSession()
    const { rootCategory } = useProductDetailsContext()
    const points = values.points as number | undefined
    const coins = values.coins as number | undefined

    return (
        <div className="space-y-2">
            {rootCategory && <MountTracker name={EventName.VIEWED_COPAYMENT} payload={{category: rootCategory}}/>}
            <p className="text-blue-500 font-semibold">Elige la opción que mejor se adapte a ti</p>
            {!isLogged && (
                <Alert
                    title="Información"
                    variant="info"
                    icon="ic:round-info"
                    contentClassName="flex-1"
                >
                    <p>
                        Puedes explorar las combinaciones de millas y dólares. Para confirmar tu canje con tarjeta de crédito debes{" "}
                        <span className="font-bold">iniciar sesión</span>.
                    </p>
                </Alert>
            )}
            <div className="flex items-center gap-2 py-1 px-4 justify-between">
                <span className="text-sm font-bold leading-4">Millas a usar</span>
                <CopaymentCounter {...props} type={CurrencyType.POINTS} />
            </div>
            <div className="flex items-center gap-2 py-1 px-4 justify-between">
                <span className="text-sm font-bold leading-4">Dólares a usar</span>
                <CopaymentCounter {...props} type={CurrencyType.COINS} />
            </div>
            {points !== undefined && coins !== undefined && points !== null && coins !== null && (
                <div className="flex items-center gap-2 py-3 px-4 justify-between bg-blue-500 text-white rounded-sm">
                    <span className="font-semibold leading-6">Total</span>
                    <span className="font-semibold leading-6">
                        {formatMiles(points)} Millas + ${formatCopaymentAmount(coins)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default CopaymentSection;
