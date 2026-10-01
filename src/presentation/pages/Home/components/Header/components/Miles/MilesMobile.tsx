import { formatMiles } from "@/presentation/helpers/quantities";
import React from "react";

type Props = {
    balance: number;
}

const MilesMobile = ({balance}: Props) => {
    return (
        <div className="text-base text-center lg:hidden font-medium  text-blue-500 bg-white">Tienes <strong className="font-semibold">{formatMiles(balance)} millas</strong></div>
    );
};

export default MilesMobile;
