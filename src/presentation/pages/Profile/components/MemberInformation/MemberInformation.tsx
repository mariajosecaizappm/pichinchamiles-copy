import { Member, MemberType } from "@/domain/entity/Member/member";
import Alert from "@/presentation/components/Alert";
import { getUserName } from "@/presentation/helpers/member";
import CompanyMemberInformation from "./CompanyMemberInformation";
import PersonalMemberInformation from "./PersonalMemberInformation";

type Props = {
    member: Member
}

const MemberInformation = ({ member }: Props) => {
    return (
        <div className="body-container pt-3 pb-6 space-y-3 md:max-w-[676px]">
            <h2 className="title-section">{getUserName(member)}</h2>
            <div className="space-y-3">
                <div className="border border-darkGrayishBlue-300 rounded-lg p-3 flex flex-col gap-2">
                    {member.memberType === MemberType.PERSONAL ?
                        <PersonalMemberInformation member={member} />
                        : <CompanyMemberInformation member={member} />
                    }
                </div>
                <Alert variant="info">Si deseas actualizar tu información personal, comunícate al <span className="font-semibold">1800 - BPMILE (276-453)</span></Alert>
            </div>
        </div>
    )
}

export default MemberInformation