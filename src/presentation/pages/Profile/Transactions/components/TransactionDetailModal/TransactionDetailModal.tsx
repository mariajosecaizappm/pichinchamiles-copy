import React, {useContext} from 'react';
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import Modal from "@/presentation/components/Modal";
import Icon from "@/presentation/components/icons/Icon";
import TransactionDetailModalContent
    from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalContent";

const TransactionDetailModal = () => {
    const { transaction, clearTransaction } = useContext(TransactionsContext);
    const { isDesktop } = useIsDesktop();

    if(!transaction) return null;

    return isDesktop ? (
        <div className="w-full h-fit sticky top-[calc(var(--header-height)+16px)] md:mt-[53px]">
            <TransactionDetailModalContent transaction={transaction}/>
        </div>
    ) : (
        <Modal
            isOpen={!!transaction}
            onClose={(isOpen) => {
                if (!isOpen) clearTransaction();
            }}
            scrollBehavior="inside"
            hideCloseButton
            closeButtonAriaLabel="Regresar al listado de transacciones"
            headerButton={
                <div className="relative flex items-center justify-center w-full">
                    <button
                        type="button"
                        onClick={clearTransaction}
                        aria-label="Regresar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-0 text-blue-500"
                    >
                        <Icon name="icon-back" />
                    </button>
                    <span className="typo-main-subtitle-semi-bold text-blue-500">
                        Detalle de canje
                    </span>
                </div>
            }
            classNames={{
                wrapper: "z-80",
                backdrop: "bg-white z-70",
                base: "bg-neutral-50",
                header: "bg-white",
                body: "!p-6 bg-neutral-50 overflow-y-auto"
            }}
        >
            <TransactionDetailModalContent transaction={transaction}/>
        </Modal>
    )
};

export default TransactionDetailModal;
