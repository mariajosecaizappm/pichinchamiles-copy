'use client'
import aa from 'search-insights';
import {useEffect, useState} from "react";
import {GoogleTagManager, GoogleAnalytics} from '@next/third-parties/google'
import Script from "next/script";

const AnalyticsInitializer = () => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
    const [isIdle, setIsIdle] = useState(process.env.NODE_ENV === 'test')

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || []
        }

        const run = () => setIsIdle(true)
        let idleHandle: number | undefined
        let fallbackHandle: ReturnType<typeof setTimeout> | undefined

        const minDelay = setTimeout(() => {
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                idleHandle = window.requestIdleCallback(run, { timeout: 2000 })
            } else {
                fallbackHandle = setTimeout(run, 0)
            }
        }, 5000)

        return () => {
            clearTimeout(minDelay)
            if (idleHandle) window.cancelIdleCallback?.(idleHandle)
            if (fallbackHandle) clearTimeout(fallbackHandle)
        }
    }, [])

    // Initialize algolia events script
    useEffect(() => {
        aa('init', {
            appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
            apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
        })
    }, [])

    const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? ''
    const secondaryGtmId = process.env.NEXT_PUBLIC_SECONDARY_GTM_ID ?? ''
    const gaId = process.env.NEXT_PUBLIC_GA4_ID ?? ''

    const hasGtm = Boolean(gtmId)
    const hasSecondaryGtm = Boolean(secondaryGtmId)
    const hasGa = Boolean(gaId)
    const hasPixel = Boolean(pixelId)

    return isIdle && (hasGtm || hasSecondaryGtm || hasGa || hasPixel) ? (
        <>
            {hasGtm && <GoogleTagManager gtmId={gtmId}/>}
            {hasSecondaryGtm && <GoogleTagManager gtmId={secondaryGtmId}/>}
            {hasGa && <GoogleAnalytics gaId={gaId}/>}
            {hasPixel && (
                <>
                    <Script
                        id="facebook-pixel"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                !function(f,b,e,v,n,t,s)
                                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window,document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '${pixelId}');
                                fbq('track', 'PageView');
                            `,
                        }}
                    />
                    <noscript>
                        <img height="1" width="1" alt=""
                            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}/>
                    </noscript>
                </>
            )}
        </>
    ) : null;
};

export default AnalyticsInitializer;