import { Button } from "@/presentation/components/Form/components/Button"

type Props = {
    close: () => void
    onGoToCart: () => void
}

const SuccessSnackbarFooter = ({ close, onGoToCart }: Props) => (
    <div className="px-6 py-4 flex flex-col lg:flex-row items-center gap-4">
        <Button
            className="border border-darkGrayishBlue-300 bg-darkGrayishBlue-200 text-blue-500"
            onPress={() => {
                close()
                onGoToCart()
            }}
        >
            Ver carrito
        </Button>
        <Button color="primary" onPress={close}>
            Seguir comprando
        </Button>
    </div>
)

export default SuccessSnackbarFooter
