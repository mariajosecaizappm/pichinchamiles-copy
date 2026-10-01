import { Button } from "@/presentation/components/Form/components/Button"

type Props = {
    close: () => void
}

const ErrorSnackbarFooter = ({ close }: Props) => {
    return (
        <div className="px-6 py-4">
            <Button color="primary" onPress={close}>
                Entendido
            </Button>
        </div>
    )
}

export default ErrorSnackbarFooter