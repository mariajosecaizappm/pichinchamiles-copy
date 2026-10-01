"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import container from "@/presentation/config/inversify.config"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetBeneficiaryUseCase from "@/domain/interactors/Transfer/GetBeneficiaryUseCase"
import GetGenerateOtpTransferUseCase from "@/domain/interactors/Transfer/GetGenerateOtpTransferUseCase"
import CreateTransferUseCase from "@/domain/interactors/Transfer/CreateTransferUseCase"
import {
    TransferBeneficiary,
    TransferStatus,
} from "@/domain/entity/Transfer/structure/transfer"
import { ApiError } from "@/domain/entity/Error/models/ApiError"
import { ErrorCode } from "@/domain/entity/Error/structure/error"
import { MfaRequest } from "@/domain/entity/Otp/otp"
import useSession from "@/presentation/hooks/useSession"
import useKount from "@/presentation/hooks/useKount"
import useOtp from "@/presentation/hooks/useOtp"
import links from "@/presentation/config/links"
import { getPersonalFullName } from "@/presentation/helpers/member"
import TransferMiles from "./TransferMiles"
import BalanceZeroModal from "./components/BalanceZeroModal"
import ConfirmTransferModal from "./components/ConfirmTransferModal"
import TransferSuccessModal from "./components/TransferSuccessModal"
import {
    getTransferBeneficiaryFieldErrorMessage,
    isValidTransferMilesAmount,
    parseMilesAmount,
    TransferBeneficiaryFormValues,
} from "./TransferMilesFormConfig"
import {EventName} from "@/presentation/analytics/types";
import {MountTracker} from "@/presentation/analytics/MountTracker";
import useAnalytics from "@/presentation/hooks/useAnalytics";

export type PendingTransfer = {
    beneficiary: TransferBeneficiary
    miles: number
}

const getBeneficiaryUseCase = container.get<GetBeneficiaryUseCase>(UseCaseTypes.GetBeneficiaryUseCase)
const getGenerateOtpTransferUseCase = container.get<GetGenerateOtpTransferUseCase>(
    UseCaseTypes.GetGenerateOtpTransferUseCase
)
const createTransferUseCase = container.get<CreateTransferUseCase>(UseCaseTypes.CreateTransferUseCase)

const isInvalidBeneficiary = (beneficiary: TransferBeneficiary) =>
    !beneficiary.id ||
    beneficiary.status === TransferStatus.CANCELED ||
    beneficiary.status === TransferStatus.CANCELED_WITHOUT_ACCESS

