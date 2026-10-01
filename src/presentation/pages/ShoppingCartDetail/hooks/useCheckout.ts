import {useContext} from "react";
import CheckoutContext from "@/presentation/pages/ShoppingCartDetail/context/CheckoutContext";

const useCheckout = () => {
    return useContext(CheckoutContext);
};

export default useCheckout;
