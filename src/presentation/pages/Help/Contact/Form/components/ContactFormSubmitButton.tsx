import FormContext from "@/presentation/components/Form/context/FormContext";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import { Spinner } from "@heroui/react";
import { useContext } from "react";

const ContactFormSubmitButton = () => {
    const { isSubmitting } = useContext(FormContext);
    return (
        <FormButton className="w-full" alwaysEnabled spinner={<Spinner size="sm" variant="simple" classNames={{ wrapper: "text-blue-500" }} />}>
            {!isSubmitting && "Enviar requerimiento"}
        </FormButton>
    )
}

export default ContactFormSubmitButton
