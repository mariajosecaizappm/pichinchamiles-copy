import React from 'react';
import dinners from "@/presentation/assets/Diners.png"
import mastercard from "@/presentation/assets/Mastercard.png"
import discover from "@/presentation/assets/Discover.png"
import visa from "@/presentation/assets/Visa.png"
import titanium from "@/presentation/assets/Titanium.png"
import Image from "next/image";

const CheckoutCopaymentBrands = () => {
    return (
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
    );
};

export default CheckoutCopaymentBrands;