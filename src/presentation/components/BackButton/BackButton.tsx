"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { BackButtonProps } from "./types";
import Icon from "../icons/Icon";

const BackButton = ({
    children = "Regresar",
    className,
    fallbackHref = "/",
    customGoBack,
}: BackButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (customGoBack) {
            customGoBack();
            return;
        }

        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                "cursor-pointer flex items-center base-paragraph font-normal leading-normal text-blue-500",
                className,
            )}
        >
            <Icon name="icon-back-arrow" /> 
            <span>{children}</span>
        </button>
    );
};

export default BackButton;