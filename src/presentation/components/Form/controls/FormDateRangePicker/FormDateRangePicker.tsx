import React, { useContext, useState } from "react"
import { getIn } from "formik"
import { CalendarDate } from "@internationalized/date"
import type { DateValue, RangeValue } from "@heroui/react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { DateRangePicker, DateRangePickerProps } from "../../components/DateRangePicker"

type FormDateRangePickerProps = {
    startName: string
    endName: string
} & Omit<DateRangePickerProps, "value" | "onChange">

const toCalendarDate = (date: Date | null | undefined): CalendarDate | null => {
    if (!date) return null
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

const toJsDate = (val: DateValue | null | undefined): Date | null => {
    if (!val) return null
    return new Date(val.year, val.month - 1, val.day)
}

const FormDateRangePicker: React.FC<FormDateRangePickerProps> = ({ startName, endName, ...rest }) => {
    const { values, errors, submitCount, setFieldValue, onBlur, validateForm } = useContext(FormContext)
    const [liveMessage, setLiveMessage] = useState('')

    const startRaw = getIn(values, startName) as Date | null | undefined
    const endRaw = getIn(values, endName) as Date | null | undefined
    const startError = getIn(errors, startName) as string | undefined
    const endError = getIn(errors, endName) as string | undefined

    const error = startError ?? endError
    const hasValue = startRaw != null || endRaw != null

    const startCalendar = toCalendarDate(startRaw)
    const endCalendar = toCalendarDate(endRaw)

    const rangeValue: RangeValue<DateValue> | null =
        startCalendar && endCalendar ? { start: startCalendar, end: endCalendar } : null

    const formatDate = (val: DateValue) =>
        new Date(val.year, val.month - 1, val.day).toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const handleChange = (range: RangeValue<DateValue> | null) => {
        setFieldValue(startName, toJsDate(range?.start ?? null), true);
        setFieldValue(endName, toJsDate(range?.end ?? null), true);
        requestAnimationFrame(() => validateForm());
        if (range?.start && range?.end) {
            setLiveMessage(`Rango seleccionado: desde ${formatDate(range.start)} hasta ${formatDate(range.end)}`)
        } else if (range?.start) {
            setLiveMessage(`Fecha de salida seleccionada: ${formatDate(range.start)}`)
        } else {
            setLiveMessage('')
        }
    }

    return (
        <>
            <DateRangePicker
                {...rest}
                value={rangeValue}
                onChange={handleChange}
                isClearable
                isInvalid={!!((hasValue || submitCount > 0) && error)}
                errorMessage={(hasValue || submitCount > 0) ? error : undefined}
                onBlur={onBlur}
            />
            <output aria-live="polite" className="sr-only">{liveMessage}</output>
        </>
    )
}

export default FormDateRangePicker
