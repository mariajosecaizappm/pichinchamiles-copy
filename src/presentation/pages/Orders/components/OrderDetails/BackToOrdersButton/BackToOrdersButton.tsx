import Icon from "@/presentation/components/icons/Icon"

type Props = {
    onPressBack: () => void
}

const BackToOrdersButton = ({ onPressBack }: Props) => {
    return (
        <button className="inline-flex items-center gap-4 text-blue-500 cursor-pointer" onClick={onPressBack}>
            <span>
                <Icon name="icon-arrow-back-ios" size={24} />
            </span>
            <span className="leading-6 font-semibold text-sm">
                Regresar
            </span>
        </button>
    )
}

export default BackToOrdersButton