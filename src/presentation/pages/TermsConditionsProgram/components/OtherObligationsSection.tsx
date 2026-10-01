import React from 'react';
import List from '@/presentation/components/List';
import { otherObligations } from '../data/otherObligations';

const OtherObligationsSection: React.FC = () => {
    return (
        <div className="mb-4 [&>p]:base-paragraph [&>p]:font-medium [&>p]:leading-body-dropdown [&>p]:text-dropdown">
            <p>
                Pichincha Miles tiene las siguientes obligaciones:
            </p>
            <List items={otherObligations} className="pl-4 base-paragraph font-medium leading-body-dropdown text-dropdown" />
        </div>
    );
};

export default OtherObligationsSection;
