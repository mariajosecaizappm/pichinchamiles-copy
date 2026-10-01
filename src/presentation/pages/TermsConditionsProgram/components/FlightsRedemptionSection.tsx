import React from 'react';
import EmbeddedList from '@/presentation/components/EmbeddedList';
import { conditionsFlights } from '../data/conditionsFlights';

const FlightsRedemptionSection: React.FC = () => (
    <EmbeddedList items={conditionsFlights} className='mb-4 pl-4 space-y-0 *:base-paragraph *:font-medium *:leading-body-dropdown *:text-dropdown' subListClassName='*:text-dropdown' />
);

export default FlightsRedemptionSection;
