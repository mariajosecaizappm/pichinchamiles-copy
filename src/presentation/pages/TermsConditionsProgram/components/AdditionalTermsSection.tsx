import React from 'react';
import List from '@/presentation/components/List';
import { additionalTerms } from '../data/additionalTerms';

const AdditionalTermsSection: React.FC = () => (
    <List items={additionalTerms} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown"  />
);

export default AdditionalTermsSection;
