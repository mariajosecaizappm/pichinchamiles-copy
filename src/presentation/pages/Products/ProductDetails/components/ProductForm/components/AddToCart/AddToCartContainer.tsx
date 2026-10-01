import { PaymentMethod } from "@/domain/entity/Payment/payment";
import FormContext from "@/presentation/components/Form/context/FormContext";
import useSession from "@/presentation/hooks/useSession";
import { useContext } from "react";
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext";
import { isMaxStockAlreadyInCart } from "@/presentation/helpers/product";
import AddToCart from "./AddToCart";

const AddToCartContainer = (props: React.ComponentProps<typeof AddToCart>) => {
    const { isValidatingSession, isLogged, balance, basket } = useSession()
    const { values } = useContext(FormContext)
    const {
        pointsPrice,
        minCopaymentPoints,
        variation,
    } = useProductDetailsContext();

    const paymentMethod = values.paymentType as PaymentMethod
    const quantity = (values.quantity as number) || 1

    const userBalance = balance ?? 0;
    const totalPointsNeeded = pointsPrice * quantity;

    const isButtonDisabled = (): boolean => {
        if (isValidatingSession) return true;
        if (isMaxStockAlreadyInCart(basket, variation)) return true;
        if (!isLogged) return false;
        if (!variation) return true;

        if (
            paymentMethod === PaymentMethod.POINTS &&
            userBalance < totalPointsNeeded
        ) {
            return true;
        }

        return userBalance < (minCopaymentPoints * quantity);
    };
    return <AddToCart
        {...props}
        isDisabled={isButtonDisabled()}
    />
}

export default AddToCartContainer