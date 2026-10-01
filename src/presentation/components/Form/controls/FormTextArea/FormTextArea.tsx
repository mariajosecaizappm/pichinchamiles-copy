import TextArea from "@/presentation/components/Form/components/TextArea"
import { BaseTextAreaProps } from "../../components/TextArea/TextArea"


type FormTextAreaProps = {
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Omit<BaseTextAreaProps, 'onChange'>

const FormTextArea: React.FC<FormTextAreaProps> = ({ name, value, onChange, ...props }) => {
    return <TextArea name={name} value={value} onChange={onChange} {...props} />
}

export default FormTextArea