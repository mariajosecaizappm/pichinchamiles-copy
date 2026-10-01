import { RefObject, useContext, useEffect, useRef } from "react";
import FormInput from "@/presentation/components/Form/controls/FormInput";
import { FormPasswordInput } from "@/presentation/components/Form/controls/FormPasswordInput";
import PasswordComparator from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator";
import { FormRef } from "@/presentation/components/Form/context/Form";
import FormContext from "@/presentation/components/Form/context/FormContext";

type Props = {
    show: { emailForm: boolean; passwordForm: boolean }
    setShow: (show: { emailForm: boolean; passwordForm: boolean }) => void
    formRef: RefObject<FormRef | null>
}

const PasswordForm = ({ show, setShow, formRef }: Props) => {
    const { isSubmitting, values, validateForm } = useContext(FormContext);
    const validateFormRef = useRef(validateForm)
    validateFormRef.current = validateForm

    useEffect(() => {
        if (!show.passwordForm) return
        validateFormRef.current().catch(() => undefined)
    }, [show.passwordForm, values.newPassword, values.newPasswordConfirm])
    return (
        <>
            <FormInput
                testId="password"
                name="password"
                label="Contraseña"
                aria-label="Campo de texto seguro, ingresa tu contraseña"
                isDisabled={show.emailForm || isSubmitting}
                readOnly
                endContent={
                    show.emailForm ? null : (
                        <button
                            type="button"
                            className="w-6 h-6 flex items-center justify-center"
                            onClick={() => {
                                setShow({ ...show, passwordForm: !show.passwordForm })
                                if (!show.passwordForm) {
                                    setTimeout(() => {
                                        formRef.current?.focusOn("newPassword")
                                    }, 0)
                                }
                            }}
                        >
                            {
                                show.passwordForm ? (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#2C2C30" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.06 6.02L11.98 6.94L2.92 16H2V15.08L11.06 6.02ZM14.66 0C14.41 0 14.15 0.1 13.96 0.29L12.13 2.12L15.88 5.87L17.71 4.04C18.1 3.65 18.1 3.02 17.71 2.63L15.37 0.29C15.17 0.09 14.92 0 14.66 0ZM11.06 3.19L0 14.25V18H3.75L14.81 6.94L11.06 3.19Z" fill="#2C2C30" />
                                    </svg>

                                )
                            }
                        </button>
                    )
                }
            />
            {
                show.passwordForm ? (
                    <>
                        <FormPasswordInput
                            testId="newPassword"
                            name="newPassword"
                            label="Nueva contraseña"
                            maxLength={16}
                            aria-label="Campo de texto seguro, ingresa tu nueva contraseña"
                            placeholder="********"
                            isDisabled={isSubmitting}
                        />
                        <FormPasswordInput
                            testId="newPasswordConfirm"
                            name="newPasswordConfirm"
                            label="Repita la contraseña"
                            maxLength={16}
                            aria-label="Campo de texto seguro, confirma tu nueva contraseña"
                            placeholder="********"
                            isDisabled={isSubmitting}
                        />
                        <PasswordComparator
                            name="newPassword"
                        />
                    </>
                ) : null
            }
        </>
    )
}

export default PasswordForm