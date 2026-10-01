import {
    FaqCategory,
    FaqFrequentQuestion,
    FaqListParams,
    FaqCategoryListParams
} from "@/domain/entity/Pqrs/pqrs";

export interface IPQRSSRepository {
  getFrequentQuestions(params?: FaqListParams): Promise<FaqFrequentQuestion[]>;
  getFaqCategories(params?: FaqCategoryListParams): Promise<FaqCategory[]>;

  getHomeFaqs(): FaqFrequentQuestion[];
}
