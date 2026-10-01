import { PersonalMember } from "@/domain/entity/Member/member"
import { maskedData } from "@/presentation/helpers/member"
import { Divider } from "@heroui/react"
import InformationRow from "../InformationRow"

const PersonalMemberInformation  = ({ member }: { member: PersonalMember }) => {
    return (
        <>
            <InformationRow label="Documento de identificación" value={maskedData(member.identificationNumber, 0, 3)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Número de celular" value={maskedData(member.cellPhone, 0, 3)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Teléfono de domicilio" value={maskedData(member.phone, 0, 3)} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Fecha de nacimiento" value={member.birthDay} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="País, provincia y ciudad" value={`${member.country}, ${member.state}, ${member.city}`} />
            <div className="py-2">
                <Divider />
            </div>
            <InformationRow label="Dirección" value={member.address} />
        </>
    )
}

export default PersonalMemberInformation