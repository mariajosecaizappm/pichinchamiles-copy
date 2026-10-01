import React from 'react';
import List from '@/presentation/components/List';
import { discountsTerms } from '../data/discountsTerms';

const DiscountsSection: React.FC = () => (
    <List items={discountsTerms} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown"  />
);

export default DiscountsSection;
