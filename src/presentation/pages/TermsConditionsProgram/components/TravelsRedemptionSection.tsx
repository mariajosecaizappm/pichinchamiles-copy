import React from 'react';
import List from '@/presentation/components/List';
import { conditionsTravel } from '../data/conditionsTravel';

const TravelsRedemptionSection: React.FC = () => (
    <List items={conditionsTravel} className="mb-4 pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
);

export default TravelsRedemptionSection;
