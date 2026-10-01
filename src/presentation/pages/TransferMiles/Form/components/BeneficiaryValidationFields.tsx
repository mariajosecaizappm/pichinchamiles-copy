import { useContext, useEffect } from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import FormInput from "@/presentation/components/Form/controls/FormInput"
import { textAndNumbers } from "@/presentation/helpers/regexp"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import ValidateBeneficiaryButton from "./ValidateBeneficiaryButton"

type BeneficiaryValidationFieldsProps = {
    beneficiary: TransferBeneficiary | null
    beneficiaryNotFound: boolean
    identificationFieldError: string | null
    onDocumentChange: (document: string) => void
}

const BeneficiaryValidationFields = ({
    beneficiary,
    beneficiaryNotFound,
    identificationFieldError,
    onDocumentChange,
}: BeneficiaryValidationFieldsProps) => {
    const { values, errors, hasErrors, isSubmitting, setFieldError, setFieldTouched } =
        useContext(FormContext)

    const isValidatedDocument = Boolean(
        beneficiary && values.identificationNumber === beneficiary.identificationNumber
    )

    const isValidateDisabled =
        hasErrors || isSubmitting || isValidatedDocument || beneficiaryNotFound

    // Re-apply API field error when Formik Yup validateOnBlur clears setFieldError.
    useEffect(() => {
        if (!identificationFieldError) {
            return
        }

        if (errors.identificationNumber === identificationFieldError) {
            return
        }

        setFieldError?.("identificationNumber", identificationFieldError)
        setFieldTouched?.("identificationNumber", true, false)
    }, [
        identificationFieldError,
        errors.identificationNumber,
        setFieldError,
        setFieldTouched,
    ])

    const handleDocumentChange = (document: string) => {
        setFieldError?.("identificationNumber", undefined)
        onDocumentChange(document)
    }

    return (
        <FormInput
            label="Documento del beneficiario"
            name="identificationNumber"
            placeholder="Ej. 1723456789"
            maxLength={17}
            regExp={textAndNumbers}
            testId="beneficiaryIdentificationNumber"
            aria-label="Documento del beneficiario"
            isDisabled={isSubmitting}
            onValueChange={handleDocumentChange}
            endContent={
                <ValidateBeneficiaryButton
                    disabled={isValidateDisabled}
                    isLoading={isSubmitting}
                />
            }
        />
    )
}

export default BeneficiaryValidationFields
