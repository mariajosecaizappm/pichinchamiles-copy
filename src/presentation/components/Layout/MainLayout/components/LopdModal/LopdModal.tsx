"use client"
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from "next/navigation";
import Modal from "@/presentation/components/Modal";
import useSession from "@/presentation/hooks/useSession";
import {getUserName} from "@/presentation/helpers/member";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import UpdateLopdUseCase from "@/domain/interactors/Auth/UpdateLopdUseCase";
import LopdForm from "@/presentation/components/Layout/MainLayout/components/LopdModal/components/LopdForm";
import links from "@/presentation/config/links";
import {
    getLopdConsentModalMessage,
    needsLopdConsent,
    needsTermsConsent,
    shouldSyncAcceptLopd,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers";
import { useSelector } from "react-redux";
import { RootState } from "@/presentation/config/store";
import { updateMemberLegalConsent } from "@/presentation/redux/features/userSlice";
import { useDispatch } from "react-redux";
import type { Member } from "@/domain/entity/Member/member";
import type { Consent } from "@/domain/entity/Member/consent";

const buildSyncKey = (member: Member, consent: Consent, cif: string): string =>
    `${member.identificationNumber}|${cif}|${String(consent.hasConsent)}|${String(member.acceptLopd)}|${String(member.acceptedTermsAndCondition)}`;

const LopdModal = () => {
    const pathname = usePathname()
    const {member, consent, clearConsent, cif, isValidatingSession} = useSession();
    const isAuthModalOpen = useSelector((state: RootState) => state.authModal.isOpen);
    const dispatch = useDispatch();

    const updateLopdUseCaseRef = useRef<UpdateLopdUseCase | null>(null);
    if (updateLopdUseCaseRef.current === null) {
        updateLopdUseCaseRef.current = container.get<UpdateLopdUseCase>(UseCaseTypes.UpdateLopdUseCase);
    }
    const updateLopdUseCase = updateLopdUseCaseRef.current;

    const [isChecking, setIsChecking] = useState<boolean>(true);
    const [isSkipped, setIsSkipped] = useState<boolean>(false);
    const [isClosed, setIsClosed] = useState<boolean>(false);

    const lastSyncAttemptKeyRef = useRef<string | null>(null);
    const isSyncingRef = useRef<boolean>(false);
    const checkedSkippedMembersRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        let isMounted = true;
        const updateLopd = updateLopdUseCaseRef.current;
        if (!updateLopd) return;

        const checkSkipped = async () => {
            if (member) {
                const memberId = member.identificationNumber;
                if (checkedSkippedMembersRef.current.has(memberId)) {
                    setIsChecking(false);
                    return;
                }
                checkedSkippedMembersRef.current.add(memberId);

                setIsChecking(true);
                const skipped = await updateLopd.isSkippedLopd(memberId);
                if (isMounted) {
                    setIsSkipped(skipped);
                    setIsChecking(false);
                }
            } else if (isMounted) {
                checkedSkippedMembersRef.current.clear();
                setIsChecking(false);
                setIsClosed(false);
                setIsSkipped(false);
            }
        };
        checkSkipped();
        return () => {
            isMounted = false;
        };
    }, [member]);

    useEffect(() => {
        let isMounted = true;
        const updateLopd = updateLopdUseCaseRef.current;
        if (!updateLopd) return;

        const syncAcceptLopd = async () => {
            if (isValidatingSession) return;
            if (!member || !cif || !consent) return;

            if (!shouldSyncAcceptLopd(member, consent, cif)) {
                lastSyncAttemptKeyRef.current = buildSyncKey(member, consent, cif);
                return;
            }

            const key = buildSyncKey(member, consent, cif);
            if (lastSyncAttemptKeyRef.current === key) return;
            if (isSyncingRef.current) return;

            lastSyncAttemptKeyRef.current = key;
            isSyncingRef.current = true;
            try {
                await updateLopd.updateMemberAcceptLopd(true);
                if (isMounted) {
                    dispatch(
                        updateMemberLegalConsent({
                            acceptedTermsAndCondition: member.acceptedTermsAndCondition,
                            acceptLopd: true,
                        })
                    );
                }
            } catch {
                lastSyncAttemptKeyRef.current = null;
            } finally {
                if (isMounted) {
                    isSyncingRef.current = false;
                }
            }
        };

        if (!member) {
            lastSyncAttemptKeyRef.current = null;
            isSyncingRef.current = false;
            return;
        }

        syncAcceptLopd();
        return () => {
            isMounted = false;
        };
    }, [
        member,
        consent,
        cif,
        isValidatingSession,
        member?.acceptLopd,
        member?.acceptedTermsAndCondition,
        consent?.hasConsent,
    ]);

    const isOnTermsPage = pathname === links.termsAndConditions
    const requiresTerms = needsTermsConsent(member)
    const requiresLopd = needsLopdConsent(member, consent, cif)
    const shouldShowForTerms = requiresTerms && !isOnTermsPage
    const shouldShowForLopd = requiresLopd && !isChecking && !isSkipped && !requiresTerms

    const isOpen = Boolean(
        !isAuthModalOpen
        && !isClosed
        && member
        && (shouldShowForTerms || shouldShowForLopd)
    );

    const persistSkip = async () => {
        if (!member) return;
        await updateLopdUseCase.skipLopd(member.identificationNumber, 2592000);
        setIsSkipped(true);
    }

    const handleRemindLater = async () => {
        if (!requiresTerms) {
            await persistSkip();
        }
        clearConsent();
        setIsClosed(true);
    }

    const handleClose = () => {
        setIsClosed(true);
        clearConsent();
    }

    const handleDismiss = () => {
        if (shouldShowForTerms) return;
        handleClose();
    }

    const modalMessage = getLopdConsentModalMessage({
        withTerms: requiresTerms,
        withLopd: requiresLopd && (shouldShowForLopd || shouldShowForTerms),
    })

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleDismiss}
            scrollBehavior="inside"
            hideCloseButton={shouldShowForTerms}
            isDismissable={!shouldShowForTerms}
            isKeyboardDismissDisabled={shouldShowForTerms}
            closeButtonAriaLabel='Cerrar aviso de autorización de datos personales.'
            headerButton={<></>}
            classNames={{
                body: "p-0",
            }}
        >
            {member && (
                <div className="flex flex-col flex-1">
                    <div className="p-6 pb-0">
                        <h6 className="typo-main-headline-3-prelo-semi-bold text-blue-500 text-center mb-4">
                            Hola {getUserName(member)},
                        </h6>
                        <p className="typo-main-caption-book text-grayScale-500 mb-2">
                            {modalMessage}
                        </p>
                    </div>
                    <LopdForm
                        member={member}
                        cif={cif}
                        consent={consent}
                        onRemindLater={handleRemindLater}
                        onClose={handleClose}
                    />
                </div>
            )}
        </Modal>
    );
};

export default LopdModal;
