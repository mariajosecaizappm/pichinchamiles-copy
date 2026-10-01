"use client"

import { Spinner } from "@heroui/spinner"
import Form from "@/presentation/components/Form/context/Form"
import FormInput from "@/presentation/components/Form/controls/FormInput"
import FormButton from "@/presentation/components/Form/controls/FormButton"
import { Button } from "@/presentation/components/Form/components/Button"
import { ObjectSchema } from "yup"
import {
    createTransferMilesAmountSchema,
    digitsOnlyRegExp,
    TransferMilesAmountFormValues,
    transferMilesAmountFormInitialValues,
} from "../../TransferMilesFormConfig"

type TransferMilesActionsProps = {
    isTransferEnabled: boolean
    isTransferLoading?: boolean
    balance: number
    miles: string
    onMilesChange: (miles: string) => void
    onTransfer: (miles: string) => void
}

const TransferLoadingButton = () => (
    <Button
        type="button"
        className="h-10 w-full"
        color="primary"
        isDisabled
        testId="transferMilesSubmit"
        aria-busy="true"
        aria-label="Procesando transferencia"
    >
        <span className="flex h-6 w-6 items-center justify-center">
            <Spinner
                size="sm"
                variant="simple"
                classNames={{
                    wrapper: "text-blue-500",
                }}
            />
        </span>
    </Button>
)

const TransferMilesActions = ({
    isTransferEnabled,
    isTransferLoading = false,
    balance,
    miles,
    onMilesChange,
    onTransfer,
}: TransferMilesActionsProps) => {
    if (!isTransferEnabled) {
        return (
            <div className="flex flex-col gap-4">
                {isTransferLoading ? (
                    <TransferLoadingButton />
                ) : (
                    <Button
                        type="button"
                        className="h-10 w-full"
                        color="primary"
                        isDisabled
                        testId="transferMilesSubmit"
                        aria-label="Transferir millas"
                    >
                        Transferir
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Form<TransferMilesAmountFormValues>
            initialValues={{
                ...transferMilesAmountFormInitialValues,
                miles,
            }}
            schema={
                createTransferMilesAmountSchema(balance) as unknown as ObjectSchema<TransferMilesAmountFormValues>
            }
            validateOnChange
            onSubmit={async (values) => {
                onTransfer(values.miles)
            }}
            className="flex flex-col gap-4"
            ariaLabel="Formulario de transferencia de millas"
        >
            <FormInput
                label="Millas a transferir"
                name="miles"
                placeholder="Ej. 18000"
                inputMode="numeric"
                regExp={digitsOnlyRegExp}
                onValueChange={onMilesChange}
                testId="transferMilesAmount"
                aria-label="Millas a transferir"
                isDisabled={isTransferLoading}
            />
            {isTransferLoading ? (
                <TransferLoadingButton />
            ) : (
                <FormButton
                    className="h-10 w-full"
                    testId="transferMilesSubmit"
                    aria-label="Transferir millas"
                >
                    Transferir
                </FormButton>
            )}
        </Form>
    )
}

export default TransferMilesActions
