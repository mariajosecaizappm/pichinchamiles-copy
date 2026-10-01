import React from 'react';
import List from '@/presentation/components/List';
import { conditionsHotels } from '../data/conditionsHotels';

const HotelsRedemptionSection: React.FC = () => (
    <List items={conditionsHotels} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
);

export default HotelsRedemptionSection;
