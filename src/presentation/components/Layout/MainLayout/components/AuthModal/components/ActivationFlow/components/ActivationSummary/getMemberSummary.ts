import {Member, MemberType} from "@/domain/entity/Member/member";
import {getMemberLastnames, getMemberNames} from "@/presentation/helpers/member";

export default function getMemberSummary(member: Member){
    if(member.memberType === MemberType.PERSONAL){
        return [
            {label: "Nombres", value: getMemberNames(member)},
            {label: "Apellidos", value: getMemberLastnames(member)},
            {label: "Documento de identificación", value: member.identificationNumber},
            {label: "Fecha de nacimiento:", value: member.birthDay},
            {label: "Correo electrónico", value: member.enrollmentEmail},
            {label: "Teléfono celular", value: member.cellPhone},
        ]
    }else{
        return [
            {label: "Nombre de la empresa", value: member.companyName},
            {label: "RUC", value: member.identificationNumber},
            {label: "Administrador de millas", value: `${member.firstNameAdministrator} ${member.firstLastNameAdministrator}`},
            {label: "Documento de identificación", value: member.identificationNumberAdministrator},
            {label: "Teléfono celular", value: member.cellPhone},
            {label: "Correo electrónico", value: member.enrollmentEmailAdministrator},
        ]
    }
}