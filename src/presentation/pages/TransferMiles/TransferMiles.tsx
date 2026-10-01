import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import { Member } from "@/domain/entity/Member/member"
import BeneficiaryValidationForm from "./Form"
import TransferMilesActions from "./components/TransferMilesActions"
import TransferSummaryCard from "./components/TransferSummaryCard"
import { getMemberFullName } from "@/presentation/helpers/member"
import {
    parseMilesAmount,
    TransferBeneficiaryFormValues,
} from "./TransferMilesFormConfig"

export type TransferMilesProps = {
    member: Member
    balance: number
    beneficiary: TransferBeneficiary | null
    beneficiaryNotFound: boolean
    identificationNumber: string
    identificationFieldError: string | null
    miles: string
    isTransferLoading?: boolean
    onValidate: (values: TransferBeneficiaryFormValues) => Promise<void>
    onDocumentChange: (document: string) => void
    onMilesChange: (miles: string) => void
    onTransfer: (miles: string) => void
}

const TransferMiles = ({
    member,
    balance,
    beneficiary,
    beneficiaryNotFound,
    identificationNumber,
    identificationFieldError,
    miles,
    isTransferLoading = false,
    onValidate,
    onDocumentChange,
    onMilesChange,
    onTransfer,
}: TransferMilesProps) => {
    const memberName = getMemberFullName(member)
    const milesAmount = parseMilesAmount(miles)

    return (
        <main className="mx-auto flex w-full max-w-[624px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6">
            <div className="flex flex-col gap-1 font-slab">
                <h1 className="text-[22px] leading-7 text-blue-500">Transferencia de millas</h1>
                <p className="text-base leading-5 text-grayscale-500">
                    Ingresa el documento del beneficiario. Solo puedes transferir a socios Pichincha
                    Miles.
                </p>
            </div>

            <TransferSummaryCard
                memberName={memberName}
                balance={balance}
                beneficiary={beneficiary}
                milesToTransfer={milesAmount > 0 ? milesAmount : null}
            />

            <BeneficiaryValidationForm
                beneficiary={beneficiary}
                beneficiaryNotFound={beneficiaryNotFound}
                identificationNumber={identificationNumber}
                identificationFieldError={identificationFieldError}
                onValidate={onValidate}
                onDocumentChange={onDocumentChange}
            />

            <TransferMilesActions
                isTransferEnabled={Boolean(beneficiary)}
                isTransferLoading={isTransferLoading}
                balance={balance}
                miles={miles}
                onMilesChange={onMilesChange}
                onTransfer={onTransfer}
            />
        </main>
    )
}

export default TransferMiles
