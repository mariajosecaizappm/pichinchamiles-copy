import React, {FC} from 'react';
import Link from "next/link";
import {cn} from "@heroui/react";
import Form from "@/presentation/components/Form/context/Form";
import {FormCheckbox} from "@/presentation/components/Form/controls/FormCheckbox";
import {
    createLopdFormSchema,
    defaultLopdFormConfig,
    LopdFormValues,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdFormConfig";
import FormButton from "@/presentation/components/Form/controls/FormButton";
import {Button} from "@/presentation/components/Form/components/Button";
import links from "@/presentation/config/links";

export type LopdFormProps = {
    showTermsCheckbox: boolean
    showLopdCheckbox: boolean
    onSubmit: (values: LopdFormValues) => Promise<void>
    onTermsLinkClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
    onRemindLater?: () => Promise<void>
    variant?: "modal" | "page"
    className?: string
}

const linkClassName = "underline text-information-500 font-bold"

const LopdForm: FC<LopdFormProps> = ({
    showTermsCheckbox,
    showLopdCheckbox,
    onSubmit,
    onTermsLinkClick,
    onRemindLater,
    variant = "modal",
    className,
}) => {
    const isPage = variant === "page"
    const isModal = variant === "modal"

    return (
        <Form
            initialValues={defaultLopdFormConfig}
            schema={createLopdFormSchema({
                withTerms: showTermsCheckbox,
                withLopd: showLopdCheckbox,
            })}
            onSubmit={onSubmit}
            className={cn(
                "flex flex-col",
                isModal && "flex-1",
                !isModal && "gap-4",
                className,
            )}
        >
            <div className={cn("flex flex-col", isPage ? "gap-4" : "gap-2 p-6 pt-0")}>
                {showTermsCheckbox && (
                    <FormCheckbox
                        testId="acceptedTermsAndCondition"
                        name="acceptedTermsAndCondition"
                        aria-label="He leído y acepto los términos y condiciones"
                        label={
                            <>
                                He leído y acepto los{" "}
                                <Link
                                    href={links.termsAndConditions}
                                    className={linkClassName}
                                    onClick={onTermsLinkClick}
                                    aria-label="Leer términos y condiciones del programa. Enlace"
                                >
                                    términos y condiciones
                                </Link>
                                .
                            </>
                        }
                    />
                )}
                {showLopdCheckbox && (
                    <FormCheckbox
                        testId="acceptedLopd"
                        name="acceptedLopd"
                        aria-label="Autorizo el tratamiento de datos personales"
                        label={
                            <>
                                Autorizo el{" "}
                                <a
                                    href={links.lopdDocument}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={linkClassName}
                                    aria-label="Leer documento de tratamiento de datos personales. Enlace"
                                >
                                    tratamiento de datos personales
                                </a>.
                            </>
                        }
                    />
                )}
            </div>
            <div className={cn(isModal && "p-6 pt-4 border-t border-darkGrayishBlue-300 mt-auto")}>
                <FormButton
                    className={cn("w-full", isPage && "max-w-[170px]")}
                    testId="submitLopd"
                    aria-label="Sí, autorizo términos y condiciones"
                >
                    Sí, autorizo
                </FormButton>
                {isModal && showLopdCheckbox && !showTermsCheckbox && onRemindLater && (
                    <Button
                        color="secondary"
                        type="button"
                        onPress={onRemindLater}
                        testId="remindMeLater"
                        className="w-full mt-4"
                    >
                        Recordar más tarde
                    </Button>
                )}
            </div>
        </Form>
    )
};

export default LopdForm;
