"use client";

import useSession from "@/presentation/hooks/useSession";
import Miles from "./Miles";
import MilesMobile from "./MilesMobile";

type Props = {
    isMobile?: boolean;
}

const MilesContainer = ({ isMobile = false }: Props) => {
    const { balance,member, isLogged } = useSession();

    if (!isLogged || !member) {
        return null;
    }

    if (isMobile) {
        return <MilesMobile balance={balance} />;
    }

    return <Miles balance={balance} member={member} />;
};

export default MilesContainer;
