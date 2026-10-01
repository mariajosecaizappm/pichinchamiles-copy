"use client"

import Form from "@/presentation/components/Form/context/Form";
import ContactFormFields from "./components/ContactFormFields";
import ContactFormSubmitButton from "./components/ContactFormSubmitButton";
import ContactFormSuccessModal from "./components/ContactFormSuccessModal";
import { ContactFormValidationSchema, contactFormInitialValues } from "./ContactFormConfig";
import { ContactFormProps, ContactFormValues } from "./types";

const ContactForm = ({ memberInformation, onCreateRequeriment, formRef, requierimentTypes, isSuccessOpen, onOpenSuccessChange }: ContactFormProps) => {

    return (
        <>
            <Form<ContactFormValues>
                initialValues={{
                    ...contactFormInitialValues,
                    ...memberInformation
                }}
                enableReinitialize
                schema={ContactFormValidationSchema}
                onSubmit={onCreateRequeriment}
                formErrorId="contactFormAlert"
                ref={formRef}
            >
                <div className="flex flex-col gap-4">
                    <ContactFormFields requierimentTypes={requierimentTypes} />
                    <ContactFormSubmitButton />
                </div>
            </Form>
            <ContactFormSuccessModal isOpen={isSuccessOpen} onOpenChange={onOpenSuccessChange} />
        </>
    );
};

export default ContactForm;