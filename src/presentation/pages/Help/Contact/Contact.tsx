
import { ContactForm, ContactHeader } from "./";
import ContactFormWrapper from "./Form/ContactFormWrapper";

const Contact = () => {
    return (
        <div className="p-6 max-w-168 mx-auto">
            <div className="flex flex-col gap-4">
                <ContactHeader />
                <ContactFormWrapper>
                    {(member) => <ContactForm member={member} />}
                </ContactFormWrapper>
            </div>
        </div>
    );
};

export default Contact;