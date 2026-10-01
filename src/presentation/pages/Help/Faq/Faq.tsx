'use client';

import { FaqCategoryWithQuestions } from '@/domain/entity/Pqrs/pqrs';
import Accordion, { AccordionItem } from '@/presentation/components/Accordion/Accordion';
import Tabs from '@/presentation/components/Tabs/Tabs';
import useSession from '@/presentation/hooks/useSession';
import { cn } from '@heroui/react';
import FaqAnswer from './FaqAnswer';
import { useFaqAccordion } from './hooks/useFaqAccordion';

type Props = {
    faqCategories: FaqCategoryWithQuestions[];
}

const Faq = ({ faqCategories }: Props) => {
    const {
        currentCategoryId,
        selectedKeys,
        activeCategory,
        stickyRef,
        accordionContainerRef,
        handleTabChange,
        handleSelectionChange,
    } = useFaqAccordion(faqCategories);

    const {isLogged} = useSession()

    if (!faqCategories.length) return null;

    const tabItems = faqCategories.map((category) => ({
        id: category.id,
        label: category.name,
        content: null,
    }));

    return (
        <div className="max-w-276 mx-auto flex flex-col gap-6 lg:gap-10">
            <div ref={stickyRef} className={cn("sticky  z-40 bg-white flex flex-col gap-6 lg:gap-10 pt-6 px-6 pb-2", isLogged ? "top-24.25 md:top-27.25 lg:top-18.25" : "top-15.25 md:top-18.25")}>
                <h1 className="text-center text-h2 leading-8 text-blue-500 font-slab">Preguntas frecuentes</h1>
                <Tabs
                    items={tabItems}
                    defaultTab={currentCategoryId}
                    fullWidth
                    classNames={{
                        tabList: "overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                        tabContent: "whitespace-nowrap",
                        panel: "hidden",
                    }}
                    onTabChange={handleTabChange}
                />
            </div>
            {activeCategory && (
                <div ref={accordionContainerRef} style={{ overflowAnchor: 'none' }}>
                    <Accordion
                        className='px-6 pb-6'
                        itemClassName="text-grayscale-400 [&_a]:text-information-500! py-0 pb-2"
                        items={activeCategory.questions.map((question, index): AccordionItem => ({
                            id: question.id,
                            title: question.title,
                            content: <FaqAnswer html={question.description} />,
                            hasHtml: false,
                            triggerClassName: index === 0 ? "pt-0" : undefined,
                        }))}
                        selectedKeys={selectedKeys}
                        onSelectionChange={handleSelectionChange}
                    />
                </div>
            )}
        </div>
    );
}

export default Faq