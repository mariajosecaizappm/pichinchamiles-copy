import { FormRef } from "@/presentation/components/Form/context/Form"
import FormContext from "@/presentation/components/Form/context/FormContext"
import FormInput from "@/presentation/components/Form/controls/FormInput"
import { RefObject, useContext } from "react"

type Props = {
    show: { emailForm: boolean; passwordForm: boolean }
    setShow: (show: { emailForm: boolean; passwordForm: boolean }) => void
    formRef: RefObject<FormRef | null>
}

const EmailForm = ({ show, setShow, formRef }: Props) => {
    const { isSubmitting } = useContext(FormContext);
    return (
        <>
            <FormInput
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="correo@mail.com"
                readOnly
                isDisabled={show.passwordForm || isSubmitting}
                endContent={
                    show.passwordForm ? null : (
                        <button
                            type="button"
                            className="w-6 h-6 flex items-center justify-center"
                            onClick={() => {
                                setShow({ ...show, emailForm: !show.emailForm })
                                if (!show.emailForm) {
                                    setTimeout(() => {
                                        formRef.current?.focusOn("newEmail")
                                    }, 0)
                                }
                            }}
                        >
                            {
                                show.emailForm ? (
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
                show.emailForm ? (
                    <>
                        <FormInput
                            testId="newEmail"
                            name="newEmail"
                            type="email"
                            label="Nuevo correo electrónico"
                            aria-label="Campo de texto seguro, ingresa tu nuevo correo electrónico"
                            placeholder="correo@mail.com"
                            isDisabled={isSubmitting}
                        />
                        <FormInput
                            testId="emailConfirmation"
                            name="emailConfirmation"
                            type="email"
                            label="Confirme su correo electrónico"
                            aria-label="Campo de texto seguro, confirma tu nuevo correo electrónico"
                            placeholder="correo@mail.com"
                            isDisabled={isSubmitting}
                        />
                    </>
                ) : null
            }
        </>
    )
}

export default EmailForm