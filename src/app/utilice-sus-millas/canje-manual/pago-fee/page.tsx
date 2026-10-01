"use client"
import React from 'react';
import dynamic from "next/dynamic";
const FeePay = dynamic(()=> import("@/presentation/pages/FeePay"), {
    ssr: false,
})

const Page = () => {

    return (
        <FeePay/>
    )
};

export default Page;