import { Spinner } from "@heroui/spinner"

type ValidateBeneficiaryButtonProps = {
    disabled: boolean
    isLoading?: boolean
}

const ValidateBeneficiaryButton = ({ disabled, isLoading }: ValidateBeneficiaryButtonProps) => {
    if (isLoading) {
        return (
            <span
                className="flex h-6 w-6 items-center justify-center"
                data-testid="validateBeneficiaryLoading"
                aria-busy="true"
                aria-label="Validando documento del beneficiario"
            >
                <Spinner
                    size="sm"
                    variant="simple"
                    classNames={{
                        wrapper: "text-information-500",
                    }}
                />
            </span>
        )
    }

    return (
        <button
            type="submit"
            disabled={disabled}
            className="cursor-pointer border-none bg-transparent text-sm font-semibold leading-6 text-information-500 transition-colors hover:text-information-600 disabled:cursor-not-allowed disabled:text-information-500/30"
            data-testid="validateBeneficiary"
            aria-label="Validar documento del beneficiario"
        >
            Validar
        </button>
    )
}

export default ValidateBeneficiaryButton
