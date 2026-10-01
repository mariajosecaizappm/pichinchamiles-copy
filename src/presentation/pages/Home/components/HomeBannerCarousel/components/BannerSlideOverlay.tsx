"use client"

import { Banner } from "@/domain/entity/Banner/banner";
import AppLink from "@/presentation/components/AppLink";
import { isPdfHref } from "@/presentation/helpers/url";
import useSession from "@/presentation/hooks/useSession";
import clsx from "clsx";
import Button from "../../Button";
import LoginButton from "../../Button/LoginButton";

type Props = {
    banner: Banner;
    overlayInnerClassName?: string;
    textWrapperClassName?: string;
    TitleComponent?: "h1" | "h2";
    titleClassName?: string;
    titleContainerClassName?: string;
}

const BannerSlideOverlay = ({
    banner,
    overlayInnerClassName = "absolute inset-0 p-6 sm:flex justify-start items-center",
    textWrapperClassName = "flex flex-col gap-4 z-10 py-5 relative text-center sm:text-start items-center sm:items-start w-full max-w-[978px] mx-auto",
    TitleComponent = "h2",
    titleClassName,
    titleContainerClassName = "sm:2/3",
}: Props) => {
    const { isLogged } = useSession();
    const opensInNewTab = isPdfHref(banner.link);
    return (
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
        </div>
    );
};

export default BannerSlideOverlay;
