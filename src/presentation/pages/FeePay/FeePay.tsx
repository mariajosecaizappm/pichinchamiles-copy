import React, {FC} from 'react';
import FeePaymentStatus from "@/presentation/pages/FeePay/components/FeePaymentStatus";
import FeePaymentForm from "@/presentation/pages/FeePay/components/FeePaymentForm";
import Image from "next/image";
import dinners from "@/presentation/assets/Diners.png";
import mastercard from "@/presentation/assets/Mastercard.png";
import discover from "@/presentation/assets/Discover.png";
import visa from "@/presentation/assets/Visa.png";
import titanium from "@/presentation/assets/Titanium.png";

type FeePayProps = {
    reference: string
    placeToPayUrl: string
}

const FeePay: FC<FeePayProps> = ({reference, placeToPayUrl}) => {
    return (
        <div className="p-6 flex-1 max-w-[624px] w-full mx-auto">
            <FeePaymentStatus reference={reference}/>
            <h6 className="text-blue-500 text-[22px] font-slab font-normal leading-[28px] mb-2">
                Estás por completar tu canje
            </h6>
            <p className="mb-4 font-slab text-grayscale-500 text-body leading-[20px] font-normal">
                Por favor, lee detenidamente y acepta los siguientes parámetros de la transacción, para realizar el pago
                de fee de procesamiento y débito de millas:
            </p>
            <FeePaymentForm reference={reference} placeToPayUrl={placeToPayUrl}/>
            <div className="py-6 px-5">
                <img
                    src="https://static.placetopay.com/placetopay-logo.png"
                    alt="place to pay logo"
                    className="h-9 mx-auto mb-4.5"
                />
                <div className="flex items-center justify-center gap-4 xl:justify-between">
                    <Image src={dinners} alt="diners logo" width={45} height={12}/>
                    <Image src={mastercard} alt="mastercard logo" width={15} height={12}/>
                    <Image src={discover} alt="discover logo" width={58} height={10}/>
                    <Image src={visa} alt="visa logo" width={31} height={10}/>
                    <Image src={titanium} alt="Titanium logo" width={73} height={8}/>
                </div>
            </div>
        </div>
    );
};

export default FeePay;