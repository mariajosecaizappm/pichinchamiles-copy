import React, {FC, useMemo, useState} from "react"
import { CalendarDate } from "@internationalized/date"
import { Checkbox } from "@/presentation/components/Form/components/Checkbox"
import Form from "@/presentation/components/Form/context/Form";
import {
    exportTransactionsFormSchema,
    ExportTransactionsFormValues,
    getExportInitialTransactionsFormValues, onExportTransactionsFormError,
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsFormConfig"
import { ExportTransactionsAlertHandler } from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/types";
import { FormDateRangePicker } from "@/presentation/components/Form/controls/FormDateRangePicker"
import FormButton from "@/presentation/components/Form/controls/FormButton";

type ExportTransactionsFormProps = {
    onExportTransactions: (values: ExportTransactionsFormValues) => Promise<void>
    alert: ExportTransactionsAlertHandler
}

const ExportTransactionsForm: FC<ExportTransactionsFormProps> = ({onExportTransactions, alert}) => {
    const [isExport, setIsExport] = useState(false)
    const maxExportDate = new CalendarDate(2024, 3, 1)
    const initialValues = useMemo(() => {
        return getExportInitialTransactionsFormValues()
    }, [])

    return (
        <div className="py-3 px-6 mx-[-24px] bg-neutral-50 md:bg-transparent md:p-4 md:mx-1 md:px-0">
            <Form
                initialValues={initialValues}
                schema={exportTransactionsFormSchema}
                onSubmit={onExportTransactions}
                onError={(error)=> onExportTransactionsFormError(error, alert)}
            >
                <Checkbox
                    id="exportTransactions"
                    testId="exportTransactions"
                    name="exportTransactions"
                    label={<span className="text-grayscale-500">Exportar transacciones</span>}
                    isSelected={isExport}
                    onValueChange={setIsExport}
                />
                {isExport && (
                    <div className="mt-3 md:max-w-[636px]">
                        <p className="typo-main-legal-medium text-grayscale-400 mb-3">
                            Transacciones disponibles hasta el 1 de marzo de 2024.
                        </p>
                        <div className="flex gap-3 flex-col md:flex-row">
                            <FormDateRangePicker
                                startName="startDate"
                                endName="endDate"
                                label="Rango de fechas para exportar"
                                aria-label="Selecciona el rango de fechas para exportar transacciones"
                                testId="exportTransactionsDateRangePicker"
                                maxValue={maxExportDate}
                            />
                            <FormButton testId="exportTransactionsButton" className="md:mt-6">
                                Descargar
                            </FormButton>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    )
}

export default ExportTransactionsForm
