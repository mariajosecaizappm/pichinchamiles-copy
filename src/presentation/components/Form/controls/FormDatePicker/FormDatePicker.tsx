import React, { useContext } from "react"
import { getIn } from "formik"
import { CalendarDate, CalendarDateTime } from "@internationalized/date"
import type { DateValue } from "@heroui/react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { DatePicker, DatePickerProps } from "../../components/DatePicker"

type FormDatePickerProps = {
    name: string
} & Omit<DatePickerProps, "value" | "onChange">

const toCalendarValue = (
    date: Date | null | undefined,
    granularity: DatePickerProps["granularity"]
): CalendarDate | CalendarDateTime | null => {
    if (!date) return null
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    if (granularity && granularity !== "day") {
        return new CalendarDateTime(
            y, m, d,
            date.getHours(),
            date.getMinutes(),
            granularity === "second" ? date.getSeconds() : 0,
        )
    }
    return new CalendarDate(y, m, d)
}

const hasTime = (val: DateValue): val is DateValue & { hour: number; minute: number; second: number } =>
    typeof (val as { hour?: unknown }).hour === "number"

const FormDatePicker: React.FC<FormDatePickerProps> = ({ name, granularity, minValue, ...rest }) => {
    const { values, errors, submitCount, setFieldValue, onBlur, validateForm } = useContext(FormContext)

    const rawValue = getIn(values, name) as Date | null | undefined
    const error = getIn(errors, name) as string | undefined
    const hasValue = rawValue != null

    const isBeforeMinValue = (val: DateValue): boolean => {
        if (!minValue) return false
        const valDate = new Date(val.year, val.month - 1, val.day)
        const minDate = new Date(minValue.year, minValue.month - 1, minValue.day)
        return valDate < minDate
    }

    return (
        <DatePicker
            {...rest}
            granularity={granularity}
            value={toCalendarValue(rawValue, granularity)}
            minValue={minValue}
            onChange={(val: DateValue | null) => {
                if (!val) { 
                    setFieldValue(name, null, true);
                    requestAnimationFrame(() => validateForm());
                    return 
                }
                if (isBeforeMinValue(val)) return
                if (hasTime(val)) {
                    setFieldValue(
                        name,
                        new Date(val.year, val.month - 1, val.day, val.hour, val.minute, val.second ?? 0),
                        true
                    );
                    requestAnimationFrame(() => validateForm());
                    return
                }
                setFieldValue(name, new Date(val.year, val.month - 1, val.day), true);
                requestAnimationFrame(() => validateForm());
            }}
            isInvalid={!!((hasValue || submitCount > 0) && error)}
            errorMessage={(hasValue || submitCount > 0) ? error : undefined}
            onBlur={onBlur}
        />
    )
}

export default FormDatePicker
