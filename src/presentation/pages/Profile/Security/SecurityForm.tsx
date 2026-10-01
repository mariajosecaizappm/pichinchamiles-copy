"use client"

import { Member } from "@/domain/entity/Member/member"
import Form, { FormRef } from "@/presentation/components/Form/context/Form"
import FormButton from "@/presentation/components/Form/controls/FormButton"
import { RefObject } from "react"
import * as Yup from "yup"
import EmailForm from "./components/EmailForm/EmailForm"
import PasswordForm from "./components/PasswordForm"
import { getInitialFormValues, getSecurityFormValidationSchema, SecurityFormSchemaType } from "./SecurityFormConfig"
import { SecurityFormValues } from "./types"

type Props = {
    member: Member
    show: { emailForm: boolean; passwordForm: boolean }
    setShow: (show: { emailForm: boolean; passwordForm: boolean }) => void
    onUpdateSecurityData: (values: SecurityFormValues) => Promise<void>
    formRef: RefObject<FormRef | null>

}

const SecurityForm = ({ onUpdateSecurityData, member, show, setShow, formRef }: Props) => {
    return (
        <div className="body-container pt-3 pb-6 md:max-w-[676px]">
            <Form<SecurityFormValues>
                ref={formRef}
                initialValues={getInitialFormValues(member)}
                onSubmit={onUpdateSecurityData}
                className="flex flex-col gap-4"
                schema={getSecurityFormValidationSchema(show.emailForm ? SecurityFormSchemaType.EMAIL : SecurityFormSchemaType.PASSWORD) as Yup.ObjectSchema<SecurityFormValues>}
            >
                <EmailForm formRef={formRef} show={show} setShow={setShow} />
                <PasswordForm formRef={formRef} show={show} setShow={setShow} />
                <FormButton>Guardar cambios</FormButton>
            </Form>
        </div>
    )
}

export default SecurityForm