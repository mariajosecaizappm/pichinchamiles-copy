import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import useSession from "@/presentation/hooks/useSession";
import { openAuthModal } from "@/presentation/redux/features/authModalSlice";
import links from "@/presentation/config/links";

const useContactLinkGuard = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLogged, isValidatingSession } = useSession();

    const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href === links.contact && (!isLogged || isValidatingSession)) {
            e.preventDefault();
            dispatch(openAuthModal(isLogged || isValidatingSession ? undefined : () => {
                router.push(links.contact);
            }));
        }
    };

    return handleContactClick;
};

export default useContactLinkGuard;
