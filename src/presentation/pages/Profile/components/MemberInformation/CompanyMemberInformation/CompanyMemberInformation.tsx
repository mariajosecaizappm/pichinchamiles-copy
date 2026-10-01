import { CorporateMember } from "@/domain/entity/Member/member"
import { maskedData } from "@/presentation/helpers/member"
import { Divider } from "@heroui/react"
import InformationRow from "../InformationRow"

const CompanyMemberInformation = ({ member }: { member: CorporateMember }) => {
    return (
        <>
            <InformationRow label="RUC" value={maskedData(member.identificationNumber, 0, 5)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Administrador de millas" value={member.administratorName} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Documento de identidad del Administrador" value={maskedData(member.identificationNumberAdministrator, 0, 3)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Número telefónico de contacto" value={maskedData(member.cellPhone, 0, 3)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="País, provincia y ciudad" value={member.country + ", " + member.state + ", " + member.city} />
        </>
    )
}

export default CompanyMemberInformation