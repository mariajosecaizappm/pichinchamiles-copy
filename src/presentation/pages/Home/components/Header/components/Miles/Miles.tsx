import { Member } from "@/domain/entity/Member/member";
import IconUser from "@/presentation/components/icons/IconUser";
import { getUserName } from "@/presentation/helpers/member";
import { formatMiles } from "@/presentation/helpers/quantities";
import React from "react";

type Props = {
    balance: number;
    member: Member;
}

const Miles = ({balance, member}: Props) => {
    return (
        <div className="text-base items-center text-blue-500 gap-4 hidden lg:flex text-center  font-normal bg-white">
            <IconUser/> 
            <span data-testid="textUserWelcome">
                Hola {getUserName(member)}, tienes <strong className="font-semibold">{formatMiles(balance)} millas</strong>
            </span>
        </div>
    );
};

export default Miles;
