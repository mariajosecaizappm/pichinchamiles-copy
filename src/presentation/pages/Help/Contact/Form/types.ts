import { RequerimentType } from "@/domain/entity/Pqrs/requirement";
import { FormRef } from "@/presentation/components/Form/context/Form";
import { RefObject } from "react";

export interface ContactFormValues extends Record<string, unknown> {
    identificationNumber: string;
    identificationType: string;
    fullname: string;
    description: string;
    email: string;
    pqrsRequirementTypeId: string;
    pqrsRequirementSubTypeId: string
}


export type ContactFormProps = {
    memberInformation: Pick<ContactFormValues, 'identificationNumber' | 'identificationType' | 'fullname' | 'email'>;
    onCreateRequeriment: (values: ContactFormValues) => Promise<void>;
    formRef: RefObject<FormRef | null>
    requierimentTypes: RequerimentType[]
    isSuccessOpen: boolean
    onOpenSuccessChange: (value: boolean) => void
}