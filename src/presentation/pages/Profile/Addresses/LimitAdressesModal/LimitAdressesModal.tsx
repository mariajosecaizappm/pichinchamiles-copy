import Modal from "@/presentation/components/Modal";
import Button from "@/presentation/pages/Home/components/Button";
import { Divider } from "@heroui/react";
import { useState } from "react";


type Props = {
    onClose?: () => void
}

const LimitAdressesModal = ({ onClose: onCloseProp }: Props = {}) => {
    const [isOpenState, setIsOpenState] = useState(true);
    const onClose = () => {
        setIsOpenState(false);
        onCloseProp?.();
    };
    return (
        <Modal
            placement="center"
            isOpen={isOpenState}
            onClose={onClose}
            title="Límite alcanzado"
            headerButton={<></>}
            classNames={{
                wrapper: "p-4!",
                base: "h-min rounded-lg!",
                body: "p-0 max-h-min"
            }}
        >
            <div>
                <div className="p-6 text-center space-y-2">
                    <h4 className="text-[22px] leading-7 text-blue-500 font-semibold">Límite alcanzado</h4>
                    <p className="font-medium leading-5 text-sm">
                        Ya tienes 10 direcciones registradas
                        (propias y de terceros).
                        <br />
                        Elimina una para poder agregar una nueva.
                    </p>
                </div>
                <div className="h-0.5 pb-px">
                    <Divider />
                </div>
                <div className="p-6 pt-4">
                    <Button color="primary" className="w-full" onPress={onClose}>Administrar direcciones</Button>
                </div>
            </div>
        </Modal>
    )
}

export default LimitAdressesModal