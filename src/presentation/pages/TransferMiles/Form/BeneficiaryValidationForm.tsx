import Form from "@/presentation/components/Form/context/Form"
import { ObjectSchema } from "yup"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import BeneficiaryValidationFields from "./components/BeneficiaryValidationFields"
import {
    transferBeneficiaryFormSchema,
    TransferBeneficiaryFormValues,
} from "../TransferMilesFormConfig"

type BeneficiaryValidationFormProps = {
    beneficiary: TransferBeneficiary | null
    beneficiaryNotFound: boolean
    identificationNumber: string
    identificationFieldError: string | null
    onValidate: (values: TransferBeneficiaryFormValues) => Promise<void>
    onDocumentChange: (document: string) => void
}

const BeneficiaryValidationForm = ({
    beneficiary,
    beneficiaryNotFound,
    identificationNumber,
    identificationFieldError,
    onValidate,
    onDocumentChange,
}: BeneficiaryValidationFormProps) => (
    <Form<TransferBeneficiaryFormValues>
        initialValues={{ identificationNumber }}
        onSubmit={onValidate}
        schema={
            transferBeneficiaryFormSchema as unknown as ObjectSchema<TransferBeneficiaryFormValues>
        }
        validateOnChange
        className="flex flex-col"
        ariaLabel="Formulario de validación del beneficiario"
    >
        <BeneficiaryValidationFields
            beneficiary={beneficiary}
            beneficiaryNotFound={beneficiaryNotFound}
            identificationFieldError={identificationFieldError}
            onDocumentChange={onDocumentChange}
        />
    </Form>
)

export default BeneficiaryValidationForm
