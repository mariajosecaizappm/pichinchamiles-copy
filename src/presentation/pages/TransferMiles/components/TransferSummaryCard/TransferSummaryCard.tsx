import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"
import { formatMiles } from "@/presentation/helpers/quantities"
import { getPersonalFullName } from "@/presentation/helpers/member"

type TransferSummaryCardProps = {
    memberName: string
    balance: number
    beneficiary: TransferBeneficiary | null
    milesToTransfer?: number | null
}

const TransferSummaryCard = ({
    memberName,
    balance,
    beneficiary,
    milesToTransfer = null,
}: TransferSummaryCardProps) => (
    <section
        aria-label="Resumen de transferencia"
        className="w-full rounded-lg border border-darkGrayishBlue-300 bg-white p-4"
    >
        <p className="text-sm font-normal leading-5 text-grayscale-400">Tú envías</p>
        <p className="typo-main-body-semi-bold mt-1 text-grayscale-500">{memberName}</p>

        <p className="text-sm font-normal leading-5 text-grayscale-400">Saldo disponible</p>
        <p className="typo-main-headline-2-prelo-semi-bold mt-1 text-grayscale-500">
            {formatMiles(balance)} millas
        </p>

        {beneficiary && (
            <>
                <hr className="my-2 border-darkGrayishBlue-300" />
                <p className="text-sm font-normal leading-5 text-grayscale-400">Beneficiario/a</p>
                <p className="typo-main-body-semi-bold mt-1 text-grayscale-500">
                    {getPersonalFullName(beneficiary)}
                </p>

                {milesToTransfer !== null && milesToTransfer > 0 && (
                    <>
                        <p className="text-sm font-normal leading-5 text-grayscale-400">
                            Millas a transferir:
                        </p>
                        <p className="typo-main-headline-2-prelo-semi-bold mt-1 text-information-500">
                            {formatMiles(milesToTransfer)} millas
                        </p>
                    </>
                )}
            </>
        )}
    </section>
)

export default TransferSummaryCard
