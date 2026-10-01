import React from 'react';
import List from '@/presentation/components/List';
import { conditionsCars } from '../data/conditionsCars';

const CarRedemptionSection: React.FC = () => (
    <List items={conditionsCars} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown"  />
);

export default CarRedemptionSection;
