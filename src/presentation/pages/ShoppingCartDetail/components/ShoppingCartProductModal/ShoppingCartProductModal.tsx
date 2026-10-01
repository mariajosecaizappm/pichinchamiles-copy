"use client";

import Modal from "@/presentation/components/Modal/Modal";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import ModalAlertIcon from "@/presentation/components/icons/ModalAlertIcon";
import ModalInfoIcon from "@/presentation/components/icons/ModalInfoIcon";
import { ShoppingCartBasketState } from "../../hooks/useShoppingCartBasket";
import ShoppingCartProductModalContent from "./ShoppingCartProductModalContent";

const MODAL_ICON_CLASS_NAME = "size-16";

const modalContentConfig = {
    stock: {
        title: "Actualización de stock",
        description:
            "Los siguientes productos no están disponibles debido a la falta de stock.",
        icon: <ModalInfoIcon className={MODAL_ICON_CLASS_NAME} />,
    },
    price: {
        title: "Actualización de precio",
        description: "Los siguientes productos han sido actualizados con un nuevo precio.",
        icon: <ModalInfoIcon className={MODAL_ICON_CLASS_NAME} />,
    },
    disabled: {
        title: "Producto desactivado",
        description:
            "Los siguientes productos se encuentran desactivados porque ya no tiene stock.",
        icon: <ModalAlertIcon className={MODAL_ICON_CLASS_NAME} />,
    },
} as const;

const getModalContent = (
    changedStockProducts: BasketItem[],
    changedPriceProducts: BasketItem[],
    disabledProducts: BasketItem[]
) => {
    if (changedStockProducts.length > 0) {
        return { ...modalContentConfig.stock, basketItems: changedStockProducts };
    }
    if (changedPriceProducts.length > 0) {
        return { ...modalContentConfig.price, basketItems: changedPriceProducts };
    }
    if (disabledProducts.length > 0) {
        return { ...modalContentConfig.disabled, basketItems: disabledProducts };
    }
    return null;
};

type ShoppingCartProductModalProps = {
    basketState: ShoppingCartBasketState;
};

const ShoppingCartProductModal = ({ basketState }: ShoppingCartProductModalProps) => {
    const { changedBasketItems, clearChangedBasketItems } = basketState;

    if (!changedBasketItems) {
        return null;
    }

    const { disabledProducts, changedPriceProducts, changedStockProducts } = changedBasketItems;
    const modalContent = getModalContent(
        changedStockProducts,
        changedPriceProducts,
        disabledProducts
    );

    if (!modalContent) {
        return null;
    }

    return (
        <Modal
            isOpen
            onClose={clearChangedBasketItems}
            placement="center"
            classNames={{
                base: "!m-4 w-full max-w-[375px] !h-auto !max-h-[calc(100vh-2rem)] !rounded-lg",
                body: "p-0",
                header: "hidden",
            }}
        >
            <ShoppingCartProductModalContent
                title={modalContent.title}
                description={modalContent.description}
                icon={modalContent.icon}
                basketItems={modalContent.basketItems}
                onUpdateShoppingCart={clearChangedBasketItems}
            />
        </Modal>
    );
};

export default ShoppingCartProductModal;
