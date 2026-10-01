"use client";

import { useModal } from "@/presentation/components/Modal";
import ShoppingCartStatusModal from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal";
import { OpenShoppingCartStatusModalParams } from "@/presentation/pages/ShoppingCartDetail/types";

const SHOPPING_CART_STATUS_MODAL_ID = "shoppingCartStatusModal";

const useShoppingCartStatusModal = () => {
    const { isOpen, openModal, closeAllModals } = useModal(SHOPPING_CART_STATUS_MODAL_ID);

    const openShoppingCartStatusModal = (props: OpenShoppingCartStatusModalParams) => {
        openModal(ShoppingCartStatusModal, props, SHOPPING_CART_STATUS_MODAL_ID);
    };

    const closeShoppingCartStatusModal = () => {
        closeAllModals()
    };

    return {
        isShoppingCartStatusModalOpen: isOpen,
        openShoppingCartStatusModal,
        closeShoppingCartStatusModal,
    };
};

export default useShoppingCartStatusModal;
