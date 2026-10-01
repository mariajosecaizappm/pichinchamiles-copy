import { Address } from "@/domain/entity/Address/structure/address";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import DeleteMemberAddressUseCase from "@/domain/interactors/Address/DeleteMemberAddressUseCase";
import UpdateMemberAddressUseCase from "@/domain/interactors/Address/UpdateMemberAddressUseCase";
import ConfirmationModal from "@/presentation/components/Modal/ConfirmationModal";
import SuccessAlertModal from "@/presentation/components/Modal/SuccessAlertModal";
import container from "@/presentation/config/inversify.config";
import useAddress from "@/presentation/hooks/useAddress";
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import Addresses from "./Addresses";

const AddressesContainer = () => {
    const { addresses, onEditAddress, isLoadingAddresses, onAddAddress, refetchAddresses } = useAddress({ fetchOnMount: true });
    const [isLoading, setIsLoading] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const updateMemberAddressUseCase = container.get<UpdateMemberAddressUseCase>(UseCaseTypes.UpdateMemberAddressUseCase);
    const deleteMemberAddressUseCase = container.get<DeleteMemberAddressUseCase>(UseCaseTypes.DeleteMemberAddressUseCase);

    const setDefaultAddress = async (address: Address) => {
        setIsLoading(true);
        await updateMemberAddressUseCase.updateMemberAddress({ ...address, default: true, });
        setIsLoading(false);
        await refetchAddresses();
    };

    const handleRequestDelete = (address: Address) => {
        setAddressToDelete(address);
    };

    const handleCancelDelete = () => {
        setAddressToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;

        setIsLoading(true);
        setAddressToDelete(null);
        try {
            await deleteMemberAddressUseCase.deleteMemberAddress(addressToDelete.id);
            await refetchAddresses();
            setShowDeleteSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingAddresses) {
        return <div className="body-container pt-3 pb-6 md:max-w-[888px]">
            <Skeleton className="w-full h-40 rounded-lg border border-darkGrayishBlue-100" />
        </div>;
    }

    return (
        <>
            <Addresses
                addresses={addresses}
                shippingAddress={addresses.find(addr => addr.default) || null}
                onSelectAddress={setDefaultAddress}
                onEditAddress={onEditAddress}
                onDeleteAddress={handleRequestDelete}
                isDisabled={isLoading}
                onAddAddress={onAddAddress}
                isLoadingAddresses={isLoadingAddresses}
            />
            <ConfirmationModal
                isOpen={addressToDelete !== null}
                title="Eliminar dirección"
                message="¿Quieres eliminar esta dirección registrada?"
                confirmLabel="Eliminar dirección"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <SuccessAlertModal
                isOpen={showDeleteSuccess}
                title="Dirección eliminada correctamente"
                description="La dirección se ha eliminado de manera exitosa"
                onContinue={() => setShowDeleteSuccess(false)}
            />
        </>
    )
}

export default AddressesContainer
