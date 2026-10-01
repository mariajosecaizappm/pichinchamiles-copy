import { ListParams, StringListParam } from "../List/list";

export type FaqFrequentQuestion = {
    id: string;
    title: string;
    faqCategoryId: string;
    description: string;
}

export type FaqCategory = {
    id: string;
    name: string;
}


export type FaqCategoryWithQuestions = FaqCategory & {
    questions: FaqFrequentQuestion[]
}

export interface FaqCategoryListParams extends ListParams {
    name?: string | StringListParam
}

export interface FaqListParams extends ListParams {
    title?: string | StringListParam
    faqCategoryId?: string
}