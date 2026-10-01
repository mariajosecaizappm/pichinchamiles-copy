"use client"

import { FaqFrequentQuestion } from "@/domain/entity/Pqrs/pqrs";
import Link from "next/link";
import links from "@/presentation/config/links";
import DOMPurify from "dompurify";
import Accordion from "@/presentation/components/Accordion/Accordion";

type Props = {
    frequentQuestions: FaqFrequentQuestion[];
}

const HomeFaqs = ({ frequentQuestions }: Props) => {
    const accordionItems = frequentQuestions.map((question) => ({
        id: question.id,
        title: question.title,
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: typeof window !== 'undefined' ? DOMPurify.sanitize(question.description) : question.description,
                }}
            />
        ),
    }));

    return (
        <section 
            className="p-6 grid gap-4 md:p-10"
            aria-labelledby="faqs-title"
            aria-describedby="faqs-description"
        >
            <header className="text-center space-y-4">
                <h2 id="faqs-title" className="text-blue-500 typo-main-title">
                    ¿Tienes dudas?
                </h2>
                <p id="faqs-description" className="text-grayscale-500">Resolvemos tus preguntas más frecuentes</p>
            </header>

            <div className="w-full md:home-body-container" aria-label="Preguntas frecuentes">
                <Accordion items={accordionItems} />
            </div>

            <div className="flex justify-center">
                <Link href={links.faq}>
                    <button 
                        className="flex items-center gap-2 py-2.5 font-semibold text-information-500 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                        aria-label="Ver más preguntas frecuentes"
                    >
                        <span>Ver más preguntas</span>
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M0 8.825L3.81667 5L0 1.175L1.175 0L6.175 5L1.175 10L0 8.825Z" fill="#2F7ABF" />
                        </svg>
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default HomeFaqs;