const TransferMilesContainer = () => {
    const router = useRouter()
    const { member, balance, programCurrency, updateBalance } = useSession()
    const { sessionId } = useKount()
    const { track } = useAnalytics()
    const [beneficiary, setBeneficiary] = useState<TransferBeneficiary | null>(null)
    const [beneficiaryNotFound, setBeneficiaryNotFound] = useState(false)
    const [identificationFieldError, setIdentificationFieldError] = useState<string | null>(null)
    const [identificationNumber, setIdentificationNumber] = useState("")
    const [miles, setMiles] = useState("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [isTransferLoading, setIsTransferLoading] = useState(false)
    const transferCompletedRef = useRef(false)

    const executeTransfer = useCallback(
        async (transfer: PendingTransfer, mfaRequest?: MfaRequest) => {
            const currencyId = programCurrency?.pointsCurrencyId ?? ""
            try {
                const result = await createTransferUseCase.execute(
                    {
                        originCurrencyId: currencyId,
                        destinationCurrencyId: currencyId,
                        destinationMemberUserId: transfer.beneficiary.id,
                        pointsAmount: transfer.miles,
                        mfaCode: mfaRequest?.mfaCode,
                        mfaToken: mfaRequest?.mfaToken,
                    },
                    sessionId
                )
                track(EventName.VIEWED_TRANSFER_STATUS, { status: "success", amount: transfer.miles })
                transferCompletedRef.current = true
                updateBalance(result.balanceAfterOperation)
            }catch (e){
                track(EventName.VIEWED_TRANSFER_STATUS, { status: "error", amount: transfer.miles })
                throw e
            }
        },
        [programCurrency?.pointsCurrencyId, sessionId, updateBalance, track]
    )

    const { withOtp } = useOtp<PendingTransfer>({
        title: "Código de seguridad",
        onRequestOtp: async () => {
            transferCompletedRef.current = false
            setIsTransferLoading(true)
            return getGenerateOtpTransferUseCase.execute()
        },
        onSubmitOtp: async (mfaRequest, transfer) => {
            setIsTransferLoading(true)
            await executeTransfer(transfer, mfaRequest)
        },
        onContinue: async (transfer) => {
            try {
                if (!transferCompletedRef.current) {
                    await executeTransfer(transfer)
                }

                setIsSuccessOpen(true)
            } finally {
                transferCompletedRef.current = false
                setIsTransferLoading(false)
            }
        },
        onModalClose: () => {
            transferCompletedRef.current = false
            setIsTransferLoading(false)
        },
    })

    const handleDocumentChange = useCallback(
        (document: string) => {
            setIdentificationNumber(document)
            setIdentificationFieldError(null)

            if (beneficiaryNotFound) {
                setBeneficiaryNotFound(false)
            }

            if (beneficiary && document !== beneficiary.identificationNumber) {
                setBeneficiary(null)
                setMiles("")
                setIsConfirmOpen(false)
            }
        },
        [beneficiary, beneficiaryNotFound]
    )

    const handleMilesChange = useCallback((nextMiles: string) => {
        setMiles(nextMiles)
    }, [])

    const handleValidate = useCallback(
        async (values: TransferBeneficiaryFormValues) => {
            if (!member) {
                throw new ApiError(ErrorCode.UNKNOWN)
            }

            setBeneficiary(null)
            setBeneficiaryNotFound(false)
            setIdentificationFieldError(null)
            setMiles("")
            setIsConfirmOpen(false)

            if (values.identificationNumber === member.identificationNumber) {
                setIdentificationFieldError(
                    getTransferBeneficiaryFieldErrorMessage(new ApiError(ErrorCode.SELF_TRANSFER))
                )
                return
            }

            try {
                const result = await getBeneficiaryUseCase.execute(values.identificationNumber)

                if (isInvalidBeneficiary(result)) {
                    setBeneficiaryNotFound(true)
                    setIdentificationFieldError(
                        getTransferBeneficiaryFieldErrorMessage(
                            new ApiError(ErrorCode.BENEFICIARY_NOT_FOUND)
                        )
                    )
                    return
                }

                setBeneficiary(result)
            } catch (error) {
                if (error instanceof ApiError) {
                    const fieldErrorMessage = getTransferBeneficiaryFieldErrorMessage(error)

                    if (fieldErrorMessage) {
                        if (error.code === ErrorCode.BENEFICIARY_NOT_FOUND) {
                            setBeneficiaryNotFound(true)
                        }

                        setIdentificationFieldError(fieldErrorMessage)
                        return
                    }
                }

                throw error
            }
        },
        [member]
    )

    const handleTransfer = useCallback(
        (nextMiles: string) => {
            if (!beneficiary || !isValidTransferMilesAmount(nextMiles, balance)) {
                return
            }
            track(EventName.TRANSFER);
            setMiles(nextMiles)
            setIsConfirmOpen(true)
        },
        [beneficiary, balance, track]
    )

    const handleCancelConfirm = useCallback(() => {
        setIsConfirmOpen(false)
    }, [])

    const handleConfirmTransfer = useCallback(async () => {
        if (!beneficiary || !isValidTransferMilesAmount(miles, balance)) {
            return
        }

        setIsConfirmOpen(false)
        setIsTransferLoading(true)

        try {
            await withOtp({
                beneficiary,
                miles: parseMilesAmount(miles),
            })
        } catch {
            setIsTransferLoading(false)
        }
    }, [beneficiary, miles, balance, withOtp])

    const handleGoHome = useCallback(() => {
        router.push(links.products)
    }, [router])

    const handleViewBalance = useCallback(() => {
        setIsSuccessOpen(false)
        router.push(links.myTransactions)
    }, [router])

    const handleSuccessGoHome = useCallback(() => {
        setIsSuccessOpen(false)
        router.push(links.products)
    }, [router])

    const handleCloseSuccess = useCallback(() => {
        setIsSuccessOpen(false)
    }, [])

    if (!member) {
        return null
    }

    const isInsufficientBalance = balance < 10
    const confirmMiles = parseMilesAmount(miles)
    const beneficiaryName = beneficiary ? getPersonalFullName(beneficiary) : ""

    return (
        <>
            <MountTracker name={EventName.VIEWED_TRANSFER}/>
            <div
                aria-hidden={isInsufficientBalance}
                className={isInsufficientBalance ? "pointer-events-none select-none" : undefined}
            >
                <TransferMiles
                    member={member}
                    balance={balance}
                    beneficiary={beneficiary}
                    beneficiaryNotFound={beneficiaryNotFound}
                    identificationNumber={identificationNumber}
                    identificationFieldError={identificationFieldError}
                    miles={miles}
                    isTransferLoading={isTransferLoading}
                    onValidate={handleValidate}
                    onDocumentChange={handleDocumentChange}
                    onMilesChange={handleMilesChange}
                    onTransfer={handleTransfer}
                />
            </div>
            <BalanceZeroModal
                isOpen={isInsufficientBalance}
                title="Necesitas más millas para transferir"
                description="Para realizar una transferencia necesitas tener al menos 10 millas en tu cuenta."
                continueLabel="Ir al home"
                onGoHome={handleGoHome}
            />
            <ConfirmTransferModal
                isOpen={isConfirmOpen && Boolean(beneficiary) && confirmMiles > 0}
                miles={confirmMiles}
                beneficiaryName={beneficiaryName}
                onConfirm={handleConfirmTransfer}
                onCancel={handleCancelConfirm}
            />
            <TransferSuccessModal
                isOpen={isSuccessOpen}
                onViewBalance={handleViewBalance}
                onGoHome={handleSuccessGoHome}
                onClose={handleCloseSuccess}
            />
        </>
    )
}

export default TransferMilesContainer
