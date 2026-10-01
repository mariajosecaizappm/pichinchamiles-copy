import { getString, isRecord } from "@/data/adapters/commonAdapters"
import { TransferBeneficiary } from "@/domain/entity/Transfer/structure/transfer"

export const transferBeneficiaryAdapter = (data: unknown): TransferBeneficiary => {
    if (!isRecord(data)) {
        return {
            id: "",
            status: "",
            firstName: "",
            secondName: "",
            firstLastName: "",
            secondLastName: "",
            identificationNumber: "",
        }
    }

    return {
        id: getString(data.id),
        status: getString(data.status),
        firstName: getString(data.firstName),
        secondName: getString(data.secondName),
        firstLastName: getString(data.firstLastName),
        secondLastName: getString(data.secondLastName),
        identificationNumber: getString(data.identificationNumber),
    }
}
