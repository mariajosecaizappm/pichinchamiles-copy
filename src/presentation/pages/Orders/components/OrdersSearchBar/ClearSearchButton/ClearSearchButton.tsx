import CloseIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon"
import colors from "@/presentation/style/colors"
import { Spinner } from "@heroui/react"

type Props = {
    onClear: () => void
    isClearing?: boolean
}

const ClearSearchButton = ({ onClear, isClearing = false }: Props) => {
    return (
        <button
            onClick={onClear}
            type="button" className="w-7 h-7 rounded-full hover:bg-darkGrayishBlue-200 cursor-pointer text-blue-500 flex items-center justify-center aspect-square">
            <span className="w-5 h-5 flex items-center justify-center">
                {
                    isClearing ? (
                        <Spinner
                            color={colors.blue[500] as unknown as "primary"}
                            size="sm"
                        />
                    ) : (
                        <CloseIcon className="w-3 h-3"/>
                    )
                }
            </span>
        </button>
    )
}

export default ClearSearchButton