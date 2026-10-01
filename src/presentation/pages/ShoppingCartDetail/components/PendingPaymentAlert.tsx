import Alert from "@/presentation/components/Alert/Alert";

type Props = {
    pendingReference: string;
};

const PendingPaymentAlert = ({ pendingReference }: Props) => {
    if (!pendingReference) return null;

    return (
        <Alert variant="warning">
            Tu pago con referencia <strong>No. {pendingReference}</strong> se encuentra pendiente
        </Alert>
    );
};

export default PendingPaymentAlert;
