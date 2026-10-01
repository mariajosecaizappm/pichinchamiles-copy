"use client"
import React, {useEffect, useMemo} from 'react';
import FeePay from "@/presentation/pages/FeePay/FeePay";
import {useRouter, useSearchParams} from "next/navigation";
import links from "@/presentation/config/links";

const FeePayContainer = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { expirationDateTime, q, reference  } = Object.fromEntries(searchParams.entries());
    const placeToPayUrl = useMemo(() => {
        if(q){
            try {
                const firstDecrypt = Buffer.from(q, 'base64').toString('ascii');
                const secondDecrypt = Buffer.from(firstDecrypt, 'base64').toString('ascii');
                return secondDecrypt.replace(/\0/g, '');
            }catch{
                return ""
            }
        }
        return ""
    }, [q])

    useEffect(() => {
        if(expirationDateTime && new Date(expirationDateTime) < new Date()){
            router.push(links.home);
        }
    }, [expirationDateTime]);

    return <FeePay reference={reference} placeToPayUrl={placeToPayUrl}/>
};

export default FeePayContainer;