import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type { IPQRSSRepository } from '@/domain/repository/Pqrs/IPqrsRepository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { FaqCategoryWithQuestions } from '@/domain/entity/Pqrs/pqrs';

const FAQ_CATEGORY_ORDER = [
    'Información del programa',
    'Mi cuenta',
    'Productos',
    'Viajes',
] as const;

type FaqCategoryName = (typeof FAQ_CATEGORY_ORDER)[number];

@injectable()
export default class GetFaqsUseCase {
    private pqrsRepository: IPQRSSRepository;

    constructor(@inject(RepositoryTypes.PqrsRepository) pqrsRepository: IPQRSSRepository) {
        this.pqrsRepository = pqrsRepository;
    }

    async execute(): Promise<FaqCategoryWithQuestions[]> {
        const faqCategories = await this.pqrsRepository.getFaqCategories();
        const faqs = await this.pqrsRepository.getFrequentQuestions();

        const categoriesByName = new Map<FaqCategoryName, { id: string; name: string }>();

        faqCategories.forEach((category) => {
            const name = category.name.trim();
            if ((FAQ_CATEGORY_ORDER as readonly string[]).includes(name)) {
                categoriesByName.set(name as FaqCategoryName, category);
            }
        });

        return FAQ_CATEGORY_ORDER
            .filter((name) => categoriesByName.has(name))
            .map((name) => {
                const category = categoriesByName.get(name)!;
                return {
                    ...category,
                    questions: faqs.filter((faq) => faq.faqCategoryId === category.id),
                };
            });
    }
}
