"use client"
import React from 'react';
import dynamic from "next/dynamic";
const Transactions = dynamic(()=> import("@/presentation/pages/Profile/Transactions"), {
    ssr: false,
})

const Page = () => {
    return <Transactions/>;
};

export default Page;