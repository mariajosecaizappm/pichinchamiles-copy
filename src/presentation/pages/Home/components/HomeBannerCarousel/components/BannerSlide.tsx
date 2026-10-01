"use client"

import { Banner } from "@/domain/entity/Banner/banner";
import AppLink from "@/presentation/components/AppLink";
import AssetImage from "@/presentation/components/AssetImage";
import { isPdfHref } from "@/presentation/helpers/url";
import useSession from "@/presentation/hooks/useSession";
import clsx from "clsx";
import Button from "../../Button";
import LoginButton from "../../Button/LoginButton";

const DEFAULT_MOBILE_GRADIENT =
    "linear-gradient(180deg, rgba(15, 38, 92, 0.43) 23.92%, rgba(255, 251, 229, 0.00) 40.66%, rgba(0, 0, 0, 0.34) 92.28%)";
const DEFAULT_DESKTOP_GRADIENT =
    "linear-gradient(270deg, rgba(255, 255, 255, 0.00) 29.81%, rgba(0, 0, 0, 0.20) 60%)";

type Props = {
    banner: Banner;
    containerClassName?: string;
    imageHeight?: number;
    imageBreakpoint?: number;
    priority?: boolean;
    fetchPriority?: "high" | "auto";
    skipPreload?: boolean;
    overlayInnerClassName?: string;
    textWrapperClassName?: string;
    TitleComponent?: "h1" | "h2";
    titleClassName?: string;
    titleContainerClassName?: string;
    mobileGradient?: string;
    mobileGradientClassName?: string;
    desktopGradient?: string;
    desktopGradientClassName?: string;
}

const BannerSlide = ({
    banner,
    containerClassName = "relative h-150 sm:h-120",
    imageHeight = 600,
    imageBreakpoint = 640,
    priority,
    fetchPriority = "auto",
    skipPreload,
    overlayInnerClassName = "absolute inset-0 p-6 sm:flex justify-start items-center",
    textWrapperClassName = "flex flex-col gap-4 z-10 py-5 relative sm:text-start w-full max-w-[978px] mx-auto",
    TitleComponent = "h2",
    titleClassName,
    titleContainerClassName = "sm:2/3",
    mobileGradient = DEFAULT_MOBILE_GRADIENT,
    mobileGradientClassName = "absolute inset-0 top-0 left-0 sm:hidden",
    desktopGradient = DEFAULT_DESKTOP_GRADIENT,
    desktopGradientClassName = "absolute inset-0 top-0 left-0 hidden sm:block",
}: Props) => {
    const { isLogged } = useSession();
    const opensInNewTab = isPdfHref(banner.link);
    return (
        <div className={containerClassName}>
            <AssetImage
                asset={banner.image}
                alt={banner.title}
                width={1920}
                height={imageHeight}
                breakpoint={imageBreakpoint}
                priority={priority}
                fetchPriority={fetchPriority}
                skipPreload={skipPreload}
                sizes="100vw"
                className="w-full h-full object-cover"
            />
            <div className={overlayInnerClassName}>
                <div className={textWrapperClassName}>
                    <div className={clsx("flex flex-col gap-1", titleContainerClassName)}>
                        <TitleComponent
                            className={clsx("typo-banner-title", titleClassName)}
                            style={{
                                color: banner.textColor || "#fff",
                            }}
                        >
                            {banner.title}
                        </TitleComponent>
                        {banner.subtitle && (
                            <p
                                className="typo-banner-subtitle"
                                style={{
                                    color: banner.textColor || "#fff",
                                }}
                            >
                                {banner.subtitle}
                            </p>
                        )}
                    </div>
                    <div>
                        <LoginButton size="lg" />
                        {isLogged && banner.link && banner.linkText && (
                            <AppLink
                                href={banner.link}
                                aria-label={`${banner.linkText}: ${banner.title}`}
                                {...(opensInNewTab && { target: "_blank", rel: "noopener noreferrer" })}
                            >
                                <Button className="z-10" size="lg">
                                    {banner.linkText}
                                </Button>
                            </AppLink>
                        )}
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    style={{ background: mobileGradient }}
                    className={mobileGradientClassName}
                />
                <div
                    aria-hidden="true"
                    style={{ background: desktopGradient }}
                    className={desktopGradientClassName}
                />
            </div>
        </div>
    );
};

export default BannerSlide;
