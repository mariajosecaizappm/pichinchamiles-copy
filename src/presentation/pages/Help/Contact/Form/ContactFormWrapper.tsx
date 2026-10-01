import useSession from "@/presentation/hooks/useSession";
import { Member } from "@/domain/entity/Member/member";

type Props = {
    children: (member: Member) => React.ReactNode;
}

const ContactFormWrapper = ({ children }: Props) => {
    const { member } = useSession();
    if(!member) {
        return null;
    }
    return children(member)
};

export default ContactFormWrapper;