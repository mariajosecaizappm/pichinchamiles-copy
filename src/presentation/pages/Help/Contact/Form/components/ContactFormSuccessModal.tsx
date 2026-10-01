
import { Button } from "@/presentation/components/Form/components/Button";
import Modal from "@/presentation/components/Modal";
import SuccessIcon from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/SuccessIcon";
import { Divider } from "@heroui/react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const ContactFormSuccessModal = ({ isOpen, onOpenChange }: Props) => {
    return (
        <Modal
            onClose={() => onOpenChange(false)}
            headerButton={<></>}
            isOpen={isOpen}
            classNames={{
                wrapper: "!p-4 md:!p-6",
                base: "!m-auto !h-auto !max-h-[calc(100vh-4rem)] !w-[calc(100%-2rem)] !max-w-[456px] !rounded-xl overflow-hidden",
                body: "flex flex-col gap-0 !p-0",
            }}
        >
            <div className="flex flex-col items-center text-center p-6">
                <SuccessIcon />
                <h2 className="mt-4 text-[20px] text-blue-500 leading-6 font-semibold">
                    Envío de requerimiento exitoso
                </h2>
                <p className="mt-1 typo-main-body-book">
                    Uno de nuestros asesores se pondrá en contacto contigo dentro de las próximas 24 horas
                </p>
            </div>
            <div>
                <Divider />
                <div className="py-4 px-6">
                    <Button className="w-full" color="primary" onPress={() => onOpenChange(false)}>
                        Continuar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ContactFormSuccessModal
