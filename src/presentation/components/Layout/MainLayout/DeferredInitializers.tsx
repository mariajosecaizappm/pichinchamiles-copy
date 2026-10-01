"use client"

import AuthInitializer from "./AuthInitializer";
import AnalyticsInitializer from "./AnalyticsInitializer";

const DeferredInitializers = () => (
    <>
        <AuthInitializer />
        <AnalyticsInitializer />
    </>
)

export default DeferredInitializers
