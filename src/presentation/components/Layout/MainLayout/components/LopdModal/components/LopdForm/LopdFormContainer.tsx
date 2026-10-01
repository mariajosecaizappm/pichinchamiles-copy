"use client"
import React, {FC} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import container from "@/presentation/config/inversify.config";
import UpdateLopdUseCase from "@/domain/interactors/Auth/UpdateLopdUseCase";
import UpdateMemberUseCase from "@/domain/interactors/Member/UpdateMemberUseCase";
import links from "@/presentation/config/links";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import {Member} from "@/domain/entity/Member/member";
import {Consent} from "@/domain/entity/Member/consent";
import {
    needsLopdConsent,
    needsTermsConsent,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers";
import {
    updateConsent,
    updateMemberLegalConsent,
} from "@/presentation/redux/features/userSlice";
import LopdForm from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdForm";
import {LopdFormValues} from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm/LopdFormConfig";

export type LopdFormContainerProps = {
    member: Member
    cif: string
    consent: Consent | null
    onClose: () => void
    onRemindLater?: () => Promise<void>
    variant?: "modal" | "page"
    className?: string
}

const LopdFormContainer: FC<LopdFormContainerProps> = ({
    member,
    cif,
    consent,
    onClose,
    onRemindLater,
    variant = "modal",
    className,
}) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const updateLopdUseCase = container.get<UpdateLopdUseCase>(UseCaseTypes.UpdateLopdUseCase)
    const showTermsCheckbox = needsTermsConsent(member)
    const showLopdCheckbox = needsLopdConsent(member, consent, cif)

    const handleTermsLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        if (pathname !== links.termsAndConditions) {
            router.push(links.termsAndConditions)
        }
    }

    const handleSubmit = async (values: LopdFormValues) => {
        if (values.acceptedTermsAndCondition && !member.acceptedTermsAndCondition) {
            const updateMemberUseCase = container.get<UpdateMemberUseCase>(
                UseCaseTypes.UpdateMemberUseCase
            )
            await updateMemberUseCase.updateMember({
                acceptedTermsAndCondition: true,
            })
        }

        const shouldUpdateLopd =
            values.acceptedLopd && (!member.acceptLopd || consent?.hasConsent === false)

        if (shouldUpdateLopd) {
            await updateLopdUseCase.updateLopd(member, cif, consent, true)
        }

        dispatch(
            updateMemberLegalConsent({
                acceptedTermsAndCondition:
                    values.acceptedTermsAndCondition || member.acceptedTermsAndCondition,
                acceptLopd: values.acceptedLopd || member.acceptLopd,
            })
        )

        if (consent && values.acceptedLopd) {
            dispatch(
                updateConsent({
                    consent: { ...consent, hasConsent: true },
                })
            )
        }

        onClose()
    }

    return (
        <LopdForm
            showTermsCheckbox={showTermsCheckbox}
            showLopdCheckbox={showLopdCheckbox}
            onSubmit={handleSubmit}
            onTermsLinkClick={handleTermsLinkClick}
            onRemindLater={onRemindLater}
            variant={variant}
            className={className}
        />
    )
};

export default LopdFormContainer;
