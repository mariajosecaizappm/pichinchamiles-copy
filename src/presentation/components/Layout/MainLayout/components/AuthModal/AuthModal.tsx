"use client"
import React, { useContext, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/presentation/config/store";
import Modal from "@/presentation/components/Modal";
import {closeAuthModal} from "@/presentation/redux/features/authModalSlice";
import AuthModalProvider from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalProvider";
import AuthModalContext from "@/presentation/components/Layout/MainLayout/components/AuthModal/context/AuthModalContext";
import AuthModalTitle from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthModalTitle";
import IdentificationForm
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm";
import AuthStepper from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthStepper";
import AuthPrivacy from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/AuthPrivacy";
import ActivationFlow from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ActivationFlow";
import LoginFlow from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/LoginFlow";
import ResetPasswordFlow
    from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow";
import Icon from "@/presentation/components/icons/Icon";

const AuthModalInner = () => {
    const { isOpen } = useSelector((state: RootState) => state.authModal);
    const dispatch = useDispatch();
    const handleCloseModal = () => dispatch(closeAuthModal());
    const { currentStep, backStep, clearAuth } = useContext(AuthModalContext);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                clearAuth();
            }, 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen, clearAuth]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleCloseModal}
            scrollBehavior="inside"
            closeButtonAriaLabel='Cerrar y regresa a la pantalla anterior'
            headerButton={
                currentStep > 1 && currentStep < 4 ? (
                    <button 
                        data-testid="backStepModal" 
                        type="button" 
                        onClick={backStep} 
                        aria-label="Regresar"
                        className="absolute top-5 left-5 p-0 text-blue-500 hover:opacity-70 z-10"
                    >
                        <Icon name="icon-back"/>
                    </button>
                ) : <></>
            }
            classNames={{
                wrapper: "z-80",
                backdrop: "z-70"
            }}
        >
            <div id="formsAlert"></div>
            <AuthModalTitle/>
            <IdentificationForm/>
            <ActivationFlow/>
            <LoginFlow/>
            <ResetPasswordFlow/>
            <AuthStepper/>
            <AuthPrivacy/>
        </Modal>
    );
};

const AuthModal = () => {
    return (
        <AuthModalProvider>
            <AuthModalInner />
        </AuthModalProvider>
    );
};

export default AuthModal;