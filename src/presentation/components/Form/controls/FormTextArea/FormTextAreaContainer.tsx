import FormTextArea from "./FormTextArea"
import { BaseTextAreaProps } from "../../components/TextArea/TextArea"
import { useContext } from "react"
import FormContext from "../../context/FormContext"
import { getIn } from "formik"

type Props = {
    name: string
    regExp?: RegExp
} & Omit<BaseTextAreaProps, 'value'>

const FormTextAreaContainer: React.FC<Props> = ({ name, regExp, ...props }) => {
    const { values, errors, touched, submitCount, onInputChange } = useContext(FormContext)
    const value = values[name]
    const error = errors[name] as string | undefined
    const hasValue = value !== "" && value !== undefined && value !== null
    const isTouched = Boolean(getIn(touched, name))
    const showError = !!((hasValue || isTouched) && error && submitCount > 0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (regExp) {
            if (e.target.value === "" || regExp.test(e.target.value)) {
                onInputChange(e)
            }
        } else {
            onInputChange(e)
        }
    }
    
  
    return <FormTextArea
        {...props}
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        errorMessage={showError ? <span aria-label={`Error. ${error}`}>{error}</span> : undefined}
        isInvalid={showError}
    />
}

export default FormTextAreaContainer